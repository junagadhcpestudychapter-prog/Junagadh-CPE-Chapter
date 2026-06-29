"""Backend API tests for Junagadh CPE — Admin Panel + Directory approval flow.

Run with:
  pytest /app/backend/tests/test_admin_api.py -v \
    --junitxml=/app/test_reports/pytest/pytest_results.xml
"""
import io
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
ADMIN_EMAIL = "admin@junagadhcpe.org"
ADMIN_PASSWORD = "JunagadhCPE@2026"


# ─── Fixtures ─────────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    body = r.json()
    assert "token" in body and body["token"]
    assert body["user"]["email"] == ADMIN_EMAIL
    assert body["user"]["role"] == "admin"
    return body["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ─── Auth ─────────────────────────────────────────────────────────────────────
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data["token"], str) and len(data["token"]) > 20
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": "wrong-pass-xyz"})
        # Either 401 (invalid) or 429 (already locked from earlier tries)
        assert r.status_code in (401, 429)

    def test_me_without_token(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"

    def test_admin_endpoint_without_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/stats")
        assert r.status_code == 401

    def test_admin_endpoint_with_bad_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/stats",
                         headers={"Authorization": "Bearer not.a.valid.jwt"})
        assert r.status_code == 401


# ─── Stats ────────────────────────────────────────────────────────────────────
class TestStats:
    def test_stats_returns_all_counters(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ["events", "newsletters", "notices", "committee", "gallery",
                  "directory_total", "directory_pending", "library", "contact",
                  "event_registrations"]:
            assert k in data, f"missing key {k}"
            assert isinstance(data[k], int)


# ─── Gallery (seed verification) ──────────────────────────────────────────────
class TestGallerySeed:
    def test_three_batch749_photos_present(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        ids = {g["id"] for g in r.json()}
        for must in ("gal-749-d1", "gal-749-d2", "gal-749-d3"):
            assert must in ids, f"Missing seeded gallery photo {must}"


# ─── Events CRUD (admin) + Public reflection ─────────────────────────────────
class TestEventsCRUD:
    created_id = None

    def test_create_event(self, auth_headers):
        payload = {
            "title": "TEST_AutoEvent",
            "description": "Created by backend test",
            "date": "2026-07-15",
            "venue": "ICAI Bhawan, Junagadh",
            "fee": 0.0,
            "category": "Seminar",
            "is_open": True,
            "cpe_hours": 2.0,
        }
        r = requests.post(f"{BASE_URL}/api/admin/events",
                          json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body
        assert body["title"] == "TEST_AutoEvent"
        TestEventsCRUD.created_id = body["id"]

    def test_event_visible_on_public(self):
        r = requests.get(f"{BASE_URL}/api/events")
        assert r.status_code == 200
        ids = {e["id"] for e in r.json()}
        assert TestEventsCRUD.created_id in ids

    def test_update_event(self, auth_headers):
        payload = {
            "title": "TEST_AutoEvent_UPDATED",
            "description": "Updated",
            "date": "2026-07-16",
            "venue": "ICAI Bhawan, Junagadh",
            "fee": 100.0,
            "category": "Workshop",
            "is_open": False,
            "cpe_hours": 3.0,
        }
        r = requests.put(f"{BASE_URL}/api/admin/events/{TestEventsCRUD.created_id}",
                         json=payload, headers=auth_headers)
        assert r.status_code == 200
        # Verify persisted
        r2 = requests.get(f"{BASE_URL}/api/events/{TestEventsCRUD.created_id}")
        assert r2.status_code == 200
        ev = r2.json()
        assert ev["title"] == "TEST_AutoEvent_UPDATED"
        assert ev["fee"] == 100.0
        assert ev["is_open"] is False

    def test_delete_event(self, auth_headers):
        r = requests.delete(f"{BASE_URL}/api/admin/events/{TestEventsCRUD.created_id}",
                            headers=auth_headers)
        assert r.status_code == 200
        # Verify gone
        r2 = requests.get(f"{BASE_URL}/api/events/{TestEventsCRUD.created_id}")
        assert r2.status_code == 404


# ─── Newsletters CRUD ─────────────────────────────────────────────────────────
class TestNewslettersCRUD:
    created_id = None

    def test_create(self, auth_headers):
        r = requests.post(f"{BASE_URL}/api/admin/newsletters",
                          json={"title": "TEST_NL_July", "type": "member",
                                "month": "July", "year": 2026,
                                "pdf_url": "https://example.com/x.pdf"},
                          headers=auth_headers)
        assert r.status_code == 200
        TestNewslettersCRUD.created_id = r.json()["id"]

    def test_visible_on_public(self):
        r = requests.get(f"{BASE_URL}/api/newsletters")
        assert r.status_code == 200
        titles = {n["title"] for n in r.json()}
        assert "TEST_NL_July" in titles

    def test_update(self, auth_headers):
        r = requests.put(f"{BASE_URL}/api/admin/newsletters/{TestNewslettersCRUD.created_id}",
                         json={"title": "TEST_NL_July_v2", "type": "student",
                               "month": "July", "year": 2026,
                               "pdf_url": "https://example.com/x.pdf"},
                         headers=auth_headers)
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/newsletters")
        names = {n["title"]: n for n in r2.json()}
        assert "TEST_NL_July_v2" in names
        assert names["TEST_NL_July_v2"]["type"] == "student"

    def test_delete(self, auth_headers):
        r = requests.delete(f"{BASE_URL}/api/admin/newsletters/{TestNewslettersCRUD.created_id}",
                            headers=auth_headers)
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/newsletters")
        ids = {n["id"] for n in r2.json()}
        assert TestNewslettersCRUD.created_id not in ids


# ─── Notices CRUD ─────────────────────────────────────────────────────────────
class TestNoticesCRUD:
    created_id = None

    def test_create(self, auth_headers):
        r = requests.post(f"{BASE_URL}/api/admin/notices",
                          json={"title": "TEST_Notice", "description": "...",
                                "type": "member", "date": "2026-07-01",
                                "pdf_url": "#", "category": "Announcement"},
                          headers=auth_headers)
        assert r.status_code == 200
        TestNoticesCRUD.created_id = r.json()["id"]

    def test_visible_on_public(self):
        r = requests.get(f"{BASE_URL}/api/notices")
        ids = {n["id"] for n in r.json()}
        assert TestNoticesCRUD.created_id in ids

    def test_delete(self, auth_headers):
        r = requests.delete(f"{BASE_URL}/api/admin/notices/{TestNoticesCRUD.created_id}",
                            headers=auth_headers)
        assert r.status_code == 200


# ─── Committee CRUD (don't touch cm-001 / cm-002) ─────────────────────────────
class TestCommitteeCRUD:
    created_id = None

    def test_seeded_members_still_present(self):
        r = requests.get(f"{BASE_URL}/api/committee")
        assert r.status_code == 200
        ids = {m["id"] for m in r.json()}
        assert "cm-001" in ids and "cm-002" in ids

    def test_create_extra(self, auth_headers):
        r = requests.post(f"{BASE_URL}/api/admin/committee",
                          json={"name": "TEST_CommitteeMember",
                                "designation": "Member", "order": 99,
                                "category": "office_bearer",
                                "phone": "+91 99999 99999"},
                          headers=auth_headers)
        assert r.status_code == 200
        TestCommitteeCRUD.created_id = r.json()["id"]

    def test_update_extra(self, auth_headers):
        r = requests.put(f"{BASE_URL}/api/admin/committee/{TestCommitteeCRUD.created_id}",
                         json={"name": "TEST_CommitteeMember",
                               "designation": "Member", "order": 99,
                               "category": "office_bearer",
                               "phone": "+91 88888 88888"},
                         headers=auth_headers)
        assert r.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/committee")
        match = [m for m in r2.json() if m["id"] == TestCommitteeCRUD.created_id]
        assert match and match[0]["phone"] == "+91 88888 88888"

    def test_delete_extra(self, auth_headers):
        r = requests.delete(f"{BASE_URL}/api/admin/committee/{TestCommitteeCRUD.created_id}",
                            headers=auth_headers)
        assert r.status_code == 200
        # Real members still there
        r2 = requests.get(f"{BASE_URL}/api/committee")
        ids = {m["id"] for m in r2.json()}
        assert "cm-001" in ids and "cm-002" in ids


# ─── Gallery CRUD (add + delete; do NOT delete seeded) ────────────────────────
class TestGalleryCRUD:
    created_id = None

    def test_create(self, auth_headers):
        r = requests.post(f"{BASE_URL}/api/admin/gallery",
                          json={"title": "TEST_Gallery_Photo",
                                "photo_url": "https://example.com/test.jpg",
                                "album": "TEST_Album",
                                "event_date": "2026-07-10"},
                          headers=auth_headers)
        assert r.status_code == 200
        TestGalleryCRUD.created_id = r.json()["id"]

    def test_visible_on_public(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        ids = {g["id"] for g in r.json()}
        assert TestGalleryCRUD.created_id in ids
        # Seeded still present
        assert {"gal-749-d1", "gal-749-d2", "gal-749-d3"}.issubset(ids)

    def test_delete(self, auth_headers):
        r = requests.delete(f"{BASE_URL}/api/admin/gallery/{TestGalleryCRUD.created_id}",
                            headers=auth_headers)
        assert r.status_code == 200


# ─── Upload + /api/files/{id} round-trip ──────────────────────────────────────
class TestUpload:
    def test_admin_upload_and_serve(self, auth_headers):
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
            "890000000D49444154789C6360000002000001E221BC330000000049454E44AE426082"
        )
        files = {"file": ("upload.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/upload",
                          headers=auth_headers, files=files)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body and body["url"].startswith("/api/files/")

        # Now fetch
        r2 = requests.get(f"{BASE_URL}{body['url']}")
        assert r2.status_code == 200
        assert r2.headers.get("Content-Type", "").startswith("image/")
        assert len(r2.content) > 0


# ─── Members Directory: full approval flow ────────────────────────────────────
class TestDirectoryApproval:
    pending_id = None
    rejected_id = None
    to_delete_id = None

    def test_public_submit_creates_pending(self):
        unique = uuid.uuid4().hex[:6]
        data = {
            "name": f"TEST_PendingMember_{unique}",
            "email": f"pend_{unique}@test.com",
            "phone": "+91 90000 00001",
            "membership_no": f"TP{unique}",
            "firm": "TEST Firm",
            "address": "Junagadh",
        }
        r = requests.post(f"{BASE_URL}/api/directory/register", data=data)
        assert r.status_code == 200, r.text
        TestDirectoryApproval.pending_id = r.json()["id"]

    def test_pending_not_on_public(self):
        r = requests.get(f"{BASE_URL}/api/directory")
        ids = {m["id"] for m in r.json()}
        assert TestDirectoryApproval.pending_id not in ids, \
            "Pending entry should NOT appear on public /api/directory"

    def test_pending_visible_to_admin(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/directory", headers=auth_headers)
        assert r.status_code == 200
        entries = {m["id"]: m for m in r.json()}
        assert TestDirectoryApproval.pending_id in entries
        assert entries[TestDirectoryApproval.pending_id]["status"] == "pending"

    def test_approve(self, auth_headers):
        r = requests.put(
            f"{BASE_URL}/api/admin/directory/{TestDirectoryApproval.pending_id}/approve",
            headers=auth_headers)
        assert r.status_code == 200

    def test_appears_on_public_after_approve(self):
        r = requests.get(f"{BASE_URL}/api/directory")
        entries = {m["id"]: m for m in r.json()}
        assert TestDirectoryApproval.pending_id in entries
        assert entries[TestDirectoryApproval.pending_id]["status"] == "approved"

    def test_reject_flow(self, auth_headers):
        # Create another and reject
        unique = uuid.uuid4().hex[:6]
        r = requests.post(f"{BASE_URL}/api/directory/register", data={
            "name": f"TEST_RejectedMember_{unique}",
            "email": f"rej_{unique}@test.com",
            "phone": "+91 90000 00002",
        })
        assert r.status_code == 200
        TestDirectoryApproval.rejected_id = r.json()["id"]

        r2 = requests.put(
            f"{BASE_URL}/api/admin/directory/{TestDirectoryApproval.rejected_id}/reject",
            headers=auth_headers)
        assert r2.status_code == 200

        # Should not appear on public
        r3 = requests.get(f"{BASE_URL}/api/directory")
        ids = {m["id"] for m in r3.json()}
        assert TestDirectoryApproval.rejected_id not in ids

        # Should be visible in admin with status rejected
        r4 = requests.get(f"{BASE_URL}/api/admin/directory", headers=auth_headers)
        entries = {m["id"]: m for m in r4.json()}
        assert entries[TestDirectoryApproval.rejected_id]["status"] == "rejected"

    def test_delete_flow(self, auth_headers):
        unique = uuid.uuid4().hex[:6]
        r = requests.post(f"{BASE_URL}/api/directory/register", data={
            "name": f"TEST_ToDelete_{unique}",
            "email": f"del_{unique}@test.com",
            "phone": "+91 90000 00003",
        })
        assert r.status_code == 200
        TestDirectoryApproval.to_delete_id = r.json()["id"]

        r2 = requests.delete(
            f"{BASE_URL}/api/admin/directory/{TestDirectoryApproval.to_delete_id}",
            headers=auth_headers)
        assert r2.status_code == 200

        r3 = requests.get(f"{BASE_URL}/api/admin/directory", headers=auth_headers)
        ids = {m["id"] for m in r3.json()}
        assert TestDirectoryApproval.to_delete_id not in ids


# ─── Submissions viewer endpoints ─────────────────────────────────────────────
class TestSubmissionsViewer:
    def test_contact_endpoint(self, auth_headers):
        # Seed a contact
        requests.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_ContactSubmitter",
            "email": "test_sub@test.com",
            "phone": "9990001111",
            "subject": "Test",
            "message": "Hello",
        })
        r = requests.get(f"{BASE_URL}/api/admin/contact", headers=auth_headers)
        assert r.status_code == 200
        names = [c.get("name") for c in r.json()]
        assert "TEST_ContactSubmitter" in names

    def test_library_endpoint(self, auth_headers):
        # Seed a library reg
        requests.post(f"{BASE_URL}/api/library/register", json={
            "name": "TEST_LibSubmitter",
            "email": "lib_sub@test.com",
            "phone": "9990002222",
            "membership_no": "L0001",
            "category": "Books",
            "duration": "1 month",
            "comments": "test",
        })
        r = requests.get(f"{BASE_URL}/api/admin/library", headers=auth_headers)
        assert r.status_code == 200
        names = [c.get("name") for c in r.json()]
        assert "TEST_LibSubmitter" in names

    def test_event_registrations_endpoint(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/admin/event-registrations",
                         headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
