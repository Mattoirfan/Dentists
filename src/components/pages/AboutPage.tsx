import React from 'react';
import {
  ShieldCheck,
  Award,
  Heart,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Users,
  Building,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const AboutPage: React.FC = () => {
  const { startBooking, navigate, dentists } = useClinic();

  const clinicPhotos = [
    {
      title: 'Warm Reception & Patient Lounge',
      desc: 'Designed with calming neutral tones, organic textures, and zero clinical odor.',
      img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Ergonomic Treatment Suites',
      desc: 'Equipped with memory-foam upholstery, ceiling entertainment displays, and warm lighting.',
      img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: '3D Volumetric Digital Imaging Bay',
      desc: 'Sub-millimeter cone-beam scanning for precise implant and bone architecture analysis.',
      img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. Hero */}
      <section className="bg-gradient-to-b from-teal-50/50 via-white to-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              About Luma Dental Studio
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Redefining the Dental Experience with Warmth & Precision
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Founded on the belief that visits to the dentist should feel unhurried, gentle, and transparent. We combine hospital-grade clinical precision with boutique comfort.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Philosophy & Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Our Clinical Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Conservative, Minimally Invasive & Biomimetic
            </h2>
            <div className="prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                Too often, traditional dentistry relies on aggressive drilling that removes irreplaceable healthy enamel. At Luma Dental Studio, our clinical team practices biomimetic and minimally invasive dentistry.
              </p>
              <p>
                We prioritize preserving your natural tooth structure whenever possible. Using advanced nano-composite bonding, ultra-thin ceramic restorations, and digital 3D planning, we restore the natural strength, elasticity, and radiance of your teeth without overtreatment.
              </p>
              <p>
                Every treatment proposal is explained in plain, reassuring English. You are always an active partner in your oral healthcare decisions.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 mt-1">Preservation-First Focus</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">Zero</div>
                <div className="text-xs text-slate-500 mt-1">Judgment or Shaming</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-white aspect-[4/3] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1000&q=80"
                alt="Modern dental surgery with advanced digital screens"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interior & Facilities Showcase */}
      <section className="bg-slate-50/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Sanctuary of Comfort
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tour Our Clinic Interior
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every detail of our practice was architected to eliminate anxiety, reduce clinical stress, and promote patient serenity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinicPhotos.map((photo, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={photo.img}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{photo.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{photo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Verified Clinician Credentials Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                Clinical Registrations & Accreditation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ethical Healthcare Governance
              </h2>
            </div>
            <button
              onClick={() => navigate('/dentists')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shrink-0"
            >
              Meet All {dentists.length} Clinicians →
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Luma Dental Studio operates under rigorous regulatory standards. All our dental surgeons hold active unrestricted dental board licenses, maintain comprehensive professional indemnity cover, and complete a minimum of 50 hours of accredited continuing medical education (CME) annually.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold">ADA & BACD</strong>
              <span className="text-slate-500 text-[11px]">Accredited Member</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold">Invisalign Diamond</strong>
              <span className="text-slate-500 text-[11px]">Apex Provider Status</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold">OSHA & CDC</strong>
              <span className="text-slate-500 text-[11px]">Sterilization Protocol</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold">ITI Fellow</strong>
              <span className="text-slate-500 text-[11px]">Implantology Standards</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Experience the Luma Difference
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Schedule your first comprehensive consultation and discover how comfortable modern dentistry can be.
          </p>
          <div className="pt-2">
            <button
              onClick={() => startBooking()}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow transition-all"
            >
              Book an Appointment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
