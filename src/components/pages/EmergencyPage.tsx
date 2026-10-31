import React from 'react';
import {
  AlertTriangle,
  Phone,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const EmergencyPage: React.FC = () => {
  const { settings, startBooking } = useClinic();

  const emergencyGuides = [
    {
      title: 'Knocked-Out (Avulsed) Permanent Tooth',
      urgency: 'CRITICAL: Act within 60 minutes',
      steps: [
        'Find the tooth and hold it strictly by the smooth white crown—never touch the root surfaces.',
        'If dirty, gently rinse for 5 seconds in cold milk or sterile saline. Do not scrub or use soap.',
        'If possible, gently replant the tooth back into its socket and bite gently on a clean tissue to stabilize.',
        'If replanting is not possible, place the tooth in a small cup of cold cow’s milk or inside your cheek pouch.',
        'Call our emergency line immediately. A tooth replanted within 60 minutes has the highest chance of long-term survival.',
      ],
    },
    {
      title: 'Severe, Throbbing Toothache',
      urgency: 'URGENT: Same-day assessment needed',
      steps: [
        'Rinse your mouth thoroughly with warm salt water (1/2 teaspoon salt in a glass of warm water).',
        'Gently use dental floss around the aching tooth to remove any trapped debris or food particles.',
        'Take an over-the-counter anti-inflammatory (such as Ibuprofen) as directed on the packaging. Never place an aspirin tablet directly against the gum tissue, as this causes chemical burns.',
        'Apply a cold compress to the outside of your cheek in 15-minute intervals to reduce throbbing.',
        'Contact our emergency triage line to reserve a same-day diagnostic assessment.',
      ],
    },
    {
      title: 'Broken, Chipped, or Fractured Tooth',
      urgency: 'URGENT: Assess within 24 hours',
      steps: [
        'Save any broken fragments of the tooth in a clean container with milk or saliva.',
        'Rinse your mouth gently with warm water to clear loose fragments.',
        'If the broken edge is sharp and irritating your tongue or cheek, cover it with dental wax or sugarless chewing gum as a temporary guard.',
        'Call our studio for emergency repair or aesthetic composite bonding.',
      ],
    },
    {
      title: 'Lost Filling or Dislodged Crown',
      urgency: 'MODERATE: Schedule within 24-48 hours',
      steps: [
        'Keep the dislodged crown in a clean, safe container.',
        'Avoid chewing on that side of your mouth and avoid hot or iced beverages that trigger sensitivity.',
        'Temporary dental cement (available at pharmacies) can be used to temporarily protect the exposed tooth structure.',
        'Do not use superglue or household adhesives under any circumstances.',
        'Book an assessment for professional recementation or replacement.',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Top Critical Alert Banner */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-200">
              Immediate Assistance
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Urgent & Emergency Dental Care
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-rose-100 max-w-2xl leading-relaxed">
          If you are experiencing severe dental pain, trauma, or bleeding, call our emergency line immediately. We reserve daily same-day slots for acute dental emergencies.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href={`tel:${settings.emergencyPhone}`}
            className="bg-white hover:bg-slate-100 text-rose-700 font-bold text-sm py-3 px-6 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Emergency Hotline: {settings.emergencyPhone}</span>
          </a>
          <span className="text-xs text-rose-200">
            Regular Clinic Line: {settings.phone}
          </span>
        </div>
      </div>

      {/* Hospital Warning Callout (Life-threatening distinction) */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-amber-900 text-xs sm:text-sm">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="block font-bold text-amber-950 text-sm">
            Important Notice on Life-Threatening Medical Emergencies:
          </strong>
          <p>
            If you are experiencing <strong>severe facial or neck swelling that is rapidly expanding, difficulty breathing, difficulty swallowing, or severe bleeding that will not stop after 20 minutes of firm pressure</strong>, do NOT wait for a dental clinic appointment. Please proceed immediately to your nearest hospital emergency room (A&E / ER) or call 911 / 999.
          </p>
        </div>
      </div>

      {/* Emergency First Aid Matrix */}
      <div className="space-y-8">
        <div>
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Immediate Self-Care Guidance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Emergency Dental First-Aid Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Steps to take immediately while on your way to our studio or waiting for triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {emergencyGuides.map((guide, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
            >
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                  {guide.urgency}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{guide.title}</h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                {guide.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Same-Day Booking CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Need an Emergency Assessment Slot Today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          We reserve emergency time slots every morning and afternoon. Book online or call reception directly for immediate triage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${settings.emergencyPhone}`}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors"
          >
            Call {settings.emergencyPhone}
          </a>
          <button
            onClick={() => startBooking('srv-emergency')}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors"
          >
            Book Emergency Assessment Online
          </button>
        </div>
      </div>
    </div>
  );
};
