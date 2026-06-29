from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Response, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests
import jwt
import bcrypt
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALG = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@junagadhcpe.org")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


# ─── Object Storage ─────────────────────────────────────────────────────────

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "junagadh-cpe"
storage_key = None


def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ─── Auth helpers ─────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(email: str) -> str:
    payload = {
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email")})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return {"email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}


# ─── Models ───────────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    email: str
    password: str


class RegistrationCreate(BaseModel):
    name: str
    email: str
    phone: str
    membership_no: str = ""


class EventRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_id: str
    name: str
    email: str
    phone: str
    membership_no: str = ""
    registered_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str
    message: str


class LibraryRegistrationCreate(BaseModel):
    name: str
    email: str
    phone: str
    membership_no: str = ""
    category: str
    duration: str
    comments: str = ""


class EventIn(BaseModel):
    title: str
    description: str = ""
    date: str
    end_date: str = ""
    venue: str = ""
    fee: float = 0.0
    category: str = "General"
    is_open: bool = True
    cpe_hours: float = 0.0
    banner_url: str = ""


class NewsletterIn(BaseModel):
    title: str
    type: str = "member"
    month: str = ""
    year: int = 2026
    pdf_url: str = "#"
    cover_url: str = ""


class NoticeIn(BaseModel):
    title: str
    description: str = ""
    type: str = "member"
    date: str
    pdf_url: str = "#"
    category: str = "General"


class CommitteeIn(BaseModel):
    name: str
    designation: str
    order: int = 99
    category: str = "office_bearer"
    photo_url: str = ""
    email: str = ""
    phone: str = ""


class GalleryIn(BaseModel):
    title: str
    photo_url: str
    album: str = "General"
    event_date: str = ""


# ─── Real Chapter Data ──────────────────────────────────────────────────────

DHRUVAL_PHOTO = "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/mgjn3ess_DHRUVAL.png"
ASHISH_PHOTO = "https://customer-assets.emergentagent.com/job_junagadh-cpe/artifacts/zxl7v5ow_Ashish.jpeg"
JUNE_2026_PDF = "https://customer-assets.emergentagent.com/job_junagadh-cpe/artifacts/4stjru1o_Junagadh%20CPE%20Study%20Chapter%20June%202026%20Edittion.pdf"

REAL_COMMITTEE = [
    {"id": "cm-001", "name": "CA. Dhruval Kathiriya", "designation": "Convener",
     "order": 1, "category": "office_bearer", "photo_url": DHRUVAL_PHOTO,
     "email": "junagadhcpestudychapter@gmail.com", "phone": "+91 76985 32780"},
    {"id": "cm-002", "name": "CA. Ashish Makwana", "designation": "Dy. Convener",
     "order": 2, "category": "office_bearer", "photo_url": ASHISH_PHOTO,
     "email": "", "phone": "+91 96241 06740"},
]

JUNE_NEWSLETTER = {
    "id": "nl-june-2026", "type": "member",
    "title": "The Chartered Accountant - Inaugural Edition June 2026",
    "month": "June", "year": 2026,
    "pdf_url": JUNE_2026_PDF,
    "cover_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80",
}

SEED_GALLERY_PHOTOS = [
    {"id": "gal-749-d1", "title": "Batch 749 – AI Course (Day 1)", "album": "Batch 749 – AI Course",
     "event_date": "2026-05-01",
     "photo_url": "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/l6faewmi_Day%201%20Batch%20749%20AI%20L%201.jpeg"},
    {"id": "gal-749-d2", "title": "Batch 749 – AI Course (Day 2)", "album": "Batch 749 – AI Course",
     "event_date": "2026-05-02",
     "photo_url": "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/2zq0yqks_Day%202%20Batch%20749%20AI%20L%201.jpeg"},
    {"id": "gal-749-d3", "title": "Batch 749 – AI Course (Day 3)", "album": "Batch 749 – AI Course",
     "event_date": "2026-05-03",
     "photo_url": "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/ygl8gu8r_Day%203%20Batch%20749%20AI%20L%201.jpeg"},
]


async def setup_database():
    """One-time cleanup of demo data, then ensure real chapter data + admin exist."""
    if not await db.migrations.find_one({"_id": "remove_demo_v1"}):
        await db.events.delete_many({})
        await db.notices.delete_many({})
        await db.gallery.delete_many({})
        await db.announcements.delete_many({})
        await db.committee.delete_many({})
        await db.newsletters.delete_many({})
        await db.migrations.insert_one(
            {"_id": "remove_demo_v1", "applied_at": datetime.now(timezone.utc).isoformat()}
        )
        logger.info("Removed demo/placeholder data")

    for member in REAL_COMMITTEE:
        await db.committee.update_one({"id": member["id"]}, {"$set": member}, upsert=True)
    await db.newsletters.update_one({"id": "nl-june-2026"}, {"$set": JUNE_NEWSLETTER}, upsert=True)

    if not await db.migrations.find_one({"_id": "seed_gallery_v1"}):
        if await db.gallery.count_documents({}) == 0:
            await db.gallery.insert_many([dict(g) for g in SEED_GALLERY_PHOTOS])
        await db.migrations.insert_one(
            {"_id": "seed_gallery_v1", "applied_at": datetime.now(timezone.utc).isoformat()}
        )
        logger.info("Seeded gallery photos")

    # Migrate any previously "active" directory entries to "approved"
    await db.directory.update_many({"status": "active"}, {"$set": {"status": "approved"}})

    # Seed admin user (idempotent)
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Chapter Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}}
        )
        logger.info("Updated admin password")

    # Seed member directory master data from sheet (search-only directory)
    if await db.member_master.count_documents({}) == 0:
        members_file = ROOT_DIR / "data" / "members.json"
        if members_file.exists():
            import json as _json
            with open(members_file, "r", encoding="utf-8") as f:
                members = _json.load(f)
            if members:
                await db.member_master.insert_many(members)
                logger.info(f"Seeded {len(members)} directory members")

    logger.info("Database setup complete")


# ─── Public Routes ──────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "Junagadh CPE Study Chapter API"}


@api_router.get("/events", response_model=List[dict])
async def get_events():
    return await db.events.find({}, {"_id": 0}).sort("date", 1).to_list(200)


@api_router.get("/events/{event_id}", response_model=dict)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@api_router.post("/events/{event_id}/register")
async def register_for_event(event_id: str, data: RegistrationCreate):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not event.get("is_open", True):
        raise HTTPException(status_code=400, detail="Registration is closed for this event")
    registration = EventRegistration(event_id=event_id, **data.model_dump())
    await db.registrations.insert_one(registration.model_dump())
    return {"message": "Registration successful!", "registration_id": registration.id}


@api_router.get("/notices", response_model=List[dict])
async def get_notices():
    return await db.notices.find({}, {"_id": 0}).sort("date", -1).to_list(200)


@api_router.get("/newsletters", response_model=List[dict])
async def get_newsletters():
    return await db.newsletters.find({}, {"_id": 0}).to_list(200)


@api_router.get("/committee", response_model=List[dict])
async def get_committee():
    return await db.committee.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/gallery", response_model=List[dict])
async def get_gallery():
    return await db.gallery.find({}, {"_id": 0}).to_list(200)


@api_router.get("/announcements", response_model=List[dict])
async def get_announcements():
    return await db.announcements.find({}, {"_id": 0}).sort("date", -1).to_list(100)


@api_router.post("/contact")
async def submit_contact(data: ContactCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["submitted_at"] = datetime.now(timezone.utc).isoformat()
    await db.contact_messages.insert_one(doc)
    return {"message": "Your message has been received. We will contact you shortly."}


@api_router.post("/library/register")
async def register_library(data: LibraryRegistrationCreate):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["registered_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "pending"
    await db.library_registrations.insert_one(doc)
    return {"message": "Library registration submitted successfully! We will contact you with further details.", "registration_id": doc["id"]}


# ─── Uploaded files (public serve) ────────────────────────────────────────────

@api_router.get("/files/{file_id}")
async def get_file(file_id: str):
    rec = await db.files.find_one({"id": file_id, "is_deleted": False})
    if not rec:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(rec["storage_path"])
    return Response(content=data, media_type=rec.get("content_type", content_type))


# ─── Members Directory ────────────────────────────────────────────────────────

@api_router.get("/directory", response_model=List[dict])
async def get_directory():
    docs = await db.directory.find({"status": "approved"}).sort("name", 1).to_list(1000)
    return [_directory_public(d) for d in docs]


def _directory_public(d: dict) -> dict:
    return {
        "id": d["id"],
        "name": d["name"],
        "membership_no": d.get("membership_no", ""),
        "firm": d.get("firm", ""),
        "phone": d.get("phone", ""),
        "email": d.get("email", ""),
        "address": d.get("address", ""),
        "has_photo": bool(d.get("photo_path")),
        "status": d.get("status", "pending"),
        "created_at": d.get("created_at", ""),
    }


@api_router.post("/directory/register")
async def register_directory(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    membership_no: str = Form(""),
    firm: str = Form(""),
    address: str = Form(""),
    photo: Optional[UploadFile] = File(None),
):
    entry_id = str(uuid.uuid4())
    photo_path = ""
    if photo is not None:
        data = await photo.read()
        if data:
            ext = "jpg"
            if photo.filename and "." in photo.filename:
                ext = photo.filename.rsplit(".", 1)[-1].lower()
            path = f"{APP_NAME}/directory/{entry_id}.{ext}"
            try:
                result = put_object(path, data, photo.content_type or "image/jpeg")
                photo_path = result["path"]
            except Exception as e:
                logger.error(f"Directory photo upload failed: {e}")
    entry = {
        "id": entry_id,
        "name": name,
        "email": email,
        "phone": phone,
        "membership_no": membership_no,
        "firm": firm,
        "address": address,
        "photo_path": photo_path,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.directory.insert_one(entry)
    return {"message": "Thank you! Your details have been submitted and will appear in the directory once approved by the chapter.", "id": entry_id}


@api_router.get("/directory/photo/{member_id}")
async def get_directory_photo(member_id: str):
    d = await db.directory.find_one({"id": member_id})
    if not d or not d.get("photo_path"):
        raise HTTPException(status_code=404, detail="Photo not found")
    data, content_type = get_object(d["photo_path"])
    return Response(content=data, media_type=content_type)


# ─── Members Directory (search-only, from official sheet) ─────────────────────

@api_router.get("/members/search", response_model=List[dict])
async def search_members(q: str = ""):
    q = (q or "").strip()
    if len(q) < 2:
        return []
    import re as _re
    rx = _re.compile(_re.escape(q), _re.IGNORECASE)
    query = {
        "consent": True,
        "$or": [
            {"name": rx},
            {"surname": rx},
            {"first_name": rx},
            {"membership_number": rx},
            {"firm_name": rx},
            {"city": rx},
        ],
    }
    docs = await db.member_master.find(query, {"_id": 0}).sort("name", 1).to_list(200)
    return docs


# ─── Auth Routes ──────────────────────────────────────────────────────────────

@api_router.post("/auth/login")
async def login(data: LoginIn, request: Request):
    email = data.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = attempt.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again in a few minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        new_count = (attempt.get("count", 0) + 1) if attempt else 1
        update = {"count": new_count}
        if new_count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_token(user["email"])
    return {"token": token, "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}}


@api_router.get("/auth/me")
async def auth_me(admin: dict = Depends(get_current_admin)):
    return admin


# ─── Admin Routes (protected) ─────────────────────────────────────────────────

@api_router.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    file_id = str(uuid.uuid4())
    ext = "bin"
    if file.filename and "." in file.filename:
        ext = file.filename.rsplit(".", 1)[-1].lower()
    path = f"{APP_NAME}/uploads/{file_id}.{ext}"
    data = await file.read()
    result = put_object(path, data, file.content_type or "application/octet-stream")
    await db.files.insert_one({
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"url": f"/api/files/{file_id}", "id": file_id}


# Generic CRUD helpers
async def _create(collection, payload: dict):
    doc = {"id": str(uuid.uuid4()), **payload}
    await collection.insert_one(doc)
    doc.pop("_id", None)
    return doc


async def _update(collection, item_id: str, payload: dict):
    res = await collection.update_one({"id": item_id}, {"$set": payload})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Updated", "id": item_id}


async def _delete(collection, item_id: str):
    res = await collection.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Deleted", "id": item_id}


# Events
@api_router.post("/admin/events")
async def admin_create_event(data: EventIn, admin: dict = Depends(get_current_admin)):
    return await _create(db.events, data.model_dump())


@api_router.put("/admin/events/{item_id}")
async def admin_update_event(item_id: str, data: EventIn, admin: dict = Depends(get_current_admin)):
    return await _update(db.events, item_id, data.model_dump())


@api_router.delete("/admin/events/{item_id}")
async def admin_delete_event(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.events, item_id)


# Newsletters
@api_router.post("/admin/newsletters")
async def admin_create_newsletter(data: NewsletterIn, admin: dict = Depends(get_current_admin)):
    return await _create(db.newsletters, data.model_dump())


@api_router.put("/admin/newsletters/{item_id}")
async def admin_update_newsletter(item_id: str, data: NewsletterIn, admin: dict = Depends(get_current_admin)):
    return await _update(db.newsletters, item_id, data.model_dump())


@api_router.delete("/admin/newsletters/{item_id}")
async def admin_delete_newsletter(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.newsletters, item_id)


# Notices
@api_router.post("/admin/notices")
async def admin_create_notice(data: NoticeIn, admin: dict = Depends(get_current_admin)):
    return await _create(db.notices, data.model_dump())


@api_router.put("/admin/notices/{item_id}")
async def admin_update_notice(item_id: str, data: NoticeIn, admin: dict = Depends(get_current_admin)):
    return await _update(db.notices, item_id, data.model_dump())


@api_router.delete("/admin/notices/{item_id}")
async def admin_delete_notice(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.notices, item_id)


# Committee
@api_router.post("/admin/committee")
async def admin_create_committee(data: CommitteeIn, admin: dict = Depends(get_current_admin)):
    return await _create(db.committee, data.model_dump())


@api_router.put("/admin/committee/{item_id}")
async def admin_update_committee(item_id: str, data: CommitteeIn, admin: dict = Depends(get_current_admin)):
    return await _update(db.committee, item_id, data.model_dump())


@api_router.delete("/admin/committee/{item_id}")
async def admin_delete_committee(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.committee, item_id)


# Gallery
@api_router.post("/admin/gallery")
async def admin_create_gallery(data: GalleryIn, admin: dict = Depends(get_current_admin)):
    return await _create(db.gallery, data.model_dump())


@api_router.delete("/admin/gallery/{item_id}")
async def admin_delete_gallery(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.gallery, item_id)


# Directory moderation
@api_router.get("/admin/directory", response_model=List[dict])
async def admin_list_directory(admin: dict = Depends(get_current_admin)):
    docs = await db.directory.find({}).sort("created_at", -1).to_list(2000)
    return [_directory_public(d) for d in docs]


@api_router.put("/admin/directory/{item_id}/approve")
async def admin_approve_directory(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _update(db.directory, item_id, {"status": "approved"})


@api_router.put("/admin/directory/{item_id}/reject")
async def admin_reject_directory(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _update(db.directory, item_id, {"status": "rejected"})


@api_router.delete("/admin/directory/{item_id}")
async def admin_delete_directory(item_id: str, admin: dict = Depends(get_current_admin)):
    return await _delete(db.directory, item_id)


# Submissions
@api_router.get("/admin/library", response_model=List[dict])
async def admin_list_library(admin: dict = Depends(get_current_admin)):
    return await db.library_registrations.find({}, {"_id": 0}).sort("registered_at", -1).to_list(2000)


@api_router.get("/admin/contact", response_model=List[dict])
async def admin_list_contact(admin: dict = Depends(get_current_admin)):
    return await db.contact_messages.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(2000)


@api_router.get("/admin/event-registrations", response_model=List[dict])
async def admin_list_event_regs(admin: dict = Depends(get_current_admin)):
    return await db.registrations.find({}, {"_id": 0}).sort("registered_at", -1).to_list(2000)


@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(get_current_admin)):
    return {
        "events": await db.events.count_documents({}),
        "newsletters": await db.newsletters.count_documents({}),
        "notices": await db.notices.count_documents({}),
        "committee": await db.committee.count_documents({}),
        "gallery": await db.gallery.count_documents({}),
        "directory_total": await db.directory.count_documents({}),
        "directory_pending": await db.directory.count_documents({"status": "pending"}),
        "library": await db.library_registrations.count_documents({}),
        "contact": await db.contact_messages.count_documents({}),
        "event_registrations": await db.registrations.count_documents({}),
    }


# ─── App Setup ────────────────────────────────────────────────────────────────

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await setup_database()
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
