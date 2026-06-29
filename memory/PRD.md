# Junagadh CPE Study Chapter — PRD

## Original Problem Statement
Website for Junagadh CPE Study Chapter (a Study Chapter under WIRC of ICAI).
Tech: React (Tailwind + Shadcn) + FastAPI + MongoDB.

## Core Requirements
- Real office bearers only: CA. Dhruval Kathiriya (Convener), CA. Ashish Makwana (Dy. Convener).
- Reading Room Library registration form.
- Real June 2026 newsletter ("The Chartered Accountant - Inaugural Edition") in publications.
- Remove all placeholder/dummy data.
- Public Members Directory with registration form + listing.

## User-confirmed decisions (June 2026)
- Keep ONLY the two real committee members; remove all other (placeholder) members.
- Remove all demo content (events, notices, gallery, announcements) but KEEP the June 2026 newsletter.
- KEEP home page stats.
- Members Directory = public registration form. Fields shown: Name, Membership No., Firm, Phone, Email, Address, Photo.
- Contact phones (real): Dhruval +91 76985 32780, Ashish +91 96241 06740.

## Architecture
```
/app/backend/server.py   # FastAPI; setup_database() one-time demo cleanup + ensures real data; object storage helpers
/app/frontend/src/
  App.js                 # routes incl. /directory
  components/Navbar.js, Footer.js
  pages/Home.js, About.js, Events.js, Committee.js, Gallery.js,
        Noticeboard.js, Newsletter.js, Contact.js, Library.js, Directory.js
```

## Integrations
- Emergent Object Storage (EMERGENT_LLM_KEY in backend/.env) — Members Directory photos + admin uploads (/api/admin/upload → /api/files/{id}).
- JWT auth (PyJWT + bcrypt) for the admin panel. JWT_SECRET/ADMIN_EMAIL/ADMIN_PASSWORD in backend/.env.

## Admin Panel (P1 — done June 9, 2026)
- Login: /admin/login → dashboard /admin. Creds in /app/memory/test_credentials.md (admin@junagadhcpe.org / JunagadhCPE@2026).
- Auth: Bearer JWT (localStorage 'cpe_admin_token'); brute-force lockout (5 fails/15 min).
- Manage: Events, Newsletters, Notices, Committee, Gallery (full CRUD); Directory moderation (approve/reject/delete); view Library/Contact/Event-registration submissions; dashboard stats.
- Members Directory submissions now create status="pending" and only appear publicly after admin approval.
- Image/file upload field in admin forms (generic /api/admin/upload). Frontend resolveAsset() prefixes backend URL for /api/files paths.

## Key API endpoints
- GET /api/committee (2 real members, with phone)
- GET /api/newsletters (June 2026)
- GET /api/events, /notices, /gallery (3 Batch 749 photos), /announcements
- POST /api/events/{id}/register, /api/contact, /api/library/register
- GET /api/directory (approved only), POST /api/directory/register (pending), GET /api/directory/photo/{id}
- POST /api/auth/login, GET /api/auth/me
- /api/admin/* (protected): upload, events/newsletters/notices/committee/gallery CRUD, directory approve/reject/delete, library/contact/event-registrations, stats
- GET /api/files/{id} (serves uploaded assets)

## DB collections
- committee, newsletters, events, notices, gallery, announcements
- registrations, contact_messages, library_registrations
- directory {id,name,email,phone,membership_no,firm,address,photo_path,status,created_at}
- migrations {_id:"remove_demo_v1"} (cleanup guard)

## Status — Implemented (June 9, 2026)
- ✅ Removed all placeholder/dummy data (committee, events, notices, gallery, announcements, contact address/map, About timeline, Library fee brackets).
- ✅ Committee shows only the 2 real members with phone numbers + Directory CTA.
- ✅ Members Directory feature (form + photo upload via object storage + listing + search). Tested 16/16 backend + full frontend.
- ✅ Footer/Contact use real phones; placeholders removed.
- ✅ Home hides empty demo sections; stats kept; quick-access includes Directory.

## Backlog (P1/P2)
- ✅ P1: Admin panel (done) and directory approval flow (done).
- P1 (remaining): public member authentication for library/directory submissions (optional).
- P2: WhatsApp chat button.
- P2: Directory pagination, MIME/file-size validation on public + upload endpoints.
- Tech debt: migrate FastAPI startup/shutdown to lifespan; optional shadcn Calendar for admin date inputs; admin /auth/refresh for longer sessions.
