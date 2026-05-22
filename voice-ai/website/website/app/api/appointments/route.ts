import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentsByDateRange,
  getAppointmentStats,
  getDatabaseStatus,
  hasConfirmedAppointmentConflict,
} from "@/lib/db";

export const runtime = "nodejs";

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validatePhoneNumber(value: string) {
  return value.replace(/\D/g, "").length === 10;
}

function dateOnly(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value: Date, days: number) {
  const copy = new Date(value);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function validateBookingDate(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return "Pick a valid appointment date.";
  }

  const selected = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(selected.getTime())) {
    return "Pick a valid appointment date.";
  }

  const today = new Date();
  const minDate = dateOnly(today);
  const maxDate = dateOnly(addDays(today, 14));
  const selectedDay = selected.getDay();

  if (dateValue < minDate || dateValue > maxDate) {
    return "Appointments can only be booked within the next 14 days.";
  }

  if (selectedDay === 0 || selectedDay === 6) {
    return "Weekend bookings are not available. Please choose a weekday.";
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const stats = searchParams.get("stats");

    if (stats === "true") {
      const appointmentStats = getAppointmentStats();
      return NextResponse.json({
        ...appointmentStats,
        database: getDatabaseStatus(),
      });
    }

    if (date) {
      const appointments = getAppointmentsByDate(date);
      return NextResponse.json(appointments);
    }

    if (startDate && endDate) {
      const appointments = getAppointmentsByDateRange(startDate, endDate);
      return NextResponse.json(appointments);
    }

    const appointments = getAllAppointments();
    const database = getDatabaseStatus();
    const response = NextResponse.json(appointments);
    response.headers.set("x-database-status", database.message);
    return response;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "customer_name",
      "customer_phone",
      "service",
      "barber",
      "date",
      "time",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const source = String(body.source || "Website Form");
    const isPublicWebsiteBooking = source.toLowerCase().includes("website");

    if (isPublicWebsiteBooking) {
      const dateError = validateBookingDate(String(body.date));
      if (dateError) {
        return NextResponse.json({ error: dateError }, { status: 400 });
      }
    }

    if (!validatePhoneNumber(String(body.customer_phone))) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 },
      );
    }

    if (
      isPublicWebsiteBooking &&
      hasConfirmedAppointmentConflict(String(body.date), String(body.time))
    ) {
      return NextResponse.json(
        {
          error: "That time is already confirmed. Please choose another time.",
        },
        { status: 409 },
      );
    }

    const appointment = createAppointment({
      customer_name: body.customer_name,
      customer_phone: formatPhoneNumber(String(body.customer_phone)),
      customer_email: body.customer_email,
      service: body.service,
      barber: body.barber,
      date: body.date,
      time: body.time,
      notes: body.notes,
      status: body.status || "pending",
      source,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create appointment",
      },
      { status: 500 },
    );
  }
}
