import React from 'react';
import { ShieldCheck, Award, Calendar, Languages, Clock, ArrowRight } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const DentistsPage: React.FC = () => {
  const { dentists, navigate, startBooking } = useClinic();

  const activeDentists = dentists.filter((d) => d.activeStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Verified Clinical Team
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Our Dentists & Specialists
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Every clinician at Luma Dental Studio holds accredited postgraduate qualifications, maintains active registration, and shares our calm, patient-centered approach.
        </p>
      </div>

      {/* Dentist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {activeDentists.map((dentist) => (
          <div
            key={dentist.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group"
          >
            <div className="sm:w-2/5 aspect-[4/5] sm:aspect-auto relative bg-slate-100 overflow-hidden">
              <img
                src={dentist.profileImage}
                alt={dentist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded">
                {dentist.experienceYears}+ Yrs Care
              </div>
            </div>

            <div className="sm:w-3/5 p-6 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-0.5">
                  {dentist.specialization}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {dentist.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  {dentist.title}
                </div>

                <div className="mt-3 text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-600">Verified Registration: </span>
                  <span>{dentist.registrationNumber}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {dentist.biography}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Languages className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Languages: {dentist.languages.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => navigate(`/dentists/${dentist.slug}`)}
                  className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Full Profile →
                </button>
                <button
                  onClick={() => startBooking(undefined, dentist.id)}
                  className="flex-1 py-2 text-center text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors"
                >
                  Book with Clinician
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Standards Pillar */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Our Clinical Commitment to You
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We never prescribe unnecessary treatment or rush through examinations. Every treatment plan is backed by digital 3D scans, itemized cost transparency, and continuous aftercare support.
          </p>
          <div className="pt-2">
            <button
              onClick={() => startBooking()}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all"
            >
              Book an Appointment with Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
