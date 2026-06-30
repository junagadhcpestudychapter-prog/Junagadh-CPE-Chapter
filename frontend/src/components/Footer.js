import { Link } from "react-router-dom";
import { Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A1E3F] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden p-0.5">
                <img
                  src="/icai-logo.png"
                  alt="ICAI"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-base leading-tight">Junagadh CPE</p>
                <p className="text-xs text-white/60 leading-tight">Study Chapter</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              A Study Chapter of WIRC of ICAI dedicated to providing quality Continuing Professional Education to Chartered Accountants in Junagadh and surrounding areas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "About the Chapter", path: "/about" },
                { label: "Upcoming Events", path: "/events" },
                { label: "Committee Members", path: "/committee" },
                { label: "Photo Gallery", path: "/gallery" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-[#0284C7] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publications */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Publications</h4>
            <ul className="space-y-2">
              {[
                { label: "Noticeboard", path: "/noticeboard" },
                { label: "Newsletter", path: "/newsletter" },
                { label: "Members Directory", path: "/directory" },
                { label: "Reading Room", path: "/library" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-[#0284C7] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-heading font-semibold text-base mt-6 mb-4 text-white">ICAI Resources</h4>
            <ul className="space-y-2">
              {[
                { label: "ICAI", url: "https://www.icai.org" },
                { label: "CPE Portal", url: "https://www.cpeicai.org" },
                { label: "WIRC of ICAI", url: "https://www.wirc-icai.org" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} className="flex-shrink-0 text-[#0284C7]" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#0284C7] flex-shrink-0" />
                <div>
                  <a href="tel:+917698532780" className="text-white/70 hover:text-white text-sm transition-colors block">
                    +91 76985 32780
                  </a>
                  <span className="text-white/40 text-xs">CA. Dhruval Kathiriya (Convener)</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#0284C7] flex-shrink-0" />
                <div>
                  <a href="tel:+919624106740" className="text-white/70 hover:text-white text-sm transition-colors block">
                    +91 96241 06740
                  </a>
                  <span className="text-white/40 text-xs">CA. Ashish Makwana (Dy. Convener)</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#0284C7] flex-shrink-0" />
                <a href="mailto:junagadhcpestudychapter@gmail.com" className="text-white/70 hover:text-white text-sm transition-colors break-all">
                  junagadhcpestudychapter@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Junagadh CPE Study Chapter, WIRC of ICAI. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Institute of Chartered Accountants of India
          </p>
          <a href="/admin/login" className="text-white/30 hover:text-white/60 text-xs transition-colors" data-testid="footer-admin-link">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
