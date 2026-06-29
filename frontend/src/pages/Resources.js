import { Link } from "react-router-dom";
import { ExternalLink, Globe, GraduationCap, BookOpen, FileText, Library, Award, Briefcase, ScrollText, Landmark, ClipboardCheck, BookMarked } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PORTALS = [
  { name: "Self Service Portal (SSP)", desc: "Member & student e-services login", url: "https://eservices.icai.org/", icon: Briefcase },
  { name: "CPE Portal", desc: "Track your CPE credit hours", url: "https://www.cpeicai.org/", icon: Award },
  { name: "Digital Learning Hub", desc: "ICAI e-learning courses & webcasts", url: "https://icai.org/elearning", icon: GraduationCap },
  { name: "BoS Knowledge Portal", desc: "Board of Studies live classes & resources", url: "https://live.icai.org/bos/vcc/", icon: BookOpen },
  { name: "ICAI e-Services", desc: "All online member & student services", url: "https://www.icai.org/category/e-services", icon: ClipboardCheck },
  { name: "Students Services", desc: "Registration, articleship & exams", url: "https://www.icai.org/post/students-services", icon: GraduationCap },
  { name: "WIRC of ICAI", desc: "Western India Regional Council", url: "https://www.wirc-icai.org/", icon: Landmark },
  { name: "ICAI Main Website", desc: "Institute of Chartered Accountants of India", url: "https://www.icai.org/", icon: Globe },
];

const PUBLICATIONS = [
  { name: "The Chartered Accountant Journal", desc: "ICAI's monthly professional journal", url: "https://www.icai.org/category/journals-publications", icon: BookMarked },
  { name: "Accounting Standards", desc: "Accounting Standards Board (ASB)", url: "https://www.icai.org/category/accounting-standards", icon: ScrollText },
  { name: "Standards on Auditing", desc: "Auditing & Assurance Standards Board", url: "https://aasb.icai.org/", icon: FileText },
  { name: "Guidance Notes", desc: "Technical & audit guidance notes", url: "https://www.icai.org/category/guidance-notes", icon: FileText },
  { name: "ICAI Publications (CDS)", desc: "Order ICAI books & publications online", url: "https://cds.icai.org/", icon: Library },
  { name: "Taxation Resources", desc: "Direct & Indirect Tax committee resources", url: "https://www.icai.org/category/taxation", icon: ScrollText },
];

const LinkCard = ({ item, testid }) => (
  <a
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    data-testid={testid}
    className="hover-card group bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4"
  >
    <div className="w-11 h-11 rounded-lg bg-[#0A1E3F]/5 text-[#0284C7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
      <item.icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <h3 className="font-heading font-semibold text-[#0A1E3F] text-base leading-snug">{item.name}</h3>
        <ExternalLink size={13} className="text-slate-300 group-hover:text-[#0284C7] transition-colors flex-shrink-0" />
      </div>
      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
    </div>
  </a>
);

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="resources-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Resources</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">ICAI Resources</h1>
          <p className="text-white/70 mt-3 text-lg max-w-2xl">
            Quick access to important ICAI portals, services, and professional publications for members and students.
          </p>
        </div>
      </div>

      {/* Portals & Services */}
      <section className="py-16" data-testid="portals-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Online Services</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Portals & Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PORTALS.map((item, i) => (
              <LinkCard key={item.name} item={item} testid={`portal-link-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200" data-testid="publications-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Knowledge & Standards</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Publications & Standards</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PUBLICATIONS.map((item, i) => (
              <LinkCard key={item.name} item={item} testid={`publication-link-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Globe size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 text-sm">
              All links open the official ICAI / WIRC websites in a new tab. For any access issues, please <Link to="/contact" className="underline font-medium">contact the chapter office</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
