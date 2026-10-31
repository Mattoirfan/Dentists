import React from 'react';
import { ShieldCheck, Clock, FileText, ArrowLeft } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useClinic();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div>
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
          Legal & Compliance
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Patient Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-600">
        <h3 className="text-base font-bold text-slate-900">1. Commitment to Patient Health Data Privacy</h3>
        <p>
          Luma Dental Studio ("we", "our", or "the Clinic") is committed to safeguarding the personal health information and privacy of our patients in accordance with applicable healthcare privacy regulations, including HIPAA (Health Insurance Portability and Accountability Act), state dental board requirements, and international privacy standards.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Collection of Information</h3>
        <p>
          We collect only the minimum personal information necessary to facilitate your dental care and appointment scheduling, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Contact details: name, phone number, and email address for appointment reminders.</li>
          <li>Appointment preferences: desired treatment type, preferred clinician, date, and time.</li>
          <li>Basic medical history and comfort requests provided voluntarily during intake.</li>
          <li>Dental insurance information provided strictly for direct claim processing.</li>
        </ul>

        <h3 className="text-base font-bold text-slate-900">3. Non-Disclosure & Security</h3>
        <p>
          We do not sell, rent, or trade patient personal information to third-party advertisers or data brokers under any circumstances. Access to patient records is strictly restricted to authorized dental clinicians and administrative staff involved in your direct clinical care.
        </p>

        <h3 className="text-base font-bold text-slate-900">4. Retention and Deletion</h3>
        <p>
          Patient records are retained in compliance with statutory dental record retention laws. You have the right to request access to or a copy of your clinical records and radiographs at any time.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { navigate } = useClinic();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div>
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
          Terms of Service
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Website Use</h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-600">
        <h3 className="text-base font-bold text-slate-900">1. Medical Disclaimer</h3>
        <p>
          The content published on this website, including articles, treatment guides, price estimates, and FAQs, is provided solely for educational and informational purposes. It does not establish a doctor-patient relationship and should never be used as a substitute for professional clinical diagnosis or evaluation by a licensed dental practitioner.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Appointment Scheduling</h3>
        <p>
          Online appointment reservations are subject to clinical review and confirmation. While we strive to maintain real-time calendar availability, unforeseen clinical emergencies may necessitate minor schedule adjustments, for which our reception will contact you immediately.
        </p>

        <h3 className="text-base font-bold text-slate-900">3. Fee Estimates</h3>
        <p>
          Prices listed on the website represent standard indicative ranges. Every individual's oral anatomy is unique; a firm treatment quote is provided following diagnostic imaging and in-person consultation with your dentist.
        </p>
      </div>
    </div>
  );
};

export const CancellationPolicyPage: React.FC = () => {
  const { navigate, startBooking } = useClinic();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/')}
        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div>
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
          Clinic Policy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Appointment & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">Effective October 2026</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-600">
        <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-teal-700 shrink-0" />
          <div className="font-medium text-teal-900 text-xs sm:text-sm">
            We require a minimum of <strong>24 hours' notice</strong> for appointment cancellations or rescheduling.
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900">Why We Maintain This Policy</h3>
        <p>
          When you book an appointment at Luma Dental Studio, our clinical team reserves the private surgery suite, sterilizes specialized instruments, and allocates uninterrupted time with your dentist and dental nurse.
        </p>
        <p>
          When patients cancel at the last minute or fail to arrive, patients with acute toothaches who are waiting for emergency care cannot be accommodated.
        </p>

        <h3 className="text-base font-bold text-slate-900">How to Reschedule or Cancel</h3>
        <p>
          You can effortlessly reschedule or cancel your visit by:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Logging into our online <strong>Patient Portal</strong> using your booking reference.</li>
          <li>Calling our reception desk directly at our main practice telephone number.</li>
          <li>Replying directly to your SMS or email appointment reminder.</li>
        </ul>

        <div className="pt-4">
          <button
            onClick={() => startBooking()}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all"
          >
            Schedule or Book Appointment →
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { navigate } = useClinic();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-5xl font-extrabold text-teal-700">404</div>
      <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        The page you are looking for does not exist or has been relocated in our practice directory.
      </p>
      <div className="pt-2">
        <button
          onClick={() => navigate('/')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all"
        >
          Return to Clinic Homepage
        </button>
      </div>
    </div>
  );
};
