import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, Users, BookOpen, Bell, Award, Landmark, UserPlus, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BENEFITS = [
  { icon: Award, title: "All CPE Programs", desc: "Access to seminars, workshops, conferences & study circles organized by the chapter." },
  { icon: BookOpen, title: "Monthly Newsletter", desc: "Receive the chapter's newsletter with professional updates & insights." },
  { icon: Users, title: "Professional Networking", desc: "Connect and collaborate with the local Chartered Accountant community." },
  { icon: Bell, title: "Priority Updates", desc: "Be the first to know about upcoming events, notices and circulars." },
];

export default function Membership() {
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

      {/* Fee + Benefits */}
      <section className="py-16" data-testid="membership-main">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Fee Card */}
            <div className="bg-[#0A1E3F] rounded-2xl p-10 text-center text-white relative overflow-hidden" data-testid="membership-fee-card">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0284C7]/20 rounded-full" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BadgeIndianRupee size={26} className="text-[#0284C7]" />
                </div>
                <p className="text-sm uppercase tracking-widest text-[#0284C7] font-semibold">Annual Membership — Members</p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScKXBivGFsfhXTy7uXIhqQX0Y4zWkrnKsGuiLvu4JsNG2-u9w/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="membership-join-btn"
                  className="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-[#0284C7] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-colors text-sm"
                >
                  Join Now <ArrowRight size={15} />
                </a>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Why Join</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F] mb-6">Membership Benefits</h2>
              <div className="space-y-5">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-4" data-testid={`membership-benefit-${i}`}>
                    <div className="w-10 h-10 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center flex-shrink-0">
                      <b.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-[#0A1E3F] text-base">{b.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Member */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200" data-testid="membership-join">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-1">Join the Chapter</p>
            <h2 className="font-heading font-bold text-[#0A1E3F] text-2xl sm:text-3xl">Become a Member &amp; Get Listed</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-2xl mx-auto">
              Pay the annual membership fee of <span className="font-semibold text-[#0A1E3F]">₹500</span> to the chapter's bank account, then fill the form with your details. Your <span className="font-semibold text-[#0A1E3F]">Bank Reference / UTR Number is mandatory</span>.
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
              <p className="text-xs text-slate-400 mt-4">Note down the Bank Reference / UTR Number after payment — you'll need to enter it in the form.</p>
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
                href="https://docs.google.com/forms/d/e/1FAIpQLScKXBivGFsfhXTy7uXIhqQX0Y4zWkrnKsGuiLvu4JsNG2-u9w/viewform?usp=header"
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

      <Footer />
    </div>
  );
}
