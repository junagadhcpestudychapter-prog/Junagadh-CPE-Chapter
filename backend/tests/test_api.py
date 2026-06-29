"""Backend API tests for Junagadh CPE Study Chapter (post-cleanup, real data only)."""
import io
import os
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')


# ─── Health / Root ─────────────────────────────────────────────────────────
class TestHealth:
    def test_api_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert "message" in r.json()


# ─── Committee (must be exactly 2 real members) ────────────────────────────
class TestCommittee:
    def test_committee_only_two_real_members(self):
        r = requests.get(f"{BASE_URL}/api/committee")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 2, f"Expected 2 committee members, got {len(data)}"
        names = {m["name"] for m in data}
        assert "CA. Dhruval Kathiriya" in names
        assert "CA. Ashish Makwana" in names
        # No placeholder
        for m in data:
            assert "[" not in m["name"]
            assert "phone" in m and m["phone"]
        # Designations
        designations = {m["designation"] for m in data}
        assert "Convener" in designations
        assert "Dy. Convener" in designations


# ─── Newsletter (only June 2026) ───────────────────────────────────────────
class TestNewsletters:
    def test_newsletter_only_june_2026(self):
        r = requests.get(f"{BASE_URL}/api/newsletters")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 1
        nl = data[0]
        assert nl["month"] == "June"
        assert nl["year"] == 2026
        assert nl["pdf_url"].startswith("http")


# ─── Demo collections must be empty ────────────────────────────────────────
class TestDemoRemoved:
    def test_events_empty(self):
        r = requests.get(f"{BASE_URL}/api/events")
        assert r.status_code == 200
        assert r.json() == []

    def test_notices_empty(self):
        r = requests.get(f"{BASE_URL}/api/notices")
        assert r.status_code == 200
        assert r.json() == []

    def test_gallery_seeded(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        titles = [g["title"] for g in r.json()]
        assert any("Batch 749" in t for t in titles)

    def test_announcements_empty(self):
        r = requests.get(f"{BASE_URL}/api/announcements")
        assert r.status_code == 200
        assert r.json() == []


# ─── Contact ───────────────────────────────────────────────────────────────
class TestContact:
    def test_contact_submit(self):
        payload = {
            "name": "TEST_Contact",
            "email": "test@contact.com",
            "phone": "9876543210",
            "subject": "Test Subject",
            "message": "Automated test message",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200
        assert "message" in r.json()

    def test_contact_missing_required(self):
        r = requests.post(f"{BASE_URL}/api/contact", json={"name": "T", "email": "t@t.com"})
        assert r.status_code == 422


# ─── Directory ─────────────────────────────────────────────────────────────
class TestDirectory:
    created_with_photo = None
    created_without_photo = None

    def test_directory_list_initial(self):
        r = requests.get(f"{BASE_URL}/api/directory")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_register_with_photo(self):
        # 1x1 PNG bytes
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
            "890000000D49444154789C6360000002000001E221BC330000000049454E44AE426082"
        )
        files = {"photo": ("test.png", io.BytesIO(png), "image/png")}
        data = {
            "name": "TEST_Member_With_Photo",
            "email": "withphoto@test.com",
            "phone": "+91 99999 00001",
            "membership_no": "TEST001",
            "firm": "TEST Firm A",
            "address": "Junagadh, Gujarat",
        }
        r = requests.post(f"{BASE_URL}/api/directory/register", data=data, files=files)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body
        TestDirectory.created_with_photo = body["id"]

    def test_register_without_photo(self):
        data = {
            "name": "TEST_Member_No_Photo",
            "email": "nophoto@test.com",
            "phone": "+91 99999 00002",
            "membership_no": "TEST002",
            "firm": "TEST Firm B",
            "address": "Junagadh",
        }
        r = requests.post(f"{BASE_URL}/api/directory/register", data=data)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body
        TestDirectory.created_without_photo = body["id"]

    def test_directory_new_members_are_pending(self):
        # New submissions are pending and must NOT appear on the public list
        r = requests.get(f"{BASE_URL}/api/directory")
        assert r.status_code == 200
        ids = {m["id"] for m in r.json()}
        assert TestDirectory.created_with_photo not in ids
        assert TestDirectory.created_without_photo not in ids

    def test_directory_photo_retrieval(self):
        assert TestDirectory.created_with_photo
        r = requests.get(f"{BASE_URL}/api/directory/photo/{TestDirectory.created_with_photo}")
        assert r.status_code == 200
        assert r.headers.get("Content-Type", "").startswith("image/")
        assert len(r.content) > 0

    def test_directory_photo_404_for_no_photo_member(self):
        assert TestDirectory.created_without_photo
        r = requests.get(f"{BASE_URL}/api/directory/photo/{TestDirectory.created_without_photo}")
        assert r.status_code == 404

    def test_register_missing_required(self):
        # missing phone/email
        r = requests.post(f"{BASE_URL}/api/directory/register", data={"name": "X"})
        assert r.status_code == 422
