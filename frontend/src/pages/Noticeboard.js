import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Download, FileText, Bell } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Noticeboard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("member");

  useEffect(() => {
    axios.get(`${API}/notices`)
      .then((r) => { setNotices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = notices.filter((n) => n.type === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="noticeboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Noticeboard</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Noticeboard</h1>
          <p className="text-white/70 mt-3 text-lg">Circulars, notices, and important documents for members and students.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#F8FAFC] border-b border-slate-200" data-testid="noticeboard-tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {[
            { key: "member", label: "Member Noticeboard", icon: Bell },
            { key: "student", label: "Student Noticeboard", icon: FileText },
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

      {/* Notices Table */}
      <section className="py-12" data-testid="notices-list">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="bg-slate-100 rounded-xl h-16 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No notices available at this time.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 bg-[#0A1E3F] text-white text-sm font-semibold px-6 py-3">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-6">Notice Title</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1 text-center">PDF</div>
              </div>
              {filtered.map((notice, i) => (
                <div
                  key={notice.id}
                  data-testid={`notice-row-${notice.id}`}
                  className={`sm:grid sm:grid-cols-12 flex flex-col gap-2 items-start sm:items-center px-6 py-4 text-sm hover:bg-slate-50 transition-colors ${i < filtered.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="sm:col-span-1 text-slate-400 font-medium hidden sm:block">{i + 1}</div>
                  <div className="sm:col-span-2 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="sm:col-span-6">
                    <p className="font-medium text-[#0A1E3F] leading-snug">{notice.title}</p>
                    {notice.description && (
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{notice.description}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                      {notice.category}
                    </span>
                  </div>
                  <div className="sm:col-span-1 sm:text-center">
                    <a
                      href={notice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`download-notice-${notice.id}`}
                      className="inline-flex items-center gap-1.5 text-[#0284C7] hover:text-[#0369A1] transition-colors font-semibold text-xs px-3 py-1.5 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      <Download size={13} />
                      <span className="sm:hidden">Download PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Bell size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              <strong>Note:</strong> PDF downloads are placeholder links. Actual documents will be available once the chapter provides the official files. For any queries, please <Link to="/contact" className="underline">contact the chapter office</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
