import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Phone, Mail, Clock, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/contact`, form);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again or contact us directly.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A1E3F] pt-28 pb-14" data-testid="contact-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-white/70 mt-3 text-lg">Get in touch with the Junagadh CPE Study Chapter. We'd love to hear from you.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6" data-testid="contact-info">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#0284C7] mb-2">Get in Touch</p>
                <h2 className="font-heading text-2xl font-bold text-[#0A1E3F] mb-4">Chapter Office Details</h2>
                <p className="text-slate-600 leading-relaxed">
                  Visit us at the chapter office or reach out via phone or email. We are here to assist you with all your queries related to CPE programs, membership, and chapter activities.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-[#0A1E3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1E3F] text-sm mb-1">Phone</p>
                    <a href="tel:+917698532780" data-testid="contact-phone" className="text-[#0284C7] hover:text-[#0369A1] text-sm transition-colors">
                      +91 76985 32780
                    </a>
                    <p className="text-slate-500 text-xs mt-0.5">CA. Dhruval Kathiriya (Convener)</p>
                    <a href="tel:+919624106740" className="text-[#0284C7] hover:text-[#0369A1] text-sm transition-colors mt-1 block">
                      +91 96241 06740
                    </a>
                    <p className="text-slate-500 text-xs mt-0.5">CA. Ashish Makwana (Dy. Convener)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-[#0A1E3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1E3F] text-sm mb-1">Email</p>
                    <a href="mailto:junagadhcpestudychapter@gmail.com" data-testid="contact-email-link" className="text-[#0284C7] hover:text-[#0369A1] text-sm transition-colors">
                      junagadhcpestudychapter@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-[#0A1E3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1E3F] text-sm mb-1">Office Hours</p>
                    <p className="text-slate-600 text-sm">
                      Monday – Friday: 10:00 AM – 6:00 PM<br />
                      Saturday: 10:00 AM – 2:00 PM<br />
                      Sunday & Public Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3" data-testid="contact-form-section">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                {success ? (
                  <div className="text-center py-8" data-testid="contact-success">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-heading font-bold text-[#0A1E3F] text-2xl mb-2">Message Sent!</h3>
                    <p className="text-slate-600 mb-6">Thank you for reaching out. We will get back to you within 2 working days.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2.5 bg-[#0A1E3F] text-white rounded font-semibold hover:bg-[#173059] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-[#0A1E3F] text-2xl mb-2">Send us a Message</h2>
                    <p className="text-slate-500 text-sm mb-6">Fill in the form below and we'll get back to you as soon as possible.</p>
                    <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                          <input
                            name="name"
                            data-testid="contact-name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="CA. Your Name"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                          <input
                            name="email"
                            type="email"
                            data-testid="contact-email-input"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                          <input
                            name="phone"
                            type="tel"
                            data-testid="contact-phone-input"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                          <input
                            name="subject"
                            data-testid="contact-subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Event inquiry, membership, etc."
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message <span className="text-red-500">*</span></label>
                        <textarea
                          name="message"
                          data-testid="contact-message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Write your message here..."
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent resize-none"
                          required
                        />
                      </div>
                      {error && (
                        <p data-testid="contact-error" className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
                          {error}
                        </p>
                      )}
                      <button
                        type="submit"
                        data-testid="contact-submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#0A1E3F] text-white font-semibold rounded-lg hover:bg-[#173059] transition-colors disabled:opacity-60 text-sm"
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
