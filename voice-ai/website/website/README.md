# Team12 Barbershop Website

Next.js website and admin dashboard for the Team12 AI Barbershop Assistant.

The voice AI assistant is separate. This repo only contains the website/admin dashboard.

## Install

```bash
pnpm install
```

If you do not have pnpm installed:

```bash
npm install -g pnpm
pnpm install
```

## Run locally

```bash
pnpm dev
```

Open the site at the local URL shown in the terminal.

## Admin login

Go to:

```text
/admin
```

Credentials for the demo/admin dashboard:

```text
username: admin
password: pass2026
```

## Connecting appointments.db

Place your SQLite database file in the project root, beside `package.json`:

```text
team12-barbershop-website/
├─ app/
├─ components/
├─ package.json
└─ appointments.db
```

Do not commit the real database. The `.gitignore` file ignores `appointments.db`, `.env`, and local database sidecar files.

The dashboard reads `appointments.db` server-side through Next.js API routes. The frontend never reads the database directly.

## Supported database columns

The database reader is flexible. It looks for appointment-like tables such as:

```text
appointments, bookings, calls, call_logs
```

It maps common column names such as:

```text
name, first_name, caller_name, customer_name
phone, phone_number, caller_phone, customer_phone
date, booking_date, appointment_date
day, booking_day, appointment_day
time, booking_time, appointment_time
created_at, timestamp, created
```

If your table or columns use different names, update `lib/db.ts` and add your column names to `FIELD_CANDIDATES`.

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint
```

## Security notes

Do not commit:

```text
.env
.env.local
appointments.db
call_logs/
```

Keep OpenAI, Twilio, and other API keys outside this repository.

## Latest admin CRUD and booking updates

The admin Bookings page now supports full booking management:

- Add a booking from the admin dashboard.
- Edit a single booking's name, phone, email, service, barber, date, time, notes, status, and source.
- Delete one booking without clearing the full database.
- Confirm, complete, or cancel a booking.

The public booking form uses a calendar picker. Weekends are disabled/red, and customers can only select weekdays from today through the next 14 days. The API validates the same rule on the server so users cannot bypass the frontend calendar.

Website-created bookings are saved with the source `Website Form`. Admin-created bookings are saved with the source `Admin Dashboard`. AI/phone bookings still show as AI voice assistant bookings.
