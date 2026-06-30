import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BadgeIndianRupee, Users, BookOpen, Bell, Award, Landmark, UserPlus, ExternalLink, Search, Mail, Phone, Briefcase, Hash } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLScKXBivGFsfhXTy7uXIhqQX0Y4zWkrnKsGuiLvu4JsNG2-u9w/viewform?usp=header";

const BENEFITS = [
  { icon: Award, title: "All CPE Programs", desc: "Access to seminars, workshops, conferences & study circles organized by the chapter." },
  { icon: BookOpen, title: "Monthly Newsletter", desc: "Receive the chapter's newsletter with professional updates & insights." },
  { icon: Users, title: "Professional Networking", desc: "Connect and collaborate with the local Chartered Accountant community." },
  { icon: Bell, title: "Priority Updates", desc: "Be the first to know about upcoming events, notices and circulars." },
];

export default function Membership() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  // Debounced server-side search (uses /api/members/search; min 2 chars)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const t = setTimeout(() => {
      axios.get(`${API}/members/search`, { params: { q } })
        .then((r) => setResults(r.data || []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const handleSelect = (m) => {
    setSelected(m);
    setQuery(m.name);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="membership-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Membership</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Membership Fees</h1>
          <p className="text-white/70 mt-3 text-lg max-w-2xl">
            Become a member of the Junagadh CPE Study Chapter and be part of our growing professional community of Chartered Accountants.
          </p>
        </div>
      </div>

      {/* ── Section 1: Why Join ───────────────────────────────────────────── */}
      <section className="py-16 bg-white" data-testid="membership-why-join">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Why Join</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Membership Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5" data-testid={`membership-benefit-${i}`}>
                <div className="w-11 h-11 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center flex-shrink-0">
                  <b.icon size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[#0A1E3F] text-base">{b.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Become a Member & Get Listed ───────────────────────── */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200" data-testid="membership-join">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Join the Chapter</p>
            <h2 className="font-heading font-bold text-[#0A1E3F] text-2xl sm:text-3xl">Become a Member &amp; Get Listed</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
              Pay the annual membership fee of <span className="font-semibold text-[#0A1E3F]">₹500</span> to the chapter&apos;s bank account, then fill the form with your details. Your <span className="font-semibold text-[#0A1E3F]">Bank Reference / UTR Number is mandatory</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Bank Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6" data-testid="membership-bank-details">
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={18} className="text-[#0284C7]" />
                <h4 className="font-heading font-bold text-[#0A1E3F]">Membership Fee — ₹500 / year</h4>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["Account Name", "JND CPE OF ICAI"],
                  ["Bank", "Bank of Baroda, Junagadh"],
                  ["Account No.", "90390100020585"],
                  ["IFSC Code", "BARB0DBMGRD"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-[#0A1E3F] text-right">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">Note down the Bank Reference / UTR Number after payment — you&apos;ll need to enter it in the form.</p>
            </div>

            {/* Steps + Form */}
            <div className="bg-[#0A1E3F] rounded-2xl p-6 text-white flex flex-col">
              <h4 className="font-heading font-bold text-lg mb-4">How to Join</h4>
              <ol className="space-y-3 text-sm text-white/80 flex-1">
                <li className="flex gap-3"><span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span> Transfer ₹500 to the bank account shown alongside.</li>
                <li className="flex gap-3"><span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span> Save your Bank Reference / UTR Number (mandatory).</li>
                <li className="flex gap-3"><span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span> Fill the form with your details &amp; the reference number.</li>
              </ol>
              <a
                href={GOOGLE_FORM}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="membership-google-form"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors text-sm"
              >
                <UserPlus size={16} /> Fill Membership Form
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Pay Annual Membership Fees (existing members) ──────── */}
      <section className="py-16 bg-white border-t border-slate-200" data-testid="membership-pay-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Annual Membership</p>
            <h2 className="font-heading font-bold text-[#0A1E3F] text-2xl sm:text-3xl">Pay Your Annual Membership Fees</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
              Already listed in our member directory? Select your name below to view your record, then proceed to pay your <span className="font-semibold text-[#0A1E3F]">₹500</span> annual fee.
            </p>
          </div>

          <div className="bg-[#0A1E3F] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#0284C7]/20 rounded-full pointer-events-none" />

            {/* Member Search Dropdown */}
            <div className="relative z-10" data-testid="membership-member-picker">
              <label className="block text-sm font-semibold text-white/80 mb-2">Select your name from the directory</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  data-testid="membership-member-search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setOpen(true); setSelected(null); }}
                  onFocus={() => setOpen(true)}
                  placeholder="Type at least 2 letters of your name, CA No. or firm…"
                  className="w-full pl-9 pr-3 py-3 rounded-lg bg-white text-[#0A1E3F] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>

              {open && results.length > 0 && (
                <div className="mt-2 max-h-64 overflow-y-auto bg-white rounded-lg shadow-2xl border border-slate-200" data-testid="membership-member-dropdown">
                  {results.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelect(m)}
                      data-testid={`membership-member-option-${m.id}`}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <p className="text-[#0A1E3F] font-semibold text-sm">{m.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {m.membership_number ? `Mem. No. ${m.membership_number}` : ""}
                        {m.membership_number && m.firm_name ? " • " : ""}
                        {m.firm_name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {open && query.trim().length >= 2 && !searching && results.length === 0 && (
                <div className="mt-2 bg-white rounded-lg px-4 py-3 text-sm text-slate-500 border border-slate-200" data-testid="membership-member-empty">
                  No member found matching &ldquo;{query}&rdquo;. New here? Use the &quot;Become a Member&quot; section above.
                </div>
              )}
              {searching && (
                <div className="mt-2 text-xs text-white/60" data-testid="membership-member-searching">Searching…</div>
              )}
            </div>

            {/* Selected member details */}
            {selected && (
              <div className="mt-6 bg-white/10 rounded-xl p-5 backdrop-blur-sm relative z-10" data-testid="membership-member-details">
                <p className="text-xs uppercase tracking-wider text-[#0284C7] font-semibold mb-3">Your Directory Record</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-white/50 text-xs mb-0.5">Name</p>
                    <p className="font-semibold">{selected.name}</p>
                  </div>
                  {selected.membership_number && (
                    <div>
                      <p className="text-white/50 text-xs mb-0.5 flex items-center gap-1"><Hash size={11} /> Membership No.</p>
                      <p className="font-semibold">{selected.membership_number}</p>
                    </div>
                  )}
                  {selected.firm_name && (
                    <div className="sm:col-span-2">
                      <p className="text-white/50 text-xs mb-0.5 flex items-center gap-1"><Briefcase size={11} /> Firm / Practice</p>
                      <p className="font-semibold">{selected.firm_name}{selected.designation ? ` — ${selected.designation}` : ""}</p>
                    </div>
                  )}
                  {selected.mobile && (
                    <div>
                      <p className="text-white/50 text-xs mb-0.5 flex items-center gap-1"><Phone size={11} /> Mobile</p>
                      <p className="font-semibold">{selected.mobile}</p>
                    </div>
                  )}
                  {selected.email && (
                    <div>
                      <p className="text-white/50 text-xs mb-0.5 flex items-center gap-1"><Mail size={11} /> Email</p>
                      <p className="font-semibold break-all">{selected.email}</p>
                    </div>
                  )}
                  {selected.city && (
                    <div className="sm:col-span-2">
                      <p className="text-white/50 text-xs mb-0.5">City</p>
                      <p className="font-semibold">{selected.city}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pay button */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BadgeIndianRupee size={20} className="text-[#0284C7]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#0284C7] font-semibold">Annual Fee</p>
                  <p className="font-heading font-bold text-2xl leading-none">₹500</p>
                </div>
              </div>
              <a
                href={GOOGLE_FORM}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="membership-pay-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors text-sm whitespace-nowrap"
              >
                Pay Your Annual Membership Fees <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-xs text-white/50 mt-4 relative z-10">
              Payment is processed via the chapter&apos;s bank account. After paying, fill the membership form with your <span className="font-semibold text-white/80">Bank Reference / UTR Number</span>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
