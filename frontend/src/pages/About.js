import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, BookOpen, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SectionTag = ({ children }) => (
  <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">{children}</p>
);

const dummy = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A1E3F&color=fff&size=200&bold=true`;

const PAST_CONVENERS = [
  { name: "CA Mohit Adatiya", year: "2018-19", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/1l3qcg75_mohit%20adatia.jpeg" },
  { name: "CA Shital Thadeshwer", year: "2019-20", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/5zgfodi7_Shitalmam.jpeg" },
  { name: "CA Poojan Parmar", year: "2020-21", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/3xicgrs2_Poojan%20Parmar.jpeg" },
  { name: "CA Ashish Shah", year: "2021-22", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/rdn95oyi_Ashish%20Shah.jpeg" },
  { name: "CA Anand Unadkat", year: "2022-23", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/921zsv4d_Anand%20Unadkat.jpeg" },
  { name: "CA Hetal Devani", year: "2023-24", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/69sovoji_CA%20Hetal%20Dewani%20f.png" },
  { name: "CA Yash Karia", year: "2024-25", photo: "https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/c3446h72_yash%20karia.png" },
  { name: "CA Hiren Devani", year: "2025-26", photo: "https://customer-assets.emergentagent.com/job_cpe-chapter-deploy/artifacts/3konkfrk_ChatGPT%20Image%20Jun%2029%2C%202026%2C%2007_52_05%20PM.png" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="about-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">About Us</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">About the Chapter</h1>
          <p className="text-white/70 mt-3 text-lg max-w-2xl">Learn about the Junagadh CPE Study Chapter, our history, mission, and our commitment to professional excellence.</p>
        </div>
      </div>

      {/* Chapter Overview */}
      <section className="py-20" data-testid="chapter-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTag>About Us</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F] mb-6">
                Junagadh CPE Study Chapter
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  The Junagadh CPE Study Chapter is a Study Chapter under the Western India Regional Council (WIRC) of the Institute of Chartered Accountants of India (ICAI). The chapter serves the professional community of Chartered Accountants in Junagadh and the broader Saurashtra region of Gujarat.
                </p>
                <p>
                  Our chapter is dedicated to organizing high-quality Continuing Professional Education (CPE) programs, including seminars, workshops, conferences, and study circles, covering all areas of professional relevance such as Direct Tax, Indirect Tax (GST), Accounting Standards, Auditing, Corporate Laws, and emerging areas like IT and Data Analytics.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/6950031/pexels-photo-6950031.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="About the Chapter"
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[#F8FAFC]" data-testid="vision-mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTag>Our Foundation</SectionTag>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Vision, Mission & Objectives</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                content: "To be the premier professional development platform for Chartered Accountants in the Junagadh region, fostering a culture of continuous learning, ethical practice, and professional excellence.",
                color: "bg-blue-50 text-blue-700",
              },
              {
                icon: Target,
                title: "Our Mission",
                content: "To organize and deliver high-quality CPE programs, study circles, and professional development events that equip our members with the knowledge and skills needed to excel in their practice and serve the society better.",
                color: "bg-navy text-navy bg-[#0A1E3F]/5",
              },
              {
                icon: BookOpen,
                title: "Objectives",
                content: "Provide accessible and affordable CPE programs, facilitate knowledge sharing among members, promote professional ethics, strengthen the CA community in Junagadh, and support upcoming CA students.",
                color: "bg-green-50 text-green-700",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 hover-card" data-testid={`vmobj-${i}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-[#0A1E3F] text-xl mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Conveners */}
      <section className="py-20 bg-white border-t border-slate-100" data-testid="past-conveners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTag>Our Legacy</SectionTag>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Past Conveners</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm">
              We gratefully acknowledge the leadership of our past Conveners who shaped the Junagadh CPE Study Chapter over the years.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {PAST_CONVENERS.map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover-card text-center" data-testid={`past-convener-${i}`}>
                <div className="aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={c.photo}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-[#0A1E3F] text-base leading-snug">{c.name}</h3>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#0284C7] bg-[#0284C7]/10 px-3 py-1 rounded-full">
                    Convener {c.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter History */}
      {/* ICAI Overview */}
      <section className="py-20 bg-[#0A1E3F]" data-testid="icai-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#0284C7] text-sm font-semibold uppercase tracking-widest mb-2">Parent Body</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-6">
                About ICAI
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                The Institute of Chartered Accountants of India (ICAI) is the national professional accounting body of India, established under the Chartered Accountants Act, 1949. It is the second largest accounting body in the world with over 3.5 lakh members and 8 lakh students.
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                ICAI regulates the profession of Chartered Accountancy in India and has been instrumental in the development of the accounting profession in the country.
              </p>
              <a
                href="https://www.icai.org"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="icai-website-link"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284C7] text-white font-semibold rounded hover:bg-[#0369A1] transition-colors"
              >
                <Globe size={16} /> Visit ICAI Website
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "3.5 Lakh+", label: "Members Worldwide" },
                { value: "8 Lakh+", label: "Students Enrolled" },
                { value: "5", label: "Regional Councils" },
                { value: "164+", label: "Branches in India" },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-6 text-center">
                  <p className="font-heading text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-white/60 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Membership */}
      <section className="py-20 bg-white border-t border-slate-100" data-testid="membership-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionTag>Become a Member</SectionTag>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Chapter Membership</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm">
              Join the Junagadh CPE Study Chapter and become part of our growing professional community of Chartered Accountants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
            {/* Fee Card */}
            <div className="bg-[#0A1E3F] rounded-2xl p-8 text-center text-white" data-testid="membership-fee-card">
              <p className="text-sm uppercase tracking-widest text-[#0284C7] font-semibold">Annual Membership</p>
              <Link
                to="/contact"
                data-testid="membership-join-btn"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors text-sm"
              >
                Contact to Join <ArrowRight size={15} />
              </Link>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-heading font-bold text-[#0A1E3F] text-lg mb-4">Membership Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Access to all CPE seminars, workshops & study circles",
                  "Monthly chapter newsletter & professional updates",
                  "Networking with the local CA community",
                  "Priority intimation of events and notices",
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm" data-testid={`membership-benefit-${i}`}>
                    <span className="w-5 h-5 bg-[#0284C7]/10 text-[#0284C7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-4">Have Questions About the Chapter?</h2>
          <p className="text-slate-600 mb-8">Reach out to us or explore our upcoming CPE programs and events.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-6 py-3 bg-[#0A1E3F] text-white font-semibold rounded hover:bg-[#173059] transition-colors">
              Get in Touch
            </Link>
            <Link to="/events" className="px-6 py-3 border border-[#0A1E3F] text-[#0A1E3F] font-semibold rounded hover:bg-[#0A1E3F] hover:text-white transition-colors">
              View Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
