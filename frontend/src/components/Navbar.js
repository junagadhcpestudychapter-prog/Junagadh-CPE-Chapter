import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Membership", path: "/membership" },
  { label: "Events", path: "/events" },
  { label: "Committee", path: "/committee" },
  { label: "Gallery", path: "/gallery" },
  {
    label: "Publications",
    children: [
      { label: "Noticeboard", path: "/noticeboard" },
      { label: "Newsletter", path: "/newsletter" },
    ],
  },
  { label: "Directory", path: "/directory" },
  { label: "Resources", path: "/resources" },
  { label: "Library", path: "/library" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pubOpen, setPubOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPubOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-white border-b border-slate-200"
      }`}
    >
      {/* Top bar */}
      <div className="bg-[#0A1E3F] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="opacity-80">Institute of Chartered Accountants of India</span>
          <a
            href="https://www.icai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity underline"
          >
            Visit ICAI Website
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="navbar-logo">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <img
                src="/icai-logo.png"
                alt="ICAI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-[#0A1E3F] text-base leading-tight whitespace-nowrap">
                Junagadh CPE Study Chapter
              </p>
              <p className="text-xs text-slate-500 leading-tight">WIRC of ICAI</p>
            </div>
          </Link>

          {/* Right: CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/events"
              data-testid="nav-register-cta"
              className="hidden lg:inline-flex px-4 py-2 bg-[#0A1E3F] text-white text-sm font-semibold rounded hover:bg-[#173059] transition-colors"
            >
              Register for CPE
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="navbar-mobile-toggle"
              className="lg:hidden p-2 rounded text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav (below name) */}
        <div className="hidden lg:flex items-center justify-between border-t border-slate-100 py-2">
          {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setPubOpen(!pubOpen)}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                      pubOpen
                        ? "text-[#0284C7] bg-blue-50"
                        : "text-slate-700 hover:text-[#0A1E3F] hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${pubOpen ? "rotate-180" : ""}`} />
                  </button>
                  {pubOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          data-testid={`nav-${child.label.toLowerCase()}`}
                          className={`block px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                            isActive(child.path) ? "text-[#0284C7] font-medium" : "text-slate-700"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive(link.path)
                      ? "text-[#0284C7] bg-blue-50"
                      : "text-slate-700 hover:text-[#0A1E3F] hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          data-testid="navbar-mobile-menu"
          className="lg:hidden border-t border-slate-200 bg-white shadow-lg"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`block px-6 py-2 text-sm rounded transition-colors ${
                        isActive(child.path)
                          ? "text-[#0284C7] bg-blue-50 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive(link.path)
                      ? "text-[#0284C7] bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/events"
              className="block mt-2 px-3 py-2.5 bg-[#0A1E3F] text-white text-sm font-semibold rounded text-center"
            >
              Register for CPE
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
