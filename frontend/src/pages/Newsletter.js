import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Download, BookOpen, ExternalLink, ArrowRight, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resolveAsset } from "../lib/api";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const JUNE_2026_PDF = "https://customer-assets.emergentagent.com/job_junagadh-cpe/artifacts/4stjru1o_Junagadh%20CPE%20Study%20Chapter%20June%202026%20Edittion.pdf";

// Key article highlights from the June 2026 inaugural edition
const JUNE_HIGHLIGHTS = [
  { title: "Convener's Message", author: "CA. Dhruval Kathiriya", tag: "Editorial" },
  { title: "Dy. Convener's Message", author: "CA. Ashish Makwana", tag: "Editorial" },
  { title: "GST Update — Key Amendments & Compliance", tag: "Indirect Tax" },
  { title: "Income Tax — Recent Developments", tag: "Direct Tax" },
  { title: "Chapter Activities & Events Roundup", tag: "Chapter News" },
  { title: "Professional Development: CPE Programs Ahead", tag: "CPE" },
];

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("member");

  useEffect(() => {
    axios.get(`${API}/newsletters`)
      .then((r) => { setNewsletters(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allFiltered = newsletters.filter((n) => n.type === activeTab);
  const archives = allFiltered.filter((n) => n.id !== "nl-june-2026");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="newsletter-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Newsletter</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Newsletter</h1>
          <p className="text-white/70 mt-3 text-lg">Publications by Junagadh CPE Study Chapter, WIRC of ICAI.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 sticky top-[63px] z-40" data-testid="newsletter-tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {[
            { key: "member", label: "Member Newsletter", icon: BookOpen },
            { key: "student", label: "Student Newsletter", icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-${tab.key}`}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#0284C7] text-[#0284C7]"
                  : "border-transparent text-slate-600 hover:text-[#0A1E3F]"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Featured Latest Issue (Member Tab) ──────────────────────── */}
      {activeTab === "member" && (
        <section className="py-16 bg-white" data-testid="featured-newsletter">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-[#0284C7] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Inaugural Edition</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Latest Issue — June 2026</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-10 items-start">
              {/* Left: Cover card */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#0A1E3F] to-[#173059] rounded-2xl overflow-hidden shadow-xl">
                  {/* Newsletter Cover Visual */}
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80"
                      alt="Newsletter Cover"
                      className="w-full h-64 object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-3">
                        <BookOpen size={26} className="text-white" />
                      </div>
                      <p className="text-[#0284C7] text-xs font-bold uppercase tracking-widest mb-1">
                        Junagadh CPE Study Chapter
                      </p>
                      <h2 className="font-heading font-bold text-2xl leading-tight mb-1">
                        The Chartered<br />Accountant
                      </h2>
                      <p className="text-white/70 text-sm">June 2026 · WIRC of ICAI</p>
                    </div>
                  </div>
                  {/* Metadata */}
                  <div className="p-5 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 mb-5 text-center">
                      {[
                        { label: "Issue", value: "Vol. 1 No. 1" },
                        { label: "Month", value: "June 2026" },
                        { label: "Edition", value: "Inaugural" },
                        { label: "Type", value: "Member" },
                      ].map((m, i) => (
                        <div key={i} className="bg-white/5 rounded-lg py-2 px-3">
                          <p className="text-white/50 text-xs">{m.label}</p>
                          <p className="text-white font-semibold text-sm">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    {/* CTA Buttons */}
                    <div className="space-y-2">
                      <a
                        href={JUNE_2026_PDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="open-newsletter-newtab"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0284C7] text-white font-bold rounded-lg hover:bg-[#0369A1] transition-colors text-sm"
                      >
                        <ExternalLink size={15} />
                        Read Newsletter Online
                      </a>
                      <a
                        href={JUNE_2026_PDF}
                        download="Junagadh-CPE-Newsletter-June-2026.pdf"
                        data-testid="download-newsletter-nl-june-2026"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors text-sm border border-white/20"
                      >
                        <Download size={15} />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Article highlights */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">In This Issue</p>
                  <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">What's Inside the Inaugural Edition</h2>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    The inaugural edition of <strong>"The Chartered Accountant"</strong> — our chapter's official newsletter — brings together messages from our leadership, professional updates, and a roundup of chapter activities.
                  </p>
                </div>

                {/* Article list */}
                <div className="space-y-3 mb-8" data-testid="newsletter-contents">
                  {JUNE_HIGHLIGHTS.map((article, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl hover-card">
                      <div className="w-8 h-8 bg-[#0A1E3F] rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {article.tag}
                          </span>
                        </div>
                        <p className="font-semibold text-[#0A1E3F] text-sm leading-snug">{article.title}</p>
                        {article.author && (
                          <p className="text-slate-500 text-xs mt-0.5">by {article.author}</p>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>

                {/* Read full newsletter CTA */}
                <div className="bg-gradient-to-r from-[#0A1E3F] to-[#0284C7] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 text-white">
                    <p className="font-heading font-bold text-lg">Read the Full Newsletter</p>
                    <p className="text-white/70 text-sm mt-1">Click to open in your browser or download for offline reading.</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={JUNE_2026_PDF}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="featured-read-now"
                      className="px-4 py-2.5 bg-white text-[#0A1E3F] font-bold text-sm rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Read Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Archive (placeholder issues) ────────────────────────────── */}
      {archives.length > 0 && (
        <section className="py-12 bg-[#F8FAFC] border-t border-slate-200" data-testid="newsletters-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Archive</p>
              <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">Previous Issues</h2>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3].map(i => <div key={i} className="bg-slate-200 rounded-xl aspect-[3/4] animate-pulse" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {archives.map((nl) => (
                  <div key={nl.id} data-testid={`newsletter-card-${nl.id}`} className="hover-card bg-white border border-slate-200 rounded-xl overflow-hidden group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      <img
                        src={resolveAsset(nl.cover_url) || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"}
                        alt={nl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-heading font-bold text-base">{nl.month} {nl.year}</p>
                        <p className="text-white/70 text-xs mt-0.5">{nl.type === "member" ? "Member" : "Student"} Newsletter</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#0A1E3F] text-sm leading-snug mb-3 line-clamp-2">{nl.title}</h3>
                      <a
                        href={nl.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`download-newsletter-${nl.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0A1E3F] text-white text-sm font-semibold rounded hover:bg-[#173059] transition-colors"
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Student Tab ─────────────────────────────────────────────── */}
      {activeTab === "student" && (
        <section className="py-12" data-testid="student-newsletters">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3].map(i => <div key={i} className="bg-slate-100 rounded-xl aspect-[3/4] animate-pulse" />)}
              </div>
            ) : allFiltered.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Student newsletter coming soon.</p>
                <p className="text-sm mt-2">Check back later or <Link to="/contact" className="text-[#0284C7] hover:underline">contact us</Link> for more info.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allFiltered.map((nl) => (
                  <div key={nl.id} data-testid={`newsletter-card-${nl.id}`} className="hover-card bg-white border border-slate-200 rounded-xl overflow-hidden group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      <img
                        src={resolveAsset(nl.cover_url) || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80"}
                        alt={nl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-heading font-bold text-base">{nl.month} {nl.year}</p>
                        <p className="text-white/70 text-xs mt-0.5">Student Newsletter</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#0A1E3F] text-sm leading-snug mb-3 line-clamp-2">{nl.title}</h3>
                      <a
                        href={nl.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`download-newsletter-${nl.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0A1E3F] text-white text-sm font-semibold rounded hover:bg-[#173059] transition-colors"
                      >
                        <Download size={14} />
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
