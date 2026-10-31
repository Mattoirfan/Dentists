import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  User,
  ChevronRight,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface ServiceDetailProps {
  slug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailProps> = ({ slug }) => {
  const { services, dentists, navigate, startBooking } = useClinic();

  const service = services.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Treatment Not Found</h2>
        <p className="text-slate-600 mt-2 text-sm">
          The requested dental treatment could not be located in our directory.
        </p>
        <button
          onClick={() => navigate('/services')}
          className="mt-6 bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
        >
          Browse All Treatments →
        </button>
      </div>
    );
  }

  // Find dentists assigned to this service
  const assignedDentists = dentists.filter(
    (d) => d.activeStatus && d.assignedServiceIds.includes(service.id)
  );

  // Related services in the same category
  const relatedServices = services
    .filter((s) => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Breadcrumbs */}
      <div className="bg-slate-100/60 border-b border-slate-200/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-slate-900">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/services')} className="hover:text-slate-900">
            Treatments
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{service.name}</span>
        </div>
      </div>

      {/* 2. Treatment Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
              <span>{service.category.replace('-', ' ')}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Luma Dental Studio</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              {service.fullDescription}
            </p>

            {/* Price & Duration Strip */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Indicative Investment:</div>
                <div className="text-lg font-bold text-slate-900">{service.indicativePrice}</div>
                {service.priceNote && (
                  <div className="text-[11px] text-teal-800 font-medium">{service.priceNote}</div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-teal-200/50">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Estimated Duration: {service.durationMinutes} mins</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => startBooking(service.id)}
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Treatment</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm py-3 px-5 rounded-xl transition-colors"
              >
                Ask a Question First
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-white bg-slate-100 aspect-[4/3]">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Indications, Expectations, and Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Why Recommend Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Common Reasons for Assessment</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.reasonsForAssessment.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: What to Expect During Care */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">What to Expect During Care</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.whatToExpect.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Professional Aftercare */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Professional Aftercare Guidance</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.aftercare.map((care, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{care}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Clinicians Delivering this Treatment */}
      {assignedDentists.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Qualified Practitioners
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Clinicians Providing {service.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedDentists.map((dentist) => (
              <div
                key={dentist.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 group"
              >
                <img
                  src={dentist.profileImage}
                  alt={dentist.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-teal-700">
                    {dentist.name}
                  </h3>
                  <div className="text-xs text-teal-700 truncate">{dentist.specialization}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{dentist.experienceYears}+ years exp</div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => startBooking(service.id, dentist.id)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Book with Clinician
                    </button>
                    <button
                      onClick={() => navigate(`/dentists/${dentist.slug}`)}
                      className="text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                    >
                      Profile →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Frequently Asked Questions */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions About {service.name}
            </h2>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="text-teal-700 font-mono">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 pl-5 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Related Services */}
      {relatedServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Related Treatments</h2>
            <button
              onClick={() => navigate('/services')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Browse all treatments →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((related) => (
              <div
                key={related.id}
                onClick={() => navigate(`/services/${related.slug}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                  {related.category.replace('-', ' ')}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                  {related.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{related.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-900">{related.indicativePrice}</span>
                  <span className="text-teal-700 font-semibold group-hover:translate-x-1 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Bottom Appointment CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to Schedule Your {service.name}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Choose a date and time that fits your schedule. All bookings receive instant digital confirmation and appointment reminders.
          </p>
          <div className="pt-2">
            <button
              onClick={() => startBooking(service.id)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow transition-all inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Select Date & Time Slot</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
