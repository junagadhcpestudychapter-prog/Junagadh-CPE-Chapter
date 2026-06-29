import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Star, X, ExternalLink, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RAJKOT_PORTAL = "https://www.rajkot-icai.org/payment.php?eid=1282&type=student&rs=600&gst=0";

const RESOURCES = [
  "ICAI Study Material & Practice Manuals",
  "Standard Textbooks on Accountancy, Tax & Law",
  "ICAI Journals & Publications",
  "Economic & Financial Newspapers (Daily)",
  "Business & Finance Magazines",
  "GST, Income Tax & Corporate Law Bare Acts",
  "CA Final & Intermediate Reference Books",
  "Past Exam Papers & Mock Test Papers",
];

const LIBRARY_PHOTOS = [
  {
    url: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/h77kpgis_DSC04956%20%281%29.jpg",
    caption: "Inauguration of Reading Room – Junagadh (4th March 2024)",
  },
  {
    url: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/1xpkyqx8_DSC04958%20%281%29.jpg",
    caption: "Spacious, fully air-conditioned reading hall",
  },
  {
    url: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/nxdrmc5y_DSC04959%20%281%29.jpg",
    caption: "Individual study cubicles with ample seating",
  },
  {
    url: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/wopbb73v_DSC04981%20%281%29.jpg",
    caption: "ICAI study material & reference book collection",
  },
];

export default function Library() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="library-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Reading Room Library</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Reading Room Library</h1>
          <p className="text-white/70 mt-3 text-lg max-w-2xl">
            A dedicated study space with professional resources for Chartered Accountants and students in Junagadh.
          </p>
        </div>
      </div>

      {/* Highlights */}
      <section className="py-14 bg-[#F8FAFC]" data-testid="library-highlights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Extensive Collection", desc: "Wide selection of CA study materials, reference books, journals, and publications.", color: "bg-blue-50 text-blue-700" },
              { icon: Clock, title: "Flexible Access Hours", desc: "Open Monday to Saturday — plan your study sessions at your convenience.", color: "bg-green-50 text-green-700" },
              { icon: Users, title: "For Members & Students", desc: "Open to CA members, article students, CA foundation & intermediate students.", color: "bg-purple-50 text-purple-700" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover-card" data-testid={`library-highlight-${i}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-heading font-bold text-[#0A1E3F] text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Room Photo Gallery */}
      <section className="py-16 bg-white" data-testid="library-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">A Glimpse Inside</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Inside Our Reading Room</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {LIBRARY_PHOTOS.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightbox(photo)}
                data-testid={`library-photo-${i}`}
                className="group text-left rounded-2xl overflow-hidden border border-slate-200 hover-card"
              >
                <div className="overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="px-4 py-3 text-slate-700 text-sm font-medium">{photo.caption}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources + Registration */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200" data-testid="library-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Available Resources */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">What's Available</p>
              <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-4">Available Resources</h2>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                {RESOURCES.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                    <Star size={14} className="text-[#0284C7] flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration + Hours */}
            <div className="space-y-8">
              {/* Register Card */}
              <div className="bg-[#0A1E3F] rounded-2xl p-8 text-white" data-testid="library-register-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <CreditCard size={18} className="text-[#0284C7]" />
                  </div>
                  <h3 className="font-heading font-bold text-xl">Register for the Reading Room</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  The Junagadh Reading Room Library is managed by the <span className="text-white font-medium">Rajkot Branch of WIRC of ICAI</span>. Registration and fee payment are handled securely on the official ICAI portal.
                </p>
                <a
                  href={RAJKOT_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="library-pay-online"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors text-sm"
                >
                  <CreditCard size={16} /> Register &amp; Pay Online
                  <ExternalLink size={14} />
                </a>
                <p className="text-white/40 text-xs text-center mt-3">You will be redirected to the official Rajkot ICAI portal.</p>
              </div>

              {/* Library Hours */}
              <div className="bg-white border border-slate-200 rounded-xl p-6" data-testid="library-hours">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-[#0284C7]" />
                  <h3 className="font-heading font-bold text-lg text-[#0A1E3F]">Library Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-2"><span>Monday – Friday</span><span className="font-medium text-[#0A1E3F]">9:00 AM – 7:00 PM</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-2"><span>Saturday</span><span className="font-medium text-[#0A1E3F]">9:00 AM – 5:00 PM</span></div>
                  <div className="flex justify-between text-slate-400"><span>Sunday &amp; Holidays</span><span>Closed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section className="py-14 bg-white border-t border-slate-200" data-testid="library-rules">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Guidelines</p>
            <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">Library Rules & Regulations</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              "Valid membership card required for entry",
              "Silence must be maintained inside the reading room",
              "Books and materials are for reference only — no removal allowed",
              "Personal belongings (bags, food) not permitted inside",
              "Mobile phones must be kept on silent mode",
              "Membership is non-transferable — for personal use only",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#F8FAFC] border border-slate-200 rounded-lg p-4">
                <span className="w-6 h-6 bg-[#0A1E3F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <p className="text-slate-700 text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          data-testid="library-lightbox"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white"
            data-testid="library-lightbox-close"
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <p className="text-center text-white/80 text-sm mt-4">{lightbox.caption}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
