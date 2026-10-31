import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Download,
  Clock,
  Heart,
  Baby,
  Accessibility,
  HelpCircle,
  Calendar,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const PatientInfoPage: React.FC = () => {
  const { startBooking, navigate } = useClinic();
  const [openSection, setOpenSection] = useState<string>('first-visit');

  const faqs = [
    {
      q: 'How early should I arrive for my appointment?',
      a: 'We ask new patients to arrive approximately 10 minutes prior to their scheduled time to complete the digital medical history intake on our lounge iPads and enjoy a warm beverage.',
    },
    {
      q: 'What should I do if I have dental insurance?',
      a: 'Please bring your insurance card or digital subscriber details. We verify your benefits in real-time, explain what is covered, and file direct electronic claims on your behalf.',
    },
    {
      q: 'Do you offer translation or multilingual assistance?',
      a: 'Yes, our team members speak English, French, Spanish, Russian, Mandarin, Hindi, and Gujarati. If you require specialized translation assistance, please let us know during booking.',
    },
    {
      q: 'Can I bring a family member or friend into the consultation room?',
      a: 'Absolutely. We have comfortable guest seating in every private treatment suite so your partner, parent, or friend can accompany you throughout the consultation.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Patient Resource Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need for Your Visit
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Guidance on preparing for your appointment, clinic amenities, insurance coverage, and our patient-centered policies.
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">First-Visit Guide</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            What to bring, what to expect, and how we ensure a completely anxiety-free experience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Baby className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Children's Care</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fun, stress-free milestone checkups and cavity prevention sealants for kids and teens.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Accessibility className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Accessibility</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Step-free elevator access, wide clinical doors, and sensory-friendly appointments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Forms & Consent</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Digital intake forms and printable medical history forms to save time on arrival.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Section 1: First Visit & What to Bring */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Your First Appointment: What to Bring</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To make your first checkup as seamless as possible, please bring the following items:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Government Photo ID</strong>
                  <span className="text-slate-500">Driver’s License or Passport for patient file.</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Dental Insurance Card</strong>
                  <span className="text-slate-500">Physical or digital insurance details for claims.</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Current Medications List</strong>
                  <span className="text-slate-500">Any prescriptions or medical conditions.</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Recent Dental X-Rays</strong>
                  <span className="text-slate-500">If taken in the past 12 months, or we can take fresh ones.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Daily Oral Hygiene Guidelines */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-2xl font-bold text-slate-900">Daily Oral Health Recommendations</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our clinical preventive team recommends these evidence-based daily habits:
            </p>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                <strong className="block font-bold text-slate-900 mb-1">1. Brush Twice Daily for Two Full Minutes</strong>
                Hold an electric or soft-bristled toothbrush at a 45-degree angle toward the gumline. Clean all outer, inner, and chewing surfaces with gentle circular motions.
              </div>
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                <strong className="block font-bold text-slate-900 mb-1">2. Clean Between Teeth Every Single Day</strong>
                Toothbrushing cleans only 60% of tooth surfaces. Use dental floss or interdental brushes to remove plaque from between tight contact points where decay begins.
              </div>
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                <strong className="block font-bold text-slate-900 mb-1">3. Don’t Rinse Immediately After Brushing</strong>
                Spit out excess toothpaste but avoid immediately rinsing with water. Leaving a microscopic layer of fluoride protects enamel remineralization for hours.
              </div>
            </div>
          </div>

          {/* Section 3: Cancellation & Rescheduling Policy */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <Clock className="w-5 h-5 text-rose-600" />
              <span>Appointment & Cancellation Policy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your appointment represents dedicated, reserved clinical time with a qualified dental surgeon and assistant. We kindly ask for at least <strong>24 hours' notice</strong> if you need to reschedule or cancel your visit. This allows us to reallocate the slot to patients experiencing acute tooth pain.
            </p>
          </div>
        </div>

        {/* Right Column: Forms & FAQs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Printable Forms Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-base">Download Patient Forms</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prefer to fill out forms by hand prior to arrival? Download our standard intake PDFs:
            </p>

            <div className="space-y-2">
              <a
                href="#download-medical-history"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Medical History Form downloaded.');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors"
              >
                <span>Medical History Intake (PDF)</span>
                <Download className="w-4 h-4 text-teal-400" />
              </a>
              <a
                href="#download-privacy-consent"
                onClick={(e) => {
                  e.preventDefault();
                  alert('HIPAA Privacy Consent Form downloaded.');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors"
              >
                <span>Privacy & Consent Form (PDF)</span>
                <Download className="w-4 h-4 text-teal-400" />
              </a>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              *Note: You can also easily complete these digitally on our lounge iPads upon arrival.
            </div>
          </div>

          {/* Patient FAQs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Patient FAQs</h3>
            <div className="space-y-3 text-xs">
              {faqs.map((faq, i) => (
                <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="font-semibold text-slate-900 mb-1">{faq.q}</div>
                  <div className="text-slate-500 leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="bg-teal-700 text-white rounded-3xl p-6 text-center space-y-3">
            <h3 className="font-bold text-base">Ready to schedule your visit?</h3>
            <p className="text-xs text-teal-100">
              View real-time slot availability for comprehensive checkups and consultations.
            </p>
            <button
              onClick={() => startBooking()}
              className="w-full bg-white text-teal-900 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
