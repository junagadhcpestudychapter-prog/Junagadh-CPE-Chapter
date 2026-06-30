import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, Calendar, Download, ArrowRight, MapPin, Clock, Users, Award, BookOpen, Bell, Phone, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resolveAsset } from "../lib/api";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_SLIDES = [
  {
    image: "https://static.prod-images.emergentagent.com/jobs/6efac5fb-d201-4e5c-abc4-e86d2252a83b/images/889f15a1f817f89f336b7ee096bc8b0d44c11d1f0ae5d119ab1bc99ba7fccc53.png",
    tag: "Welcome to",
    title: "Junagadh CPE Study Chapter",
    subtitle: "Institute of Chartered Accountants of India — WIRC",
    cta1: { label: "Upcoming Events", path: "/events" },
    cta2: { label: "About the Chapter", path: "/about" },
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
    tag: "Continuing Professional Education",
    title: "Enhance Knowledge. Earn CPE Credits.",
    subtitle: "Quality programs, expert faculty, and industry-relevant curriculum for practicing Chartered Accountants.",
    cta1: { label: "Register for CPE", path: "/events" },
    cta2: { label: "Our Programs", path: "/events" },
  },
  {
    image: "https://static.prod-images.emergentagent.com/jobs/6efac5fb-d201-4e5c-abc4-e86d2252a83b/images/e86dcc6cd9f314b23fde1184defa5c9137f1b6bf0ae82dc42a06dcfd129cc111.png",
    tag: "Building the CA Community",
    title: "Your Professional Home in Junagadh",
    subtitle: "Connecting Chartered Accountants, fostering professional excellence, and serving the community.",
    cta1: { label: "Meet the Committee", path: "/committee" },
    cta2: { label: "Photo Gallery", path: "/gallery" },
  },
];

const STATS = [
  { value: "100+", label: "Active Members", icon: Users },
  { value: "15+", label: "Events per Year", icon: Calendar },
  { value: "WIRC", label: "ICAI Region", icon: Award },
];

const QUICK_ACCESS = [
  { label: "Upcoming Events", desc: "CPE seminars & workshops", icon: Calendar, path: "/events", color: "bg-blue-50 text-blue-700" },
  { label: "Members Directory", desc: "Find & join fellow CAs", icon: Users, path: "/directory", color: "bg-purple-50 text-purple-700" },
  { label: "Noticeboard", desc: "Circulars & notices", icon: Bell, path: "/noticeboard", color: "bg-amber-50 text-amber-700" },
  { label: "Newsletter", desc: "Monthly publications", icon: BookOpen, path: "/newsletter", color: "bg-green-50 text-green-700" },
  { label: "Committee", desc: "Convener & Dy. Convener", icon: Award, path: "/committee", color: "bg-indigo-50 text-indigo-700" },
  { label: "Contact Us", desc: "Get in touch with us", icon: Phone, path: "/contact", color: "bg-rose-50 text-rose-700" },
];

const categoryColor = (cat) => {
  const m = { "Direct Tax": "bg-blue-100 text-blue-800", "Indirect Tax": "bg-green-100 text-green-800", "FEMA / International Tax": "bg-purple-100 text-purple-800", "Audit & Assurance": "bg-orange-100 text-orange-800", "Corporate Laws": "bg-teal-100 text-teal-800" };
  return m[cat] || "bg-slate-100 text-slate-700";
};

const SectionTag = ({ children }) => (
  <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">{children}</p>
);

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    axios.get(`${API}/events`).then((r) => setEvents(r.data.slice(0, 4))).catch(() => {});
    axios.get(`${API}/announcements`).then((r) => setAnnouncements(r.data.slice(0, 4))).catch(() => {});
    axios.get(`${API}/notices`).then((r) => setNotices(r.data.slice(0, 4))).catch(() => {});
    axios.get(`${API}/gallery`).then((r) => setGallery(r.data.slice(0, 6))).catch(() => {});
  }, []);

  const goTo = (i) => { setSlide(i); startTimer(); };
  const prev = () => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((slide + 1) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── Newsletter Banner ────────────────────────────────────────── */}
      {/* Removed from here - moved below stats bar */}

      {/* ─── Hero Carousel ───────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[560px] max-h-[780px] overflow-hidden" data-testid="hero-section">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E3F]/85 via-[#0A1E3F]/50 to-transparent" />
          </div>
        ))}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-2xl pt-20">
              <p className="text-[#0284C7] text-sm font-semibold uppercase tracking-widest mb-3 fade-in-up">
                {HERO_SLIDES[slide].tag}
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {HERO_SLIDES[slide].title}
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-xl">{HERO_SLIDES[slide].subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={HERO_SLIDES[slide].cta1.path}
                  data-testid="hero-cta-primary"
                  className="px-6 py-3 bg-[#0284C7] text-white font-semibold rounded hover:bg-[#0369A1] transition-colors text-sm"
                >
                  {HERO_SLIDES[slide].cta1.label}
                </Link>
                <Link
                  to={HERO_SLIDES[slide].cta2.path}
                  data-testid="hero-cta-secondary"
                  className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded hover:bg-white/20 transition-colors text-sm backdrop-blur-sm"
                >
                  {HERO_SLIDES[slide].cta2.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Arrows */}
        <button onClick={prev} data-testid="hero-prev" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} data-testid="hero-next" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronRight size={20} />
        </button>
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              data-testid={`hero-dot-${i}`}
              className={`rounded-full transition-all ${i === slide ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────────── */}
      <section className="bg-[#0A1E3F]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="py-8 px-6 text-center">
                <p className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-white/60 text-xs sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter Announcement Banner ──────────────────────────── */}
      <div className="bg-[#0284C7]" data-testid="newsletter-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-white text-[#0284C7] text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0">New</span>
            <p className="text-white font-medium text-sm">
              <strong>The Chartered Accountant</strong> — Inaugural Edition June 2026 is now available!
            </p>
          </div>
          <Link
            to="/newsletter"
            data-testid="newsletter-banner-cta"
            className="flex-shrink-0 px-4 py-1.5 bg-white text-[#0284C7] text-sm font-bold rounded hover:bg-blue-50 transition-colors"
          >
            Read Now
          </Link>
        </div>
      </div>

      {/* ─── Quick Access ─────────────────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFC]" data-testid="quick-access-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionTag>Quick Access</SectionTag>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">What are you looking for?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_ACCESS.map((item, i) =>
              item.external ? (
                <a
                  key={i}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`quick-access-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="hover-card bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center text-center gap-2 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <p className="font-semibold text-sm text-[#0A1E3F]">{item.label}</p>
                  <p className="text-xs text-slate-500 hidden sm:block">{item.desc}</p>
                </a>
              ) : (
                <Link
                  key={i}
                  to={item.path}
                  data-testid={`quick-access-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="hover-card bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center text-center gap-2"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <p className="font-semibold text-sm text-[#0A1E3F]">{item.label}</p>
                  <p className="text-xs text-slate-500 hidden sm:block">{item.desc}</p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── Convener's Message ───────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="chairman-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-[#0284C7]/10 rounded-2xl" />
                <img
                  src="https://customer-assets.emergentagent.com/job_53fa025c-5b53-4c2a-bfbe-05787af0cf31/artifacts/mgjn3ess_DHRUVAL.png"
                  alt="CA. Dhruval Kathiriya - Convener"
                  className="relative w-full rounded-2xl object-cover object-top aspect-[3/4] max-h-96"
                  data-testid="chairman-photo"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#0A1E3F]/90 text-white p-4 rounded-b-2xl">
                  <p className="font-heading font-semibold text-base">CA. Dhruval Kathiriya</p>
                  <p className="text-white/70 text-sm">Convener, Junagadh CPE Study Chapter</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <SectionTag>Convener's Message</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F] mb-6">
                A Message from the Convener
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Dear Esteemed Members and Fellow Chartered Accountants,
                </p>
                <p>
                  It is my privilege and honour to serve as the Convener of the Junagadh CPE Study Chapter of WIRC of ICAI. On behalf of the entire team, I extend a warm welcome to all our members, students, and well-wishers.
                </p>
                <p>
                  Our chapter has been dedicated to providing quality Continuing Professional Education programs, fostering a culture of lifelong learning, and building a strong professional community in Junagadh and the surrounding region. We have recently published our inaugural newsletter edition, "The Chartered Accountant," as part of our commitment to knowledge sharing.
                </p>
                <p>
                  I look forward to your continued support and active participation in our chapter's activities.
                </p>
              </div>
              <Link
                to="/about"
                data-testid="chairman-read-more"
                className="inline-flex items-center gap-2 mt-6 text-[#0284C7] font-semibold hover:text-[#0369A1] transition-colors"
              >
                Read More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dy. Convener's Message ───────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-slate-100" data-testid="dy-convener-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3 order-2 md:order-1">
              <SectionTag>Dy. Convener's Message</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F] mb-6">
                A Message from the Dy. Convener
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>Dear Members and Friends,</p>
                <p>
                  It gives me immense pleasure to be associated with the Junagadh CPE Study Chapter as Dy. Convener. Our constant endeavour is to bring relevant, practical, and high-quality learning opportunities to every member and student in our region.
                </p>
                <p>
                  I warmly encourage you to actively participate in our seminars, study circles, and initiatives. Together, let us build a vibrant professional community and continue to uphold the highest standards of our esteemed profession.
                </p>
                <p className="font-medium text-[#0A1E3F]">Warm regards,<br />CA. Ashish Makwana</p>
              </div>
            </div>
            <div className="md:col-span-2 order-1 md:order-2">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full bg-[#0284C7]/10 rounded-2xl" />
                <img
                  src="https://customer-assets.emergentagent.com/job_junagadh-cpe/artifacts/zxl7v5ow_Ashish.jpeg"
                  alt="CA. Ashish Makwana - Dy. Convener"
                  className="relative w-full rounded-2xl object-cover object-top aspect-[3/4] max-h-96"
                  data-testid="dy-convener-photo"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#0A1E3F]/90 text-white p-4 rounded-b-2xl">
                  <p className="font-heading font-semibold text-base">CA. Ashish Makwana</p>
                  <p className="text-white/70 text-sm">Dy. Convener, Junagadh CPE Study Chapter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Section ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTag>About Us</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F] mb-6">
                Junagadh CPE Study Chapter at a Glance
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The Junagadh CPE Study Chapter is a Study Chapter under WIRC (Western India Regional Council) of the Institute of Chartered Accountants of India (ICAI), serving the Chartered Accountants of Junagadh and the surrounding Saurashtra region.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Established with the vision of providing accessible and high-quality Continuing Professional Education (CPE) to members, our chapter organizes seminars, workshops, study circles, and other professional development programs throughout the year.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Members", value: "100+" },
                  { label: "Events per Year", value: "15+" },
                  { label: "CPE Hours", value: "50+" },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="font-heading text-2xl font-bold text-[#0A1E3F]">{s.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                data-testid="about-learn-more"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1E3F] text-white font-semibold rounded hover:bg-[#173059] transition-colors"
              >
                Learn More <ArrowRight size={16} />
              </Link>
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

      {/* ─── Upcoming Events ──────────────────────────────────────────── */}
      {events.length > 0 && (
      <section className="py-20 bg-white" data-testid="events-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionTag>Programs & Events</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Upcoming CPE Events</h2>
            </div>
            <Link to="/events" data-testid="view-all-events" className="hidden sm:flex items-center gap-1 text-[#0284C7] font-semibold hover:text-[#0369A1] transition-colors text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <div key={event.id} data-testid={`event-card-${event.id}`} className="hover-card bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="relative">
                  <img src={resolveAsset(event.banner_url) || "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?w=400"} alt={event.title} className="w-full h-40 object-cover" />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-[#0A1E3F] text-sm leading-snug mb-2 line-clamp-2">{event.title}</h3>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={12} /> <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <MapPin size={12} /> <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock size={12} /> <span>{event.cpe_hours} CPE Hours</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0A1E3F] text-sm">{event.fee > 0 ? `₹${event.fee.toLocaleString()}` : "FREE"}</span>
                    <Link to="/events" className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors ${event.is_open ? "bg-[#0A1E3F] text-white hover:bg-[#173059]" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                      {event.is_open ? "Register" : "Closed"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/events" className="inline-flex items-center gap-1 text-[#0284C7] font-semibold">View All Events <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
      )}

      {/* ─── Announcements & Noticeboard ─────────────────────────────── */}
      {(announcements.length > 0 || notices.length > 0) && (
      <section className="py-20 bg-[#F8FAFC]" data-testid="announcements-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Announcements */}
            <div className="lg:col-span-3">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <SectionTag>Latest</SectionTag>
                  <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">News & Announcements</h2>
                </div>
              </div>
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} data-testid={`announcement-${ann.id}`} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 hover-card">
                    <img src={ann.image_url} alt={ann.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase text-[#0284C7] tracking-wider">{ann.category}</span>
                      <h4 className="font-heading font-semibold text-[#0A1E3F] text-sm leading-snug mt-0.5 line-clamp-2">{ann.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Noticeboard */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <SectionTag>Downloads</SectionTag>
                  <h2 className="font-heading text-2xl font-bold text-[#0A1E3F]">Noticeboard</h2>
                </div>
                <Link to="/noticeboard" className="text-[#0284C7] text-sm font-semibold hover:text-[#0369A1]">View All</Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {notices.map((notice, i) => (
                  <div key={notice.id} data-testid={`notice-${notice.id}`} className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${i < notices.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${notice.type === "member" ? "bg-[#0284C7]" : "bg-green-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0A1E3F] line-clamp-2 leading-snug">{notice.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <a href={notice.pdf_url} data-testid={`notice-download-${notice.id}`} className="text-[#0284C7] hover:text-[#0369A1] flex-shrink-0 p-1.5 hover:bg-blue-50 rounded transition-colors">
                      <Download size={14} />
                    </a>
                  </div>
                ))}
              </div>
              <Link to="/noticeboard" className="block mt-4 text-center py-2.5 border border-[#0A1E3F] text-[#0A1E3F] rounded text-sm font-semibold hover:bg-[#0A1E3F] hover:text-white transition-colors">
                View All Notices
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ─── Gallery Preview ──────────────────────────────────────────── */}
      {gallery.length > 0 && (
      <section className="py-20 bg-white" data-testid="gallery-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionTag>Media</SectionTag>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0A1E3F]">Photo Gallery</h2>
            </div>
            <Link to="/gallery" data-testid="view-all-gallery" className="hidden sm:flex items-center gap-1 text-[#0284C7] font-semibold hover:text-[#0369A1] text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <Link key={item.id} to="/gallery" data-testid={`gallery-thumb-${item.id}`} className="group relative overflow-hidden rounded-xl aspect-video hover-card">
                <img src={resolveAsset(item.photo_url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#0A1E3F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs font-medium leading-tight">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ─── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0A1E3F]" data-testid="cta-banner">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Enhance Your Professional Skills?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join our upcoming CPE programs and earn your credit hours while advancing your expertise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events" data-testid="cta-register-btn" className="px-8 py-3 bg-[#0284C7] text-white font-semibold rounded hover:bg-[#0369A1] transition-colors">
              View Upcoming Events
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-white/30 text-white font-semibold rounded hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
