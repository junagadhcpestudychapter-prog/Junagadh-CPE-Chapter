import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, BookOpen, Bell, Users, Images, UserCheck, Inbox,
  LogOut, Plus, Pencil, Trash2, Upload, X, Check, Clock, ExternalLink,
} from "lucide-react";
import { authApi, clearToken, getToken, resolveAsset } from "../lib/api";

/* ─── Field configs ─── */
const EVENT_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "text" },
  { name: "date", label: "Start Date", type: "date", required: true },
  { name: "end_date", label: "End Date", type: "date" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "fee", label: "Fee (₹)", type: "number" },
  { name: "cpe_hours", label: "CPE Hours", type: "number" },
  { name: "is_open", label: "Registration Open", type: "bool" },
  { name: "banner_url", label: "Banner Image", type: "image" },
  { name: "description", label: "Description", type: "textarea" },
];
const NEWSLETTER_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "type", label: "Type", type: "select", options: ["member", "student"] },
  { name: "month", label: "Month", type: "text" },
  { name: "year", label: "Year", type: "number" },
  { name: "pdf_url", label: "PDF File", type: "file" },
  { name: "cover_url", label: "Cover Image", type: "image" },
];
const NOTICE_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "text" },
  { name: "type", label: "Type", type: "select", options: ["member", "student"] },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "pdf_url", label: "PDF File", type: "file" },
  { name: "description", label: "Description", type: "textarea" },
];
const COMMITTEE_FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "designation", label: "Designation", type: "text", required: true },
  { name: "order", label: "Display Order", type: "number" },
  { name: "category", label: "Category", type: "select", options: ["office_bearer", "member"] },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "photo_url", label: "Photo", type: "image" },
];
const GALLERY_FIELDS = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "album", label: "Album", type: "text" },
  { name: "event_date", label: "Event Date", type: "date" },
  { name: "photo_url", label: "Photo", type: "image", required: true },
];

const defaultsFor = (fields) => {
  const o = {};
  fields.forEach((f) => {
    o[f.name] = f.type === "bool" ? true : f.type === "number" ? "" : f.type === "select" ? f.options[0] : "";
  });
  return o;
};

/* ─── Image / File upload field ─── */
function UploadField({ field, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await authApi.post("/admin/upload", fd);
      onChange(data.url);
    } catch {
      alert("Upload failed");
    }
    setBusy(false);
  };
  return (
    <div>
      <div className="flex items-center gap-3">
        {field.type === "image" && value && (
          <img src={resolveAsset(value)} alt="preview" className="w-12 h-12 rounded object-cover border border-slate-200" />
        )}
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload"
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
        />
        <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50 whitespace-nowrap">
          <Upload size={13} /> {busy ? "..." : "Upload"}
          <input type="file" accept={field.type === "image" ? "image/*" : undefined} onChange={handle} className="hidden" />
        </label>
      </div>
      {field.type === "file" && value && (
        <a href={resolveAsset(value)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0284C7] inline-flex items-center gap-1 mt-1">
          <ExternalLink size={11} /> View current file
        </a>
      )}
    </div>
  );
}

/* ─── Generic entity manager ─── */
function EntityManager({ title, listUrl, adminPath, fields, canEdit = true, columns }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    authApi.get(listUrl).then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [listUrl]);
  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    fields.forEach((f) => { if (f.type === "number") payload[f.name] = Number(payload[f.name]) || 0; });
    try {
      if (form.id) {
        const { id, ...rest } = payload;
        await authApi.put(`${adminPath}/${id}`, rest);
      } else {
        await authApi.post(adminPath, payload);
      }
      setForm(null);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "Save failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    await authApi.delete(`${adminPath}/${id}`);
    load();
  };

  const cols = columns || fields.slice(0, 3).map((f) => f.name);

  return (
    <div data-testid={`section-${title.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">{title}</h2>
        <button
          onClick={() => setForm(defaultsFor(fields))}
          data-testid={`add-${title.toLowerCase()}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A1E3F] text-white rounded-lg text-sm font-semibold hover:bg-[#173059] transition-colors"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <p className="text-slate-500 text-sm py-10 text-center border border-dashed border-slate-200 rounded-xl">No items yet. Click "Add New".</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                {cols.map((c) => <th key={c} className="px-4 py-2.5 font-semibold capitalize">{c.replace(/_/g, " ")}</th>)}
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} data-testid={`row-${it.id}`} className="border-t border-slate-100 hover:bg-slate-50">
                  {cols.map((c) => (
                    <td key={c} className="px-4 py-3 text-slate-700">
                      {typeof it[c] === "boolean" ? (it[c] ? "Yes" : "No") : String(it[c] ?? "").slice(0, 60)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button onClick={() => setForm({ ...defaultsFor(fields), ...it })} data-testid={`edit-${it.id}`} className="p-1.5 text-slate-500 hover:text-[#0284C7] hover:bg-blue-50 rounded">
                          <Pencil size={14} />
                        </button>
                      )}
                      <button onClick={() => del(it.id)} data-testid={`delete-${it.id}`} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="entity-form-modal">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-heading font-bold text-[#0A1E3F]">{form.id ? "Edit" : "Add"} {title.replace(/s$/, "")}</h3>
              <button onClick={() => setForm(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4" data-testid="entity-form">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                  {f.type === "textarea" ? (
                    <textarea value={form[f.name] || ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] resize-none" />
                  ) : f.type === "select" ? (
                    <select value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]">
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "bool" ? (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} /> Enabled
                    </label>
                  ) : f.type === "image" || f.type === "file" ? (
                    <UploadField field={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      required={f.required}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setForm(null)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="entity-form-save" className="flex-1 py-2.5 bg-[#0A1E3F] text-white rounded-lg text-sm font-semibold hover:bg-[#173059]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Directory moderation ─── */
function DirectoryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); authApi.get("/admin/directory").then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    if (action === "delete" && !window.confirm("Delete this entry?")) return;
    if (action === "delete") await authApi.delete(`/admin/directory/${id}`);
    else await authApi.put(`/admin/directory/${id}/${action}`);
    load();
  };

  const badge = (s) => ({
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }[s] || "bg-slate-100 text-slate-600");

  return (
    <div data-testid="section-directory">
      <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-5">Members Directory — Moderation</h2>
      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <p className="text-slate-500 text-sm py-10 text-center border border-dashed border-slate-200 rounded-xl">No directory submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} data-testid={`dir-row-${m.id}`} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <img src={m.has_photo ? `${resolveAsset("/api/directory/photo/" + m.id)}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0A1E3F&color=fff`} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[#0A1E3F] truncate">{m.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge(m.status)}`}>{m.status}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{[m.membership_no && `M.No ${m.membership_no}`, m.firm, m.phone, m.email].filter(Boolean).join(" • ")}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.status !== "approved" && (
                  <button onClick={() => act(m.id, "approve")} data-testid={`approve-${m.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700"><Check size={13} /> Approve</button>
                )}
                {m.status !== "rejected" && (
                  <button onClick={() => act(m.id, "reject")} data-testid={`reject-${m.id}`} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50">Reject</button>
                )}
                <button onClick={() => act(m.id, "delete")} data-testid={`dir-delete-${m.id}`} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Submissions viewer ─── */
function SubmissionsViewer() {
  const [tab, setTab] = useState("library");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const map = { library: "/admin/library", contact: "/admin/contact", registrations: "/admin/event-registrations" };
  useEffect(() => {
    setLoading(true);
    authApi.get(map[tab]).then((r) => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [tab]);

  const cols = data[0] ? Object.keys(data[0]).filter((k) => k !== "id" && k !== "status").slice(0, 6) : [];

  return (
    <div data-testid="section-submissions">
      <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-5">Form Submissions</h2>
      <div className="flex gap-2 mb-4">
        {[{ k: "library", l: "Library" }, { k: "contact", l: "Contact" }, { k: "registrations", l: "Event Registrations" }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} data-testid={`sub-tab-${t.k}`} className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === t.k ? "bg-[#0A1E3F] text-white" : "bg-white border border-slate-200 text-slate-600"}`}>{t.l}</button>
        ))}
      </div>
      {loading ? (
        <div className="h-32 bg-slate-100 rounded animate-pulse" />
      ) : data.length === 0 ? (
        <p className="text-slate-500 text-sm py-10 text-center border border-dashed border-slate-200 rounded-xl">No submissions.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>{cols.map((c) => <th key={c} className="px-4 py-2.5 font-semibold capitalize">{c.replace(/_/g, " ")}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {cols.map((c) => <td key={c} className="px-4 py-3 text-slate-700">{String(row[c] ?? "").slice(0, 40)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard overview ─── */
function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { authApi.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {}); }, []);
  const cards = [
    { k: "directory_pending", l: "Directory Pending", icon: Clock, hot: true },
    { k: "events", l: "Events", icon: Calendar },
    { k: "newsletters", l: "Newsletters", icon: BookOpen },
    { k: "notices", l: "Notices", icon: Bell },
    { k: "committee", l: "Committee", icon: Users },
    { k: "gallery", l: "Gallery Photos", icon: Images },
    { k: "library", l: "Library Requests", icon: Inbox },
    { k: "contact", l: "Contact Messages", icon: Inbox },
  ];
  return (
    <div data-testid="section-dashboard">
      <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-5">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.k} data-testid={`stat-${c.k}`} className={`rounded-xl p-5 border ${c.hot && stats?.[c.k] > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
            <c.icon size={20} className={c.hot && stats?.[c.k] > 0 ? "text-amber-600" : "text-[#0284C7]"} />
            <p className="font-heading text-3xl font-bold text-[#0A1E3F] mt-3">{stats ? stats[c.k] : "–"}</p>
            <p className="text-slate-500 text-sm">{c.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Admin shell ─── */
export default function Admin() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) { navigate("/admin/login"); return; }
    authApi.get("/auth/me").then(() => setReady(true)).catch(() => { clearToken(); navigate("/admin/login"); });
  }, [navigate]);

  const logout = () => { clearToken(); navigate("/admin/login"); };

  const nav = [
    { k: "dashboard", l: "Dashboard", icon: LayoutDashboard },
    { k: "events", l: "Events", icon: Calendar },
    { k: "newsletters", l: "Newsletters", icon: BookOpen },
    { k: "notices", l: "Noticeboard", icon: Bell },
    { k: "committee", l: "Committee", icon: Users },
    { k: "gallery", l: "Gallery", icon: Images },
    { k: "directory", l: "Directory", icon: UserCheck },
    { k: "submissions", l: "Submissions", icon: Inbox },
  ];

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading admin...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0A1E3F] text-white flex flex-col fixed inset-y-0 left-0">
        <div className="p-5 border-b border-white/10">
          <p className="font-heading font-bold">Admin Panel</p>
          <p className="text-white/50 text-xs">Junagadh CPE Chapter</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((n) => (
            <button
              key={n.k}
              onClick={() => setActive(n.k)}
              data-testid={`nav-${n.k}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active === n.k ? "bg-[#0284C7] text-white" : "text-white/70 hover:bg-white/10"}`}
            >
              <n.icon size={16} /> {n.l}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10">
            <ExternalLink size={16} /> View Site
          </a>
          <button onClick={logout} data-testid="admin-logout" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-60 p-8 max-w-6xl">
        {active === "dashboard" && <Overview />}
        {active === "events" && <EntityManager title="Events" listUrl="/events" adminPath="/admin/events" fields={EVENT_FIELDS} columns={["title", "category", "date"]} />}
        {active === "newsletters" && <EntityManager title="Newsletters" listUrl="/newsletters" adminPath="/admin/newsletters" fields={NEWSLETTER_FIELDS} columns={["title", "type", "month"]} />}
        {active === "notices" && <EntityManager title="Notices" listUrl="/notices" adminPath="/admin/notices" fields={NOTICE_FIELDS} columns={["title", "category", "date"]} />}
        {active === "committee" && <EntityManager title="Committee" listUrl="/committee" adminPath="/admin/committee" fields={COMMITTEE_FIELDS} columns={["name", "designation", "order"]} />}
        {active === "gallery" && <EntityManager title="Gallery" listUrl="/gallery" adminPath="/admin/gallery" fields={GALLERY_FIELDS} canEdit={false} columns={["title", "album", "event_date"]} />}
        {active === "directory" && <DirectoryManager />}
        {active === "submissions" && <SubmissionsViewer />}
      </main>
    </div>
  );
}
