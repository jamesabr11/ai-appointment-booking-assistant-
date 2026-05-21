import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(
  process.cwd(),
  "..",
  "speech-assistant-openai-realtime-api-python",
  "call_logs",
  "appointments.db",
);

const INTERNAL_TABLES = ["appointment_statuses", "appointment_activity"];
const APPOINTMENT_TABLE_HINTS = [
  "appointments",
  "appointment",
  "bookings",
  "booking",
  "calls",
  "call_logs",
  "call_log",
];

const FIELD_CANDIDATES = {
  id: ["id", "appointment_id", "booking_id", "call_id"],
  customer_name: [
    "customer_name",
    "first_name",
    "name",
    "caller_name",
    "client_name",
    "full_name",
  ],
  customer_phone: [
    "customer_phone",
    "phone_number",
    "phone",
    "caller_phone",
    "client_phone",
    "number",
  ],
  customer_email: ["customer_email", "email", "client_email"],
  service: ["service", "service_name", "appointment_service"],
  barber: ["barber", "staff", "employee", "provider"],
  date: ["date", "booking_date", "appointment_date", "scheduled_date"],
  day: ["day", "booking_day", "appointment_day"],
  time: ["time", "booking_time", "appointment_time", "scheduled_time"],
  notes: ["notes", "note", "message", "transcript", "details"],
  status: ["status", "booking_status", "appointment_status"],
  source: ["source", "created_by", "channel"],
  created_at: [
    "created_at",
    "timestamp",
    "created",
    "date_created",
    "created_on",
  ],
  updated_at: ["updated_at", "updated", "modified_at"],
} as const;

export interface Appointment {
  id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  service: string;
  barber: string;
  date: string;
  day?: string;
  time: string;
  notes?: string | null;
  status?: "pending" | "confirmed" | "completed" | "cancelled" | string;
  source?: "website" | "phone" | "walk-in" | "ai" | string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string | null;
  total_visits?: number;
  last_visit?: string;
  created_at?: string;
}

export interface ActivityItem {
  id?: number;
  type:
    | "booking"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "deleted"
    | "updated"
    | string;
  message: string;
  appointment_id?: number | null;
  customer_name?: string | null;
  status?: string | null;
  created_at: string;
}

type TableInfo = {
  name: string;
  columns: string[];
};

function fileExists() {
  return fs.existsSync(DB_PATH);
}

function getDb(fileMustExist = true) {
  if (fileMustExist && !fileExists()) {
    return null;
  }

  const db = new Database(DB_PATH, { fileMustExist });
  db.pragma("journal_mode = WAL");
  return db;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function getTables(db: Database.Database): string[] {
  const rows = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    )
    .all() as { name: string }[];

  return rows
    .map((row) => row.name)
    .filter((name) => !INTERNAL_TABLES.includes(name));
}

function getColumns(db: Database.Database, table: string): string[] {
  const rows = db
    .prepare(`PRAGMA table_info(${quoteIdentifier(table)})`)
    .all() as { name: string }[];
  return rows.map((row) => row.name);
}

function findAppointmentTable(db: Database.Database): TableInfo | null {
  const tables = getTables(db);
  if (tables.length === 0) return null;

  const scored = tables
    .map((table) => {
      const lowerTable = table.toLowerCase();
      const columns = getColumns(db, table);
      const lowerColumns = columns.map((column) => column.toLowerCase());
      const tableScore = APPOINTMENT_TABLE_HINTS.some((hint) =>
        lowerTable.includes(hint),
      )
        ? 10
        : 0;
      const columnScore = [
        FIELD_CANDIDATES.customer_name,
        FIELD_CANDIDATES.customer_phone,
        FIELD_CANDIDATES.date,
        FIELD_CANDIDATES.day,
        FIELD_CANDIDATES.time,
      ].reduce(
        (score, candidates) =>
          score +
          (candidates.some((candidate) => lowerColumns.includes(candidate))
            ? 1
            : 0),
        0,
      );

      return { table, columns, score: tableScore + columnScore };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) return null;

  return { name: best.table, columns: best.columns };
}

function findColumn(columns: string[], candidates: readonly string[]) {
  const lowerMap = new Map(
    columns.map((column) => [column.toLowerCase(), column]),
  );
  for (const candidate of candidates) {
    const match = lowerMap.get(candidate.toLowerCase());
    if (match) return match;
  }
  return undefined;
}

function getValue(
  row: Record<string, unknown>,
  columns: string[],
  candidates: readonly string[],
  fallback = "",
) {
  const column = findColumn(columns, candidates);
  const value = column ? row[column] : undefined;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function getRowId(row: Record<string, unknown>, columns: string[]) {
  const idColumn = findColumn(columns, FIELD_CANDIDATES.id);
  const rawId = idColumn ? row[idColumn] : row.__rowid;
  const numericId = typeof rawId === "number" ? rawId : Number(rawId);
  return Number.isFinite(numericId) ? numericId : undefined;
}

function ensureStatusTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointment_statuses (
      source_table TEXT NOT NULL,
      source_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (source_table, source_id)
    )
  `);
}

function ensureActivityTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointment_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      appointment_id INTEGER,
      customer_name TEXT,
      status TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_appointment_activity_created_at ON appointment_activity(created_at);
  `);
}

function logActivity(
  db: Database.Database,
  activity: {
    type: string;
    message: string;
    appointment_id?: number | null;
    customer_name?: string | null;
    status?: string | null;
  },
) {
  ensureActivityTable(db);
  db.prepare(
    `
    INSERT INTO appointment_activity (type, message, appointment_id, customer_name, status, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `,
  ).run(
    activity.type,
    activity.message,
    activity.appointment_id ?? null,
    activity.customer_name ?? null,
    activity.status ?? null,
  );
}

function getStatusOverrides(db: Database.Database, tableName: string) {
  ensureStatusTable(db);
  const rows = db
    .prepare(
      "SELECT source_id, status FROM appointment_statuses WHERE source_table = ?",
    )
    .all(tableName) as { source_id: string; status: string }[];

  return new Map(rows.map((row) => [row.source_id, row.status]));
}

function normalizeAppointment(
  row: Record<string, unknown>,
  columns: string[],
  statusOverride?: string,
): Appointment {
  const id = getRowId(row, columns);
  const date = getValue(row, columns, FIELD_CANDIDATES.date);
  const day = getValue(row, columns, FIELD_CANDIDATES.day);

  return {
    id,
    customer_name: getValue(
      row,
      columns,
      FIELD_CANDIDATES.customer_name,
      "Unknown caller",
    ),
    customer_phone: getValue(
      row,
      columns,
      FIELD_CANDIDATES.customer_phone,
      "No phone number",
    ),
    customer_email:
      getValue(row, columns, FIELD_CANDIDATES.customer_email) || null,
    service: getValue(row, columns, FIELD_CANDIDATES.service, "Appointment"),
    barber: getValue(row, columns, FIELD_CANDIDATES.barber, "Team12"),
    date: date || day || "",
    day: day || undefined,
    time: getValue(row, columns, FIELD_CANDIDATES.time, "Time not set"),
    notes: getValue(row, columns, FIELD_CANDIDATES.notes) || null,
    status:
      statusOverride ||
      getValue(row, columns, FIELD_CANDIDATES.status, "pending"),
    source: getValue(
      row,
      columns,
      FIELD_CANDIDATES.source,
      "AI Voice Assistant",
    ),
    created_at: getValue(row, columns, FIELD_CANDIDATES.created_at),
    updated_at: getValue(row, columns, FIELD_CANDIDATES.updated_at),
  };
}

function readAppointments(
  whereClause = "",
  params: unknown[] = [],
): Appointment[] {
  const db = getDb(true);
  if (!db) return [];

  try {
    const table = findAppointmentTable(db);
    if (!table) return [];

    const idColumn = findColumn(table.columns, FIELD_CANDIDATES.id);
    const dateColumn = findColumn(table.columns, FIELD_CANDIDATES.date);
    const timeColumn = findColumn(table.columns, FIELD_CANDIDATES.time);
    const createdColumn = findColumn(
      table.columns,
      FIELD_CANDIDATES.created_at,
    );
    const orderParts = [dateColumn, timeColumn, createdColumn, idColumn]
      .filter(Boolean)
      .map((column) => quoteIdentifier(column as string));

    const orderBy = orderParts.length
      ? ` ORDER BY ${orderParts.join(", ")} DESC`
      : "";
    const rows = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)}${whereClause}${orderBy}`,
      )
      .all(...params) as Record<string, unknown>[];

    const statusOverrides = getStatusOverrides(db, table.name);

    return rows.map((row) => {
      const id = getRowId(row, table.columns);
      const override =
        id !== undefined ? statusOverrides.get(String(id)) : undefined;
      return normalizeAppointment(row, table.columns, override);
    });
  } finally {
    db.close();
  }
}

export function getDatabaseStatus() {
  const db = getDb(true);
  if (!db) {
    return {
      ok: false,
      message:
        "appointments.db was not found in the project root. Add the file beside package.json and refresh the dashboard.",
    };
  }

  try {
    const table = findAppointmentTable(db);
    if (!table) {
      return {
        ok: false,
        message:
          "appointments.db exists, but no appointment/bookings/calls table was found.",
      };
    }

    return {
      ok: true,
      message: `Reading bookings from table: ${table.name}`,
      table: table.name,
      columns: table.columns,
    };
  } finally {
    db.close();
  }
}

function createDefaultAppointmentsTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      service TEXT NOT NULL DEFAULT 'Appointment',
      barber TEXT NOT NULL DEFAULT 'Team12',
      date TEXT NOT NULL,
      day TEXT,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      source TEXT DEFAULT 'website',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
  `);
}

function getDayName(dateValue: string) {
  if (!dateValue) return "";
  const parsed = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { weekday: "long" });
}

function pickWritableTable(db: Database.Database): TableInfo {
  const tables = getTables(db);
  const exactAppointments = tables.find(
    (table) => table.toLowerCase() === "appointments",
  );

  if (exactAppointments) {
    return {
      name: exactAppointments,
      columns: getColumns(db, exactAppointments),
    };
  }

  const detected = findAppointmentTable(db);
  if (detected) return detected;

  createDefaultAppointmentsTable(db);
  return { name: "appointments", columns: getColumns(db, "appointments") };
}

function buildInsertForExistingTable(
  table: TableInfo,
  appointment: Appointment,
) {
  const dayName = appointment.day || getDayName(appointment.date);
  const valuesByField: Record<keyof typeof FIELD_CANDIDATES, unknown> = {
    id: undefined,
    customer_name: appointment.customer_name,
    customer_phone: appointment.customer_phone,
    customer_email: appointment.customer_email || null,
    service: appointment.service || "Appointment",
    barber: appointment.barber || "Team12",
    date: appointment.date,
    day: dayName || appointment.date,
    time: appointment.time,
    notes: appointment.notes || null,
    status: appointment.status || "pending",
    source: appointment.source || "website",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const insertColumns: string[] = [];
  const insertValues: unknown[] = [];

  for (const [field, candidates] of Object.entries(FIELD_CANDIDATES)) {
    if (field === "id") continue;
    const column = findColumn(table.columns, candidates);
    const value = valuesByField[field as keyof typeof FIELD_CANDIDATES];
    if (column && value !== undefined) {
      insertColumns.push(column);
      insertValues.push(value);
    }
  }

  return { insertColumns, insertValues };
}

export function createAppointment(appointment: Appointment): Appointment {
  const db = getDb(false);
  if (!db) throw new Error("Unable to open appointments.db");

  try {
    const table = pickWritableTable(db);
    const { insertColumns, insertValues } = buildInsertForExistingTable(
      table,
      appointment,
    );

    const hasName = Boolean(
      findColumn(insertColumns, FIELD_CANDIDATES.customer_name),
    );
    const hasPhone = Boolean(
      findColumn(insertColumns, FIELD_CANDIDATES.customer_phone),
    );
    const hasTime = Boolean(findColumn(insertColumns, FIELD_CANDIDATES.time));
    const hasDateOrDay = Boolean(
      findColumn(insertColumns, FIELD_CANDIDATES.date) ||
      findColumn(insertColumns, FIELD_CANDIDATES.day),
    );

    if (!hasName || !hasPhone || !hasTime || !hasDateOrDay) {
      createDefaultAppointmentsTable(db);
      const fallbackTable = {
        name: "appointments",
        columns: getColumns(db, "appointments"),
      };
      const fallback = buildInsertForExistingTable(fallbackTable, appointment);
      const placeholders = fallback.insertColumns.map(() => "?").join(", ");
      const result = db
        .prepare(
          `INSERT INTO appointments (${fallback.insertColumns.map(quoteIdentifier).join(", ")}) VALUES (${placeholders})`,
        )
        .run(...fallback.insertValues);
      const id = result.lastInsertRowid as number;
      logActivity(db, {
        type: "booking",
        message: `New booking from ${appointment.customer_name || "a customer"}`,
        appointment_id: id,
        customer_name: appointment.customer_name,
        status: appointment.status || "pending",
      });
      return {
        ...appointment,
        id,
        status: appointment.status || "pending",
        source: appointment.source || "website",
      };
    }

    const placeholders = insertColumns.map(() => "?").join(", ");
    const result = db
      .prepare(
        `INSERT INTO ${quoteIdentifier(table.name)} (${insertColumns.map(quoteIdentifier).join(", ")}) VALUES (${placeholders})`,
      )
      .run(...insertValues);

    const id = result.lastInsertRowid as number;
    logActivity(db, {
      type: "booking",
      message: `New booking from ${appointment.customer_name || "a customer"}`,
      appointment_id: id,
      customer_name: appointment.customer_name,
      status: appointment.status || "pending",
    });

    return {
      ...appointment,
      id,
      status: appointment.status || "pending",
      source: appointment.source || "website",
    };
  } finally {
    db.close();
  }
}

export function getAllAppointments(): Appointment[] {
  return readAppointments();
}

export function getAppointmentsByDate(date: string): Appointment[] {
  const db = getDb(true);
  if (!db) return [];

  try {
    const table = findAppointmentTable(db);
    if (!table) return [];

    const dateColumn = findColumn(table.columns, FIELD_CANDIDATES.date);
    const dayColumn = findColumn(table.columns, FIELD_CANDIDATES.day);
    const usableColumn = dateColumn || dayColumn;
    if (!usableColumn) return [];

    const rows = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)} WHERE ${quoteIdentifier(usableColumn)} = ?`,
      )
      .all(date) as Record<string, unknown>[];

    const statusOverrides = getStatusOverrides(db, table.name);

    return rows.map((row) => {
      const id = getRowId(row, table.columns);
      const override =
        id !== undefined ? statusOverrides.get(String(id)) : undefined;
      return normalizeAppointment(row, table.columns, override);
    });
  } finally {
    db.close();
  }
}

export function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
): Appointment[] {
  const db = getDb(true);
  if (!db) return [];

  try {
    const table = findAppointmentTable(db);
    if (!table) return [];

    const dateColumn = findColumn(table.columns, FIELD_CANDIDATES.date);
    if (!dateColumn) return [];

    const rows = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)} WHERE ${quoteIdentifier(dateColumn)} BETWEEN ? AND ? ORDER BY ${quoteIdentifier(dateColumn)} ASC`,
      )
      .all(startDate, endDate) as Record<string, unknown>[];

    const statusOverrides = getStatusOverrides(db, table.name);

    return rows.map((row) => {
      const id = getRowId(row, table.columns);
      const override =
        id !== undefined ? statusOverrides.get(String(id)) : undefined;
      return normalizeAppointment(row, table.columns, override);
    });
  } finally {
    db.close();
  }
}

export function getAppointmentById(id: number): Appointment | undefined {
  const db = getDb(true);
  if (!db) return undefined;

  try {
    const table = findAppointmentTable(db);
    if (!table) return undefined;

    const idColumn = findColumn(table.columns, FIELD_CANDIDATES.id);
    const whereColumn = idColumn ? quoteIdentifier(idColumn) : "rowid";

    const row = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)} WHERE ${whereColumn} = ?`,
      )
      .get(id) as Record<string, unknown> | undefined;

    if (!row) return undefined;

    const statusOverrides = getStatusOverrides(db, table.name);
    const override = statusOverrides.get(String(id));
    return normalizeAppointment(row, table.columns, override);
  } finally {
    db.close();
  }
}

export function updateAppointmentStatus(id: number, status: string): boolean {
  const db = getDb(true);
  if (!db) return false;

  try {
    const table = findAppointmentTable(db);
    if (!table) return false;

    const idColumn = findColumn(table.columns, FIELD_CANDIDATES.id);
    const statusColumn = findColumn(table.columns, FIELD_CANDIDATES.status);
    const updatedColumn = findColumn(
      table.columns,
      FIELD_CANDIDATES.updated_at,
    );
    const whereColumn = idColumn ? quoteIdentifier(idColumn) : "rowid";

    const existing = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)} WHERE ${whereColumn} = ?`,
      )
      .get(id) as Record<string, unknown> | undefined;

    if (!existing) return false;

    if (statusColumn) {
      const updatedSql = updatedColumn
        ? `, ${quoteIdentifier(updatedColumn)} = CURRENT_TIMESTAMP`
        : "";
      db.prepare(
        `UPDATE ${quoteIdentifier(table.name)} SET ${quoteIdentifier(statusColumn)} = ?${updatedSql} WHERE ${whereColumn} = ?`,
      ).run(status, id);
    }

    ensureStatusTable(db);
    db.prepare(
      `
      INSERT INTO appointment_statuses (source_table, source_id, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(source_table, source_id)
      DO UPDATE SET status = excluded.status, updated_at = CURRENT_TIMESTAMP
    `,
    ).run(table.name, String(id), status);

    const name = getValue(
      existing,
      table.columns,
      FIELD_CANDIDATES.customer_name,
      "Appointment",
    );
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    logActivity(db, {
      type: status,
      message: `${name} marked as ${statusLabel}`,
      appointment_id: id,
      customer_name: name,
      status,
    });

    return true;
  } finally {
    db.close();
  }
}

export function updateAppointment(
  id: number,
  appointment: Partial<Appointment>,
): boolean {
  const db = getDb(true);
  if (!db) return false;

  try {
    const table = findAppointmentTable(db);
    if (!table) return false;

    const idColumn = findColumn(table.columns, FIELD_CANDIDATES.id);
    const whereColumn = idColumn ? quoteIdentifier(idColumn) : "rowid";

    if (appointment.status !== undefined) {
      return updateAppointmentStatus(id, String(appointment.status));
    }

    const fieldMap: Record<string, readonly string[]> = {
      customer_name: FIELD_CANDIDATES.customer_name,
      customer_phone: FIELD_CANDIDATES.customer_phone,
      customer_email: FIELD_CANDIDATES.customer_email,
      service: FIELD_CANDIDATES.service,
      barber: FIELD_CANDIDATES.barber,
      date: FIELD_CANDIDATES.date,
      time: FIELD_CANDIDATES.time,
      notes: FIELD_CANDIDATES.notes,
      source: FIELD_CANDIDATES.source,
    };

    const updates: string[] = [];
    const values: unknown[] = [];

    for (const [key, candidates] of Object.entries(fieldMap)) {
      const value = appointment[key as keyof Appointment];
      const column = findColumn(table.columns, candidates);
      if (value !== undefined && column) {
        updates.push(`${quoteIdentifier(column)} = ?`);
        values.push(value);
      }
    }

    const updatedColumn = findColumn(
      table.columns,
      FIELD_CANDIDATES.updated_at,
    );
    if (updatedColumn)
      updates.push(`${quoteIdentifier(updatedColumn)} = CURRENT_TIMESTAMP`);

    if (updates.length === 0) return false;

    values.push(id);
    const result = db
      .prepare(
        `UPDATE ${quoteIdentifier(table.name)} SET ${updates.join(", ")} WHERE ${whereColumn} = ?`,
      )
      .run(...values);

    if (result.changes > 0) {
      const appointmentName = appointment.customer_name || `Appointment #${id}`;
      logActivity(db, {
        type: "updated",
        message: `${appointmentName} was updated`,
        appointment_id: id,
        customer_name: appointment.customer_name || null,
        status: appointment.status || null,
      });
    }

    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function deleteAppointment(id: number): boolean {
  const db = getDb(true);
  if (!db) return false;

  try {
    const table = findAppointmentTable(db);
    if (!table) return false;

    const idColumn = findColumn(table.columns, FIELD_CANDIDATES.id);
    const whereColumn = idColumn ? quoteIdentifier(idColumn) : "rowid";

    const existing = db
      .prepare(
        `SELECT rowid AS __rowid, * FROM ${quoteIdentifier(table.name)} WHERE ${whereColumn} = ?`,
      )
      .get(id) as Record<string, unknown> | undefined;

    const result = db
      .prepare(
        `DELETE FROM ${quoteIdentifier(table.name)} WHERE ${whereColumn} = ?`,
      )
      .run(id);

    ensureStatusTable(db);
    db.prepare(
      "DELETE FROM appointment_statuses WHERE source_table = ? AND source_id = ?",
    ).run(table.name, String(id));

    if (result.changes > 0) {
      const name = existing
        ? getValue(
            existing,
            table.columns,
            FIELD_CANDIDATES.customer_name,
            "Appointment",
          )
        : `Appointment #${id}`;
      logActivity(db, {
        type: "deleted",
        message: `${name} booking was deleted`,
        appointment_id: id,
        customer_name: name,
        status: "deleted",
      });
    }

    return result.changes > 0;
  } finally {
    db.close();
  }
}

export function getAppointmentStats() {
  const today = new Date().toISOString().split("T")[0];
  const appointments = getAllAppointments();

  return {
    today: appointments.filter((appointment) => appointment.date === today)
      .length,
    pending: appointments.filter(
      (appointment) => appointment.status === "pending",
    ).length,
    confirmed: appointments.filter(
      (appointment) => appointment.status === "confirmed",
    ).length,
    total: appointments.length,
  };
}

export function getRecentActivity(limit = 8): ActivityItem[] {
  let loggedActivity: ActivityItem[] = [];
  const db = getDb(false);

  if (db) {
    try {
      ensureActivityTable(db);
      loggedActivity = db
        .prepare(
          `
          SELECT id, type, message, appointment_id, customer_name, status, created_at
          FROM appointment_activity
          ORDER BY datetime(created_at) DESC, id DESC
          LIMIT ?
        `,
        )
        .all(Math.max(limit, 10)) as ActivityItem[];
    } finally {
      db.close();
    }
  }

  const loggedBookingIds = new Set(
    loggedActivity
      .filter(
        (activity) =>
          activity.type === "booking" &&
          activity.appointment_id !== null &&
          activity.appointment_id !== undefined,
      )
      .map((activity) => String(activity.appointment_id)),
  );

  const appointmentActivity = getAllAppointments()
    .filter(
      (appointment) =>
        appointment.id === undefined ||
        !loggedBookingIds.has(String(appointment.id)),
    )
    .map((appointment) => ({
      id: appointment.id,
      type: "booking",
      message: `New booking from ${appointment.customer_name || "a customer"}`,
      appointment_id: appointment.id ?? null,
      customer_name: appointment.customer_name,
      status: appointment.status || "pending",
      created_at: appointment.created_at || new Date().toISOString(),
    }));

  return [...loggedActivity, ...appointmentActivity]
    .sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || "")),
    )
    .slice(0, limit);
}

export function getAllCustomers(): Customer[] {
  const appointments = getAllAppointments();
  const customers = new Map<string, Customer>();

  for (const appointment of appointments) {
    const phone = appointment.customer_phone || "No phone number";
    const existing = customers.get(phone);
    customers.set(phone, {
      id: existing?.id || appointment.id,
      name: appointment.customer_name || existing?.name || "Unknown caller",
      phone,
      email: appointment.customer_email || existing?.email || null,
      total_visits: (existing?.total_visits || 0) + 1,
      last_visit:
        appointment.date || appointment.created_at || existing?.last_visit,
      created_at: existing?.created_at || appointment.created_at,
    });
  }

  return Array.from(customers.values()).sort((a, b) =>
    String(b.last_visit || "").localeCompare(String(a.last_visit || "")),
  );
}

export function getCustomerByPhone(phone: string): Customer | undefined {
  return getAllCustomers().find((customer) => customer.phone === phone);
}

export function getCustomerAppointments(phone: string): Appointment[] {
  return getAllAppointments().filter(
    (appointment) => appointment.customer_phone === phone,
  );
}

export function clearAllAppointments(): boolean {
  const db = getDb(true);
  if (!db) return false;

  try {
    const table = findAppointmentTable(db);
    if (!table) return false;

    db.prepare(`DELETE FROM ${quoteIdentifier(table.name)}`).run();
    ensureStatusTable(db);
    db.prepare("DELETE FROM appointment_statuses WHERE source_table = ?").run(
      table.name,
    );
    return true;
  } finally {
    db.close();
  }
}

export function clearAllCustomers(): boolean {
  return true;
}

export default null;
