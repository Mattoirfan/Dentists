import React from 'react';
import {
  Calendar,
  Languages,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface DentistDetailProps {
  slug: string;
}

export const DentistDetailPage: React.FC<DentistDetailProps> = ({ slug }) => {
  const { dentists, services, navigate, startBooking } = useClinic();

  const dentist = dentists.find((d) => d.slug === slug || d.id === slug);

  if (!dentist) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Clinician Not Found</h2>
        <p className="text-slate-600 mt-2 text-sm">
          The requested dentist profile could not be located.
        </p>
        <button
          onClick={() => navigate('/dentists')}
          className="mt-6 bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
        >
          View All Clinicians →
        </button>
      </div>
    );
  }

  const assignedServices = services.filter((s) => dentist.assignedServiceIds.includes(s.id));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const workingDaysText = dentist.workingDays.map((d) => dayNames[d]).join(', ');

  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumbs */}
      <div className="bg-slate-100/60 border-b border-slate-200/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-slate-900">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/dentists')} className="hover:text-slate-900">
            Dentists
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{dentist.name}</span>
        </div>
      </div>

      {/* Main Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Photo & Quick Schedule Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="aspect-[4/5] bg-slate-100 relative">
                <img
                  src={dentist.profileImage}
                  alt={dentist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{dentist.name}</h3>
                  <div className="text-xs text-teal-700 font-medium">{dentist.specialization}</div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      Clinic Days: <strong>{workingDaysText}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Languages: {dentist.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{dentist.experienceYears}+ Years Clinical Experience</span>
                  </div>
                </div>

                <button
                  onClick={() => startBooking(undefined, dentist.id)}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book with {dentist.name}</span>
                </button>
              </div>
            </div>

            {/* Official Registration Verification Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileCheck className="w-4 h-4 text-teal-700" />
                <span>Verified Professional Credentials</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Registered with the California State Dental Board & ADA. Active credential verification reference:
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-800">
                {dentist.registrationNumber}
              </div>
            </div>
          </div>

          {/* Right Column: Full Biography, Qualifications, Assigned Services */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                Clinician Biography
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{dentist.name}</h1>
              <div className="text-sm text-slate-500 font-medium mb-6">{dentist.title}</div>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
                <p>{dentist.fullBiography}</p>
              </div>
            </div>

            {/* Qualifications & Degrees */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-700" />
                <span>Verified Education & Professional Memberships</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {dentist.verifiedQualifications}
              </p>
            </div>

            {/* Areas of Clinical Interest */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Areas of Clinical Specialization
              </h3>
              <div className="flex flex-wrap gap-2">
                {dentist.areasOfInterest.map((interest, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Treatments Offered by this Clinician */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Treatments Provided by {dentist.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assignedServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{service.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {service.shortDescription}
                      </p>
                      <div className="mt-2 text-xs font-semibold text-teal-800">
                        {service.indicativePrice} · {service.durationMinutes} min
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/services/${service.slug}`)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        Details →
                      </button>
                      <button
                        onClick={() => startBooking(service.id, dentist.id)}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
