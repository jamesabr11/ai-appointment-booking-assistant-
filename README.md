# AI Appointment Booking Assistant

An AI phone receptionist for a barbershop. Customers call a Twilio phone number and talk to an AI voice assistant, powered by the **OpenAI Realtime API**, that collects their appointment details in a natural spoken conversation. Each confirmed booking is written to a **SQLite** database. Shop staff manage those bookings from a locally hosted **Next.js** website and admin dashboard.

> Built as a team project (Team 12) for an agile development course.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the Application](#running-the-application)
- [OpenAI Realtime API Integration](#openai-realtime-api-integration)
- [Twilio Voice Integration](#twilio-voice-integration)
- [Appointment Management Dashboard](#appointment-management-dashboard)
- [Express Dashboard (Earlier Version)](#express-dashboard-earlier-version)
- [Limitations](#limitations)
- [Acknowledgements](#acknowledgements)

---

## How It Works

1. **A customer calls** the shop's Twilio phone number.
2. **Twilio handles the call** by sending a webhook to the voice server's `/incoming-call` endpoint. The server replies with TwiML that opens a bidirectional **Media Stream** to `wss://<host>/media-stream`.
3. **The server connects to the OpenAI Realtime API** over a second WebSocket and relays the caller's audio (G.711 μ-law) to OpenAI in real time.
4. **The AI assistant speaks with the caller**, asking one question at a time for their first name, phone number, appointment day, and appointment time.
5. **The server validates every answer** as it arrives. It parses spoken dates and times, enforces business hours and the booking window, rejects slots that are already booked, and asks the caller to fix anything invalid. It then reads all the details back for a yes/no confirmation.
6. **Once the caller confirms**, the appointment is inserted into `voice-assistant/call_logs/appointments.db`, a transcript is saved next to it, and the server ends the call through the Twilio REST API.
7. **Staff open the website's admin dashboard** (`/admin`) to view, confirm, edit, complete, cancel, or delete bookings. The dashboard reads and writes the same SQLite database.

---

## Key Features

### Voice assistant
- Natural, low-latency phone conversations using OpenAI's `gpt-realtime` speech-to-speech model.
- Caller speech transcribed with `gpt-4o-mini-transcribe`, with server-side voice activity detection.
- Deterministic, server-driven dialogue: the server decides the next question and tells the model exactly what to say, so the conversation can't drift.
- Booking rules enforced in code:
  - Weekdays only (Monday–Friday), within the next **14 days**
  - Business hours **10:00 AM – 4:30 PM** (last slot), in **30-minute** intervals
  - No double-booking; if a slot is taken, the assistant offers the next available times
- Understands phrases like "next Friday", "May fifteenth", "tomorrow", spelled-out names, spoken phone numbers, and times given without AM/PM (it asks which one).
- Handles corrections ("no, my phone number is wrong") and barge-in: if the caller interrupts, the assistant's audio is cut off.
- Saves a per-call transcript and hangs up automatically after the goodbye.

### Website and admin dashboard
- Public barbershop website (home, about, team, portfolio, reviews, FAQ, contact) with an online booking form.
- Booking form with a calendar picker limited to weekdays in the next 14 days. The same rules are validated on the server.
- Admin dashboard with:
  - **Overview:** appointment stats, today's appointments, recent activity feed
  - **Bookings:** full create / read / update / delete, plus confirm / complete / cancel status actions
  - **Calendar:** month view of appointments by date
  - **Customers:** customer list built from completed appointments, grouped by phone number
  - **Settings:** business info and hours form (UI only, see [Limitations](#limitations))
- Each booking is tagged with its source: AI phone assistant, website form, or admin dashboard.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Voice server | Python 3.9+, FastAPI, Uvicorn, `websockets` |
| AI | OpenAI Realtime API (`gpt-realtime`), `gpt-4o-mini-transcribe` |
| Telephony | Twilio Programmable Voice, TwiML, Media Streams, Twilio REST API (Python SDK) |
| Database | SQLite (`sqlite3` in Python, `better-sqlite3` in Node) |
| Website / dashboard | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Radix UI), Framer Motion, Lucide icons |
| Data fetching | SWR, Next.js Route Handlers (`app/api/*`) |
| Local tunnel | ngrok (exposes the voice server to Twilio) |
| CI | GitHub Actions |

---

## Architecture

```
            ┌──────────────┐
  Caller ──▶│ Twilio Voice │
            └──────┬───────┘
                   │ 1. POST /incoming-call (webhook) → TwiML <Connect><Stream>
                   │ 2. WebSocket /media-stream (μ-law audio, both directions)
                   ▼
   ┌──────────────────────────────────┐      WebSocket      ┌──────────────────────┐
   │  voice-assistant/  (FastAPI)     │◀───────────────────▶│ OpenAI Realtime API  │
   │  • relays audio                  │  audio + events     │ gpt-realtime         │
   │  • parses & validates answers    │                     └──────────────────────┘
   │  • saves booking + transcript    │
   │  • hangs up via Twilio REST API  │
   └───────────────┬──────────────────┘
                   │ INSERT
                   ▼
        call_logs/appointments.db  (SQLite)
                   ▲
                   │ better-sqlite3 (server-side only)
   ┌───────────────┴──────────────────┐
   │  web/  (Next.js)                 │
   │  • /api/* route handlers         │◀──── Admin & customers (browser)
   │  • public site + booking form    │
   │  • /admin dashboard              │
   └──────────────────────────────────┘
```

The voice server and the website are separate processes. **The SQLite file is the only thing they share.** The browser never touches the database directly; every read and write goes through the Next.js API routes.

---

## Project Structure

```
.
├── voice-assistant/            # Python voice server (Twilio ↔ OpenAI Realtime)
│   ├── main.py                 # FastAPI app: webhook, media stream, dialogue logic, DB writes
│   ├── requirements.txt        # Pinned Python dependencies
│   ├── call_logs/              # Runtime output: appointments.db + call transcripts (git-ignored)
│   └── LICENSE                 # MIT license of the Twilio sample this server is based on
│
├── web/                        # Next.js website + admin dashboard
│   ├── app/
│   │   ├── page.tsx            # Public home page (with booking form)
│   │   ├── about/ team/ portfolio/ reviews/ faq/ contact/
│   │   ├── admin/              # Admin login + dashboard (overview, bookings, calendar, customers, settings)
│   │   └── api/                # Route handlers: appointments, appointments/[id], appointments/clear,
│   │                           #                 customers, activity
│   ├── components/             # Page sections, admin components, shadcn/ui primitives (components/ui)
│   ├── hooks/                  # use-mobile, use-toast
│   ├── lib/
│   │   ├── db.ts               # SQLite data layer (better-sqlite3)
│   │   ├── types.ts            # Shared types, services and barbers
│   │   ├── auth-context.tsx    # Admin login state
│   │   └── bookings-context.tsx
│   ├── public/                 # Icons and gallery images
│   └── package.json
│
├── express-dashboard/          # Earlier standalone Express + SQLite admin dashboard
│   ├── app.js
│   ├── public/                 # Static HTML/CSS/JS calendar UI and login page
│   └── package.json
│
├── .github/workflows/          # CI (on push) and Render deploy hook (on merge)
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## Prerequisites

| Requirement | Notes |
|---|---|
| **Python 3.9+** | For the voice server |
| **Node.js 20+** and npm | For the website (Next.js 16 needs Node ≥ 20.9) |
| **OpenAI API key** | With access to the Realtime API |
| **Twilio account** | A phone number with **Voice** capability, plus your Account SID and Auth Token |
| **ngrok** (or similar) | Gives Twilio a public HTTPS/WSS URL for your local voice server |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/jamesabr11/ai-appointment-booking-assistant-.git
cd ai-appointment-booking-assistant-
```

### 2. Voice assistant

```bash
cd voice-assistant
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env            # then edit .env with your real keys
```

### 3. Website and admin dashboard

```bash
cd web
npm install
```

### 4. Twilio phone number

1. Start the voice server and ngrok (see [Running the Application](#running-the-application)).
2. In the Twilio Console, open **Phone Numbers → Manage → Active numbers** and select your number.
3. Under **Voice Configuration → A call comes in**, choose **Webhook** and set:
   - URL: `https://<your-ngrok-subdomain>.ngrok-free.app/incoming-call`
   - Method: `HTTP POST`
4. Save. ngrok gives you a new URL each time it restarts (unless you have a reserved domain), so update the webhook whenever that happens.

---

## Environment Variables

The voice server loads variables from a `.env` file using `python-dotenv`. Copy [`.env.example`](.env.example) to `voice-assistant/.env`.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | **Yes** | — | Authenticates the Realtime API WebSocket. The server won't start without it. |
| `TWILIO_ACCOUNT_SID` | Recommended | — | Lets the server end the call through the Twilio REST API after a booking is saved |
| `TWILIO_AUTH_TOKEN` | Recommended | — | Paired with the Account SID. If either is missing, the server prints a warning and skips auto-hangup. |
| `PORT` | No | `5050` | Port the FastAPI server listens on |
| `TEMPERATURE` | No | `0.8` | Sent with the Realtime connection |
| `OPENAI_VOICE` | No | `alloy` | Voice the assistant speaks with |
| `HANGUP_DELAY_SECONDS` | No | `4` | Wait time after the goodbye before hanging up |
| `APPOINTMENTS_DB_PATH` | No | `../voice-assistant/call_logs/appointments.db` | **Website only:** put this in `web/.env.local` to point the dashboard at a different SQLite file |

> **Never commit real credentials.** `.env` files, databases, and call logs are all excluded by `.gitignore`.

---

## Database

Both applications use a single SQLite file:

```
voice-assistant/call_logs/appointments.db
```

- **Created automatically.** The voice server creates the file and the `appointments` table on startup if they don't exist.
- **Shared.** The Next.js app opens the same file through `better-sqlite3`, resolving it from `web/` as `../voice-assistant/call_logs/appointments.db`. Set `APPOINTMENTS_DB_PATH` to use a different location.

### `appointments` table (created by the voice server)

| Column | Type | Example |
|---|---|---|
| `id` | INTEGER PK | `1` |
| `name` | TEXT | `Alex` |
| `phone_number` | TEXT | `604-555-0123` |
| `booking_day` | TEXT | `Friday` |
| `booking_date` | TEXT | `2026-05-15` |
| `booking_time` | TEXT | `2:30 PM` |
| `created_at` | TEXT | `2026-05-11 17:38:47` |

### Supporting tables (created by the website)

The dashboard tracks status, source, and history without changing the voice server's schema. It does this with side tables keyed by the source table and row ID:

| Table | Purpose |
|---|---|
| `appointment_statuses` | Status for each booking: `pending`, `confirmed`, `completed`, `cancelled` |
| `appointment_sources` | Where the booking came from: AI phone assistant, website form, admin dashboard |
| `appointment_activity` | Activity log shown on the dashboard overview |

`web/lib/db.ts` maps column names flexibly (for example `name`, `first_name`, or `customer_name`), so the dashboard can read the voice server's table without a migration. To support a differently shaped table, add its column names to `FIELD_CANDIDATES` in that file.

---

## Running the Application

Use three terminals.

**Terminal 1: voice server**

```bash
cd voice-assistant
source .venv/bin/activate
python main.py                     # http://localhost:5050
```

**Terminal 2: public tunnel for Twilio**

```bash
ngrok http 5050
```

Copy the `https://…` forwarding URL into your Twilio number's webhook (see [Setup step 4](#4-twilio-phone-number)).

**Terminal 3: website and admin dashboard**

```bash
cd web
npm run dev                        # http://localhost:3000
```

Now call your Twilio number. After the call ends, open **http://localhost:3000/admin** to see the booking.

| Endpoint | Server | Description |
|---|---|---|
| `GET /` | Voice (5050) | Health check |
| `GET /appointments` | Voice (5050) | All stored appointments as JSON |
| `GET/POST /incoming-call` | Voice (5050) | Twilio voice webhook, returns TwiML |
| `WS /media-stream` | Voice (5050) | Twilio Media Stream WebSocket |
| `/` | Web (3000) | Public website and booking form |
| `/admin` | Web (3000) | Admin dashboard |

Other website scripts: `npm run build`, `npm start` (production), `npm run lint`.

---

## OpenAI Realtime API Integration

For each call, `voice-assistant/main.py` opens a WebSocket to:

```
wss://api.openai.com/v1/realtime?model=gpt-realtime
```

Then it sends a `session.update` that sets up:

- **Audio in and out as `audio/pcmu`** (G.711 μ-law). This is Twilio's native format, so audio passes straight through with no transcoding.
- **Input transcription** with `gpt-4o-mini-transcribe`, so the server gets text for every caller turn.
- **Server VAD turn detection** with `create_response: false`. The model detects when the caller stops speaking but does **not** reply on its own.
- **System instructions** containing today's date and the shop's booking rules.

### Server-driven conversation

The model doesn't run the dialogue freely. The Python server keeps a state machine (`call_details` plus the `expected_field` currently being asked for):

1. When `conversation.item.input_audio_transcription.completed` arrives, the server parses the caller's text with deterministic functions such as `clean_first_name`, `clean_phone_number`, `parse_booking_day_and_date`, and `clean_booking_time`.
2. It validates the result against the business rules (`is_valid_booking_time`, `is_30_min_interval`, `is_within_14_day_window`, `is_slot_available`, …).
3. It sends `response.create` with **the exact sentence to say next**: the next question, an error with suggested free times, or the confirmation read-back.
4. Audio from `response.output_audio.delta` is streamed back to Twilio.
5. When `input_audio_buffer.speech_started` arrives (the caller interrupted), the server sends `conversation.item.truncate` and clears Twilio's audio buffer so the assistant stops talking.

Splitting the work this way lets the model handle natural voice, while code handles correctness: phone numbers are never guessed, and times are never double-booked.

---

## Twilio Voice Integration

| Step | Twilio feature | Code |
|---|---|---|
| Incoming call hits the webhook | Programmable Voice webhook | `@app.api_route("/incoming-call")` |
| Server answers with `<Connect><Stream url="wss://…/media-stream">` and passes the `CallSid` as a stream parameter | TwiML (`twilio.twiml.voice_response`) | `handle_incoming_call` |
| Two-way audio over WebSocket (`start`, `media`, `mark` events) | Media Streams | `@app.websocket("/media-stream")` |
| Playback tracking with `mark` events, so interruptions cut audio at the right point | Media Streams marks | `send_mark`, `handle_speech_started_event` |
| Call ended after the booking is saved | REST API: `calls(sid).update(status="completed")` | `end_call_later` |

The stream URL is built from the request's hostname, so whatever public URL Twilio reached (for example the ngrok domain) is reused for the WebSocket.

---

## Appointment Management Dashboard

The admin dashboard lives in `web/app/admin` and gets its data from the Next.js API routes in `web/app/api`.

| Route | Methods | Purpose |
|---|---|---|
| `/api/appointments` | `GET`, `POST` | List appointments (filter with `?date=`, `?startDate=&endDate=`, or get stats with `?stats=true`), or create one |
| `/api/appointments/[id]` | `GET`, `PATCH`, `DELETE` | Read, update (fields or status), or delete one appointment |
| `/api/appointments/clear` | `DELETE` | Clear all appointments and customers |
| `/api/customers` | `GET` | Customers built from completed appointments |
| `/api/activity` | `GET` | Recent activity feed |

**Server-side validation on create:**
- Phone numbers must have exactly 10 digits.
- Bookings from the public website must be a weekday within the next 14 days.
- A new booking can't take a date and time that already has a **confirmed** appointment (returns `409`).

**Admin login:** go to `/admin`. Demo credentials are defined in `web/lib/auth-context.tsx`: username `admin`, password `pass2026`.

---

## Express Dashboard (Earlier Version)

`express-dashboard/` holds the team's first admin dashboard, built before the Next.js app. It's a small Express 5 server with:

- Email and password login (scrypt-hashed passwords, in-memory sessions, HttpOnly cookie)
- A static calendar UI (`public/`) with CRUD for appointments through `/api/appointments`
- Its own `express-dashboard/appointments.db`, created on first run and seeded with a demo user defined in `app.js`

```bash
cd express-dashboard
npm install
npm start                          # http://localhost:3000
```

It uses port `3000`, the same as the Next.js dev server, so don't run both at once. It's kept for reference and for the CI workflow. The Next.js dashboard in `web/` replaces it and is the one connected to the voice assistant.

---

## Limitations

This is a course project that runs locally. It is **not** hardened for production:

- **Admin authentication is client-side only.** Credentials are hard-coded in `web/lib/auth-context.tsx` and login state lives in `localStorage`. The `/api/*` routes are not protected.
- **The Settings page doesn't save anything.** Business hours and similar values used by the voice assistant are constants in `voice-assistant/main.py`.
- **Incoming Twilio webhooks are not signature-validated.**
- **SQLite with a shared file** is fine for a single machine but not for concurrent multi-server use.
- **The voice assistant speaks English only**, by design.

---

## Acknowledgements

- The voice server started from Twilio's [speech-assistant-openai-realtime-api-python](https://github.com/twilio-samples/speech-assistant-openai-realtime-api-python) sample (MIT; see `voice-assistant/LICENSE`) and was extended with the booking dialogue, validation, and SQLite persistence.
- UI components from [shadcn/ui](https://ui.shadcn.com/).
