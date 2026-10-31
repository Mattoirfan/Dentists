import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Footer: React.FC = () => {
  const { settings, navigate } = useClinic();

  const handleLink = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgent Emergency Callout Bar */}
        <div className="mb-12 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Experiencing a Dental Emergency?</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Severe toothache, dental trauma, knocked-out tooth, or facial swelling? Call our urgent care team directly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${settings.emergencyPhone}`}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Emergency Line: {settings.emergencyPhone}</span>
            </a>
            <button
              onClick={() => handleLink('/emergency')}
              className="text-xs text-slate-300 hover:text-white underline underline-offset-4 py-2 px-3"
            >
              Emergency Triage Guide →
            </button>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleLink('/')}
              className="text-left focus:outline-none"
              aria-label="Luma Dental Studio Home"
            >
              <img
                src="/brand/logo-white.svg"
                alt="Luma Dental Studio"
                className="h-10 w-auto"
              />
            </button>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Luma Dental Studio is an award-winning center for comprehensive oral health, minimally invasive cosmetic dentistry, clear aligners, and precision dental implants. Designed for patient comfort and natural outcomes.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address.street}, {settings.address.suite}, {settings.address.city}, {settings.address.state} {settings.address.zip}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Treatments */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleLink('/services/comprehensive-examination')} className="hover:text-teal-400 transition-colors">
                  Comprehensive Checkup
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/hygiene-and-scaling')} className="hover:text-teal-400 transition-colors">
                  Professional Hygiene
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/professional-teeth-whitening')} className="hover:text-teal-400 transition-colors">
                  Teeth Whitening
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/porcelain-veneers')} className="hover:text-teal-400 transition-colors">
                  Porcelain Veneers
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/clear-aligner-therapy')} className="hover:text-teal-400 transition-colors">
                  Invisalign Clear Aligners
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/dental-implants')} className="hover:text-teal-400 transition-colors">
                  3D Guided Dental Implants
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services/root-canal-therapy')} className="hover:text-teal-400 transition-colors">
                  Gentle Root Canal Therapy
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/services')} className="text-teal-400 hover:text-teal-300 font-medium">
                  View All Services →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Patients & Clinic */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Practice & Patients
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleLink('/about')} className="hover:text-teal-400 transition-colors">
                  About Our Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/dentists')} className="hover:text-teal-400 transition-colors">
                  Clinical Team & Specialists
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/patient-information')} className="hover:text-teal-400 transition-colors">
                  First Visit Guidance
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/pricing')} className="hover:text-teal-400 transition-colors">
                  Fees & Financing Options
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/patient-portal')} className="hover:text-teal-400 transition-colors">
                  Patient Portal (My Booking)
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/contact')} className="hover:text-teal-400 transition-colors">
                  Hours & Directions
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/admin')} className="text-slate-500 hover:text-slate-400">
                  Staff Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening Hours */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Opening Hours
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="block font-medium text-slate-300">Mon – Fri</span>
                <span>8:00 AM – 6:30 PM</span>
              </div>
              <div>
                <span className="block font-medium text-slate-300">Saturday</span>
                <span>9:00 AM – 3:00 PM</span>
              </div>
              <div>
                <span className="block font-medium text-slate-300">Sunday</span>
                <span className="text-slate-500">Emergency On-Call Only</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2">Practice Accreditations:</span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                <span className="bg-slate-800 px-2 py-1 rounded">ADA Member</span>
                <span className="bg-slate-800 px-2 py-1 rounded">AACD Sustaining</span>
                <span className="bg-slate-800 px-2 py-1 rounded">GDC Standards</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Invisalign Diamond</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="max-w-2xl text-[11px] leading-relaxed">
            <p>
              <strong className="text-slate-400">Medical & Dental Notice:</strong> All clinical information provided on this website is for educational reference and does not constitute formal medical diagnosis or treatment plans. Dental treatments require comprehensive in-person evaluation by a qualified and registered dental surgeon.
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} Luma Dental Studio. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 text-xs">
            <button onClick={() => handleLink('/privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleLink('/terms')} className="hover:text-slate-300 transition-colors">
              Terms of Use
            </button>
            <button onClick={() => handleLink('/cancellation-policy')} className="hover:text-slate-300 transition-colors">
              Cancellation Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
