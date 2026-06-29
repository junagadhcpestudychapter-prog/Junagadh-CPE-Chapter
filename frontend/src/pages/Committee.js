import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, Phone } from "lucide-react";
import { resolveAsset } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/committee`)
      .then((r) => { setMembers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const officeBearers = members.filter((m) => m.category === "office_bearer");
  const committeeMembers = members.filter((m) => m.category === "member");

  const MemberCard = ({ member, large }) => (
    <div data-testid={`member-card-${member.id}`} className="hover-card bg-white border border-slate-200 rounded-2xl overflow-hidden text-center">
      <div className={`bg-gradient-to-b from-[#0A1E3F]/5 to-white px-4 ${large ? "pt-10 pb-5" : "pt-8 pb-4"}`}>
        <img
          src={resolveAsset(member.photo_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0A1E3F&color=fff&size=300&bold=true`}
          alt={member.name}
          className={`rounded-full mx-auto object-cover object-top border-4 border-white shadow-md ${large ? "w-44 h-44" : "w-24 h-24"}`}
        />
      </div>
      <div className={`px-4 ${large ? "pb-8" : "pb-6"}`}>
        <h3 className={`font-heading font-bold text-[#0A1E3F] mt-2 ${large ? "text-2xl" : "text-base"}`}>{member.name}</h3>
        <span className={`inline-block mt-2 px-4 py-1 bg-[#0A1E3F] text-white font-semibold rounded-full ${large ? "text-sm" : "text-xs"}`}>
          {member.designation}
        </span>
        {member.phone && (
          <a
            href={`tel:${member.phone}`}
            data-testid={`member-phone-${member.id}`}
            className={`flex items-center justify-center gap-1.5 mt-3 text-[#0284C7] hover:text-[#0369A1] transition-colors ${large ? "text-sm" : "text-xs"}`}
          >
            <Phone size={large ? 14 : 12} /> {member.phone}
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            data-testid={`member-email-${member.id}`}
            className={`flex items-center justify-center gap-1.5 mt-2 text-[#0284C7] hover:text-[#0369A1] transition-colors break-all ${large ? "text-sm" : "text-xs"}`}
          >
            <Mail size={large ? 14 : 12} /> {member.email}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="committee-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Committee</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Managing Committee</h1>
          <p className="text-white/70 mt-3 text-lg">Meet the dedicated committee members serving the Junagadh CPE Study Chapter for 2025-26.</p>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="bg-slate-100 rounded-xl h-64 animate-pulse" />)}
          </div>
        </div>
      ) : (
        <>
          {/* Office Bearers */}
          <section className="py-16" data-testid="office-bearers-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Leadership</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Office Bearers 2025-26</h2>
                <p className="text-slate-500 text-sm mt-2">Convener & Dy. Convener leading the Junagadh CPE Study Chapter</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {officeBearers.map((member) => (
                  <MemberCard key={member.id} member={member} large />
                ))}
              </div>
            </div>
          </section>

          {/* Committee Members */}
          {committeeMembers.length > 0 && (
            <section className="py-16 bg-[#F8FAFC]" data-testid="committee-members-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Managing Committee</p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Committee Members</h2>
                </div>
                <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {committeeMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Members Directory CTA */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading text-xl font-bold text-[#0A1E3F] mb-2">Looking for fellow members?</h2>
          <p className="text-slate-500 text-sm mb-5">
            Explore our Members Directory or add your own professional details.
          </p>
          <Link
            to="/directory"
            data-testid="committee-directory-cta"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1E3F] text-white font-semibold rounded hover:bg-[#173059] transition-colors text-sm"
          >
            View Members Directory
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
