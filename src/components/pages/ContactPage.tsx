import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { apiFetch } from '../../utils/clientApiBridge';

export const ContactPage: React.FC = () => {
  const { settings, startBooking, showToast } = useClinic();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'general' | 'new-patient' | 'treatment' | 'nervous-patient' | 'billing'>('general');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [message, setMessage] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }
    if (!agreedPrivacy) {
      setErrorMsg('Please acknowledge the privacy notice.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          preferredContact,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message.');
      }

      setSuccessSubmitted(true);
      showToast('Thank you! Your enquiry has been received by our reception team.', 'success');
      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setAgreedPrivacy(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'Unable to submit enquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Our Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Have a question about a treatment, dental insurance, or scheduling? Our friendly reception team is here to assist you.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send an Online Enquiry</h2>
            <p className="text-xs text-slate-500 mt-1">
              We respond to all patient enquiries within 2-4 business hours.
            </p>
          </div>

          {successSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold">Enquiry Sent Successfully!</strong>
                <span>
                  Our practice coordinator has received your message and will contact you via your preferred method shortly.
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="michael@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enquiry Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="general">General Enquiry</option>
                  <option value="new-patient">New Patient Consultation</option>
                  <option value="treatment">Treatment Specific Question</option>
                  <option value="nervous-patient">Nervous / Anxious Patient Guidance</option>
                  <option value="billing">Insurance & Financing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Contact Method
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone Call' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPreferredContact(m.id as any)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      preferredContact === m.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                How Can We Help? *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your dental goals, symptoms, or any questions you have for our team..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <span>
                  I understand that this form is for non-urgent enquiries and agree to the clinic privacy policy. For medical emergencies, call the emergency hotline directly.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Sending Enquiry...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Reception</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Direct Contact Details & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-xl font-bold">Contact Details</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-200 font-semibold mb-0.5">Studio Address</strong>
                  <span className="text-slate-400">
                    {settings.address.street}, {settings.address.suite}
                    <br />
                    {settings.address.city}, {settings.address.state} {settings.address.zip}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-200 font-semibold mb-0.5">Telephone</strong>
                  <a href={`tel:${settings.phone}`} className="text-slate-300 hover:text-white">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-200 font-semibold mb-0.5">Email Inquiries</strong>
                  <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-white">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-200 font-semibold mb-0.5">Opening Hours</strong>
                  <span className="text-slate-400 block">{settings.openingHours.weekday}</span>
                  <span className="text-slate-400 block">{settings.openingHours.saturday}</span>
                  <span className="text-slate-400 block">{settings.openingHours.sunday}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Link */}
            <div className="pt-4 border-t border-slate-800">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Booking CTA Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Prefer to Book Online Instantly?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Skip the email wait—view all real-time open slots and reserve your examination in 2 minutes.
            </p>
            <button
              onClick={() => startBooking()}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
