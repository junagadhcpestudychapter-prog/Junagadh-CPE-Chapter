import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Mail, Phone, Building2, MapPin, BadgeCheck, Users, Loader2, UserPlus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Directory() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.get(`${API}/members/search`, { params: { q } });
      setResults(data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const avatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name.replace(/^CA\.\s*/, ""))}&background=0A1E3F&color=fff&size=200&bold=true`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header + Search */}
      <div className="bg-[#0A1E3F] pt-28 pb-16" data-testid="directory-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Members Directory</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Members Directory</h1>
          <p className="text-white/70 mt-3 text-lg max-w-2xl">
            Search the directory of Chartered Accountants associated with the Junagadh CPE Study Chapter by name, membership number, firm or city.
          </p>

          <form onSubmit={runSearch} className="mt-8 max-w-2xl" data-testid="directory-search-form">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  data-testid="directory-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, membership no., firm or city…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
              <button
                type="submit"
                data-testid="directory-search-btn"
                disabled={query.trim().length < 2 || loading}
                className="px-6 py-3.5 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">Enter at least 2 characters. Results are shown only after you search.</p>
          </form>
        </div>
      </div>

      {/* Results */}
      <section className="py-14 min-h-[40vh]" data-testid="directory-results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!searched ? (
            <div className="text-center py-16 text-slate-400" data-testid="directory-prompt">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium text-slate-500">Search to find a member</p>
              <p className="text-sm mt-1">Type a name, membership number, firm name, or city above.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-16 text-slate-400">
              <Loader2 size={32} className="mx-auto animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 text-slate-400" data-testid="directory-noresults">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium text-slate-500">No members found for “{query}”.</p>
              <p className="text-sm mt-1">Try a different name, membership number, firm or city.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6" data-testid="directory-count">
                Found <span className="font-semibold text-[#0A1E3F]">{results.length}</span> member{results.length !== 1 ? "s" : ""} for “{query}”
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((m) => (
                  <div key={m.id} data-testid={`member-result-${m.id}`} className="hover-card bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={avatar(m.name)} alt={m.name} className="w-14 h-14 rounded-full object-cover border border-slate-200 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-[#0A1E3F] text-base leading-snug">{m.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          {m.membership_number && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#0284C7] font-medium">
                              <BadgeCheck size={12} /> M. No. {m.membership_number}
                            </span>
                          )}
                          {m.designation && <span className="text-xs text-slate-400">• {m.designation}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-slate-600">
                      {m.firm_name && <p className="flex items-center gap-2"><Building2 size={13} className="text-slate-400 flex-shrink-0" /> <span className="truncate">{m.firm_name}</span></p>}
                      {m.mobile && <a href={`tel:${m.mobile}`} className="flex items-center gap-2 hover:text-[#0284C7] transition-colors"><Phone size={13} className="text-slate-400 flex-shrink-0" /> {m.mobile}</a>}
                      {m.email && <a href={`mailto:${m.email}`} className="flex items-center gap-2 hover:text-[#0284C7] transition-colors"><Mail size={13} className="text-slate-400 flex-shrink-0" /> <span className="truncate">{m.email}</span></a>}
                      {(m.office_address || m.city) && (
                        <p className="flex items-start gap-2"><MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" /> <span>{m.office_address || m.city}{m.office_address && m.city ? "" : ""}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Not listed CTA */}
      <section className="py-12 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-heading font-bold text-[#0A1E3F] text-lg mb-1">Are you a member and not listed?</h3>
          <p className="text-slate-500 text-sm mb-5">Become a member of the chapter to get listed in the directory.</p>
          <Link
            to="/membership"
            data-testid="directory-membership-link"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1E3F] text-white font-semibold rounded-lg hover:bg-[#173059] transition-colors text-sm"
          >
            <UserPlus size={16} /> Become a Member
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
