import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, Clock, Users, CheckCircle, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resolveAsset } from "../lib/api";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryColor = (cat) => {
  const m = {
    "Direct Tax": "bg-blue-100 text-blue-800",
    "Indirect Tax": "bg-green-100 text-green-800",
    "FEMA / International Tax": "bg-purple-100 text-purple-800",
    "Audit & Assurance": "bg-orange-100 text-orange-800",
    "Corporate Laws": "bg-teal-100 text-teal-800",
  };
  return m[cat] || "bg-slate-100 text-slate-700";
};

function RegistrationModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", membership_no: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/events/${event.id}/register`, form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="registration-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-[#0A1E3F] p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#0284C7] text-xs font-semibold uppercase tracking-wider mb-1">Register for Event</p>
              <h3 className="font-heading font-bold text-white text-xl leading-snug">{event.title}</h3>
            </div>
            <button onClick={onClose} data-testid="close-modal" className="text-white/60 hover:text-white p-1 transition-colors ml-2 flex-shrink-0">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5"><Calendar size={13} />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} />{event.venue}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} />{event.cpe_hours} CPE Hours</span>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center" data-testid="registration-success">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="font-heading font-bold text-[#0A1E3F] text-xl mb-2">Registration Successful!</h3>
            <p className="text-slate-600 mb-6">Your registration for <strong>{event.title}</strong> has been confirmed. You will receive further details on your email.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-[#0A1E3F] text-white rounded font-semibold hover:bg-[#173059] transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4" data-testid="registration-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  data-testid="reg-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="CA. Your Name"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  data-testid="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  data-testid="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ICAI Membership No.</label>
                <input
                  data-testid="reg-membership"
                  type="text"
                  value={form.membership_no}
                  onChange={(e) => setForm({ ...form, membership_no: e.target.value })}
                  placeholder="e.g. 123456"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                />
              </div>
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-slate-600">Registration Fee</span>
              <span className="font-heading font-bold text-[#0A1E3F] text-lg">{event.fee > 0 ? `₹${event.fee.toLocaleString()}` : "FREE"}</span>
            </div>
            {error && <p data-testid="reg-error" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                data-testid="submit-registration"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-[#0A1E3F] text-white rounded-lg text-sm font-semibold hover:bg-[#173059] transition-colors disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Confirm Registration"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    axios.get(`${API}/events`)
      .then((r) => { setEvents(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(events.map((e) => e.category))];
  const filtered = selectedCategory === "All" ? events : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="events-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Events & Programs</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">CPE Events & Programs</h1>
          <p className="text-white/70 mt-3 text-lg">Register for upcoming CPE seminars, workshops, and study circles.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#F8FAFC] border-b border-slate-200" data-testid="events-filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0A1E3F] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-[#0A1E3F] hover:text-[#0A1E3F]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-16" data-testid="events-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-slate-100 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No events found in this category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <div key={event.id} data-testid={`event-card-${event.id}`} className="hover-card bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="relative">
                    <img
                      src={resolveAsset(event.banner_url) || "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?w=400"}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {!event.is_open && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1 rounded-full">Registration Closed</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-[#0A1E3F] text-base leading-snug mb-3">{event.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#0284C7] flex-shrink-0" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          {event.date !== event.end_date && ` – ${new Date(event.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#0284C7] flex-shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#0284C7] flex-shrink-0" />
                        <span>{event.cpe_hours} CPE Hours</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Registration Fee</p>
                        <p className="font-heading font-bold text-[#0A1E3F] text-lg">{event.fee > 0 ? `₹${event.fee.toLocaleString()}` : "FREE"}</p>
                      </div>
                      <button
                        onClick={() => event.is_open && setSelectedEvent(event)}
                        data-testid={`register-btn-${event.id}`}
                        disabled={!event.is_open}
                        className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                          event.is_open
                            ? "bg-[#0A1E3F] text-white hover:bg-[#173059] cursor-pointer"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {event.is_open ? "Register Now" : "Closed"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-12 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <Users size={32} className="text-[#0284C7] mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-[#0A1E3F] mb-2">Expert Faculty</h4>
              <p className="text-slate-500 text-sm">Programs conducted by eminent practitioners and subject matter experts.</p>
            </div>
            <div className="p-6">
              <CheckCircle size={32} className="text-[#0284C7] mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-[#0A1E3F] mb-2">CPE Credit Hours</h4>
              <p className="text-slate-500 text-sm">All programs are recognized for CPE credit hours by ICAI.</p>
            </div>
            <div className="p-6">
              <Clock size={32} className="text-[#0284C7] mx-auto mb-3" />
              <h4 className="font-heading font-semibold text-[#0A1E3F] mb-2">Certificate Provided</h4>
              <p className="text-slate-500 text-sm">Participation certificates issued to all registered attendees.</p>
            </div>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <RegistrationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      <Footer />
    </div>
  );
}
