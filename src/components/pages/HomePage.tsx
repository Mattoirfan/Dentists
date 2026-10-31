import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  Users,
  Award,
  Smile,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { initialClinicFacilities } from '../../data/initialData';

export const HomePage: React.FC = () => {
  const { services, dentists, settings, navigate, startBooking, setIsSmileQuizOpen } = useClinic();

  // Quick book strip state
  const [quickService, setQuickService] = useState('srv-exam');
  const [quickDentist, setQuickDentist] = useState('any');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredServices = services.filter((s) => s.popular).slice(0, 6);

  const homeFaqs = [
    {
      q: 'What should I expect during my first visit to Luma Dental Studio?',
      a: 'Your initial 45-minute comprehensive visit is entirely unhurried. We start by discussing your dental history, comfort preferences, and any smile goals. We then capture high-resolution digital intraoral photographs, low-dose digital diagnostics, and an optical 3D scan of your teeth. Your dentist will walk you through the digital scan on an HD monitor and provide a transparent, itemized health roadmap.',
    },
    {
      q: 'Do you accept dental insurance or provide itemized claim forms?',
      a: 'Yes. We accept and directly process claims with all major PPO dental insurance networks. Prior to beginning any recommended treatment, we check your real-time insurance benefits and provide a printed estimate of estimated coverage and any patient portion.',
    },
    {
      q: 'I experience high dental anxiety. How do you accommodate nervous patients?',
      a: 'We specialize in gentle, patient-paced dental care. You remain in complete control—you can raise a hand at any time to pause. We provide noise-cancelling Bose headphones with Spotify/podcasts, ceiling-mounted screens, gentle topical numbing gels, warm aromatherapy towels, and optional conscious oral relaxation protocols.',
    },
    {
      q: 'What is your appointment cancellation and rescheduling policy?',
      a: 'We respect your schedule and ask that you notify us at least 24 hours in advance if you need to reschedule or cancel your visit. This allows us to offer the reserved clinical time to another patient in urgent need.',
    },
    {
      q: 'Do you offer same-day emergency appointments?',
      a: 'Yes. We reserve dedicated emergency slots every single day for acute toothaches, chipped teeth, knocked-out teeth, or broken restorations. Call our urgent emergency phone number directly for prompt triage.',
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 pb-16 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet unboxed text kicker per zero-pill discipline */}
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
                <span>Award-Winning Dental Practice</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>San Francisco, CA</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>Accredited Specialists</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Healthier Smile <br />
                <span className="text-teal-700">Starts Here.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Experience gentle, patient-centered dentistry in a calm, modern studio.
                From proactive preventative checkups to clear aligner orthodontics and handcrafted porcelain smile design—delivered by verified specialists with zero judgment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => startBooking()}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base py-3.5 px-7 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-center"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Appointment</span>
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-semibold text-base py-3.5 px-6 rounded-xl transition-all hover:bg-slate-50 flex items-center justify-center gap-2 text-center"
                >
                  <span>Explore Our Treatments</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-slate-900">4.9 / 5.0</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>500+ Verified Reviews</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span>Digital 3D Scans</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Same-Day</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span>Emergency Relief</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative soft glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-teal-200/30 to-teal-100/20 rounded-3xl blur-2xl -z-10" />

                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                    alt="Friendly dentist in modern clinic discussing treatment with smiling patient"
                    className="w-full h-[460px] object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Floating clinical badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Dr. Elena Rostova & Clinical Team</div>
                      <div className="text-[11px] text-teal-700 font-medium mt-0.5">Accepting New Patients This Month</div>
                    </div>
                    <button
                      onClick={() => setIsSmileQuizOpen(true)}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      Smile Match ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Appointment Booking Strip */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              <div className="lg:w-1/4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  1. Treatment Needed
                </label>
                <select
                  value={quickService}
                  onChange={(e) => setQuickService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:w-1/4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  2. Preferred Dentist
                </label>
                <select
                  value={quickDentist}
                  onChange={(e) => setQuickDentist(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
                >
                  <option value="any">First Available Specialist</option>
                  {dentists.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} · {d.specialization.split('&')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:w-1/4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  3. Clinic Notice
                </label>
                <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                  Instant confirmation · No upfront fee
                </div>
              </div>

              <div className="lg:w-1/4 pt-2 lg:pt-0">
                <label className="hidden lg:block text-xs font-semibold text-transparent uppercase tracking-wider mb-1.5">
                  Action
                </label>
                <button
                  onClick={() => startBooking(quickService, quickDentist)}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Real-Time Slots</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRACTICE VALUES / PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verified Clinical Mastery</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              All treatments delivered by fully registered specialists with certified postgraduate degrees from world-class dental institutions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Impression Goop</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              High-resolution 3D optical cameras capture full digital impressions in 60 seconds with millimeter precision and zero gag reflex.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Gentle Anxiety-Free Care</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Aromatherapy, ceiling entertainment screens, noise-cancelling headphones, and clinician-guided pacing to ensure you feel calm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-teal-200 transition-all">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparent Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              No hidden fees or unexpected surcharges. We provide clear, itemized written estimates and check insurance benefits prior to care.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED DENTAL SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Personalized Dental Care
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Treatments & Services
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              From conservative routine hygiene to complex smile transformations, our clinic provides complete, technologically advanced oral healthcare.
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 shrink-0"
          >
            <span>View All 16 Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
                  {service.durationMinutes} mins
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                    {service.category.replace('-', ' ')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Indicative Fee:</span>
                    <span className="font-bold text-slate-900">{service.indicativePrice}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/services/${service.slug}`)}
                    className="flex-1 text-center py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => startBooking(service.id)}
                    className="flex-1 text-center py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Real Clinical Transformations
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Smile Rejuvenation Showcase
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Slide to observe the subtle, natural refinement achieved through minimally invasive aligner alignment and porcelain aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <BeforeAfterSlider
              title="Clear Aligner & Enamel Brightening"
              subtitle="Correction of anterior crowding, midline leveling, and 6-shade LED whitening."
              beforeImage="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80"
              beforeLabel="Initial Assessment"
              afterLabel="Completed (8 Months)"
            />

            <BeforeAfterSlider
              title="Handcrafted Ultra-Thin Porcelain Veneers"
              subtitle="Restoration of worn incisal edges, micro-cracks, and natural shade uniformity."
              beforeImage="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
              beforeLabel="Pre-Treatment"
              afterLabel="Completed Smile Design"
            />
          </div>
        </div>
      </section>

      {/* 5. CLINIC TEAM PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Accredited Specialists
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet Our Clinical Team
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Our clinicians combine advanced university hospital credentials, decades of cumulative experience, and an approachable, patient-first philosophy.
            </p>
          </div>
          <button
            onClick={() => navigate('/dentists')}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 shrink-0"
          >
            <span>View Full Clinician Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                  <img
                    src={dentist.profileImage}
                    alt={dentist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {dentist.experienceYears}+ Yrs Clinical Care
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                    {dentist.name}
                  </h3>
                  <div className="text-xs text-teal-700 font-medium mt-0.5">
                    {dentist.specialization}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {dentist.registrationNumber}
                  </div>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
                    {dentist.biography}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => startBooking(undefined, dentist.id)}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Book with {dentist.name.split(' ')[1]}
                </button>
                <button
                  onClick={() => navigate(`/dentists/${dentist.slug}`)}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Full Bio & Credentials →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PATIENT JOURNEY: WHAT TO EXPECT */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
            Stress-Free Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What to Expect on Your First Visit
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No rush, no surprise fees, and no lectures. Here is how your appointment unfolds from the moment you walk through our doors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              01
            </div>
            <h3 className="text-base font-bold text-white">Warm Welcome & Refreshments</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step into our lounge, enjoy herbal tea or sparkling water, and fill out our simple digital intake form on an iPad.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              02
            </div>
            <h3 className="text-base font-bold text-white">3D Optical Digital Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We capture precise 3D scans and digital photographs without messy putty or discomfort so you see what your clinician sees.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              03
            </div>
            <h3 className="text-base font-bold text-white">Unhurried Consultation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your dentist reviews the findings on an HD display, explains treatment alternatives, and answers every question with total clarity.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              04
            </div>
            <h3 className="text-base font-bold text-white">Transparent Treatment Plan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a printed and emailed breakdown with clear timelines, insurance estimates, and guaranteed price validity.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CLINIC FACILITIES & VERIFIED TECHNOLOGY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
            Safety & Innovation
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Advanced Clinical Technology
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            We invest in certified medical technology to minimize discomfort, reduce radiation exposure, and maximize diagnostic accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialClinicFacilities.map((facility, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{facility.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{facility.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-700 font-medium">
                Verified Medical Standard ✓
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. PATIENT TESTIMONIALS */}
      <section className="bg-slate-50/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              Patient Experiences
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Trusted by Hundreds of Happy Smiles
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-[11px] italic">
              *Demonstration patient feedback reflecting real clinical standards and protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Sophie M.',
                treatment: 'Clear Aligners & Whitening',
                text: 'Dr. Marcus Vance mapped out my aligner treatment with such precision. 9 months later, my teeth are straight and bright. The clinic feels like a boutique spa!',
              },
              {
                name: 'David K.',
                treatment: 'Porcelain Veneers',
                text: 'Dr. Elena Rostova is a true artist. She created a mock-up of my smile beforehand so I knew exactly what to expect. They look completely natural.',
              },
              {
                name: 'Rachel P.',
                treatment: 'Dental Implant & Crown',
                text: 'As someone who gets terrified by dental procedures, Dr. Aisha Patel put all my fears to rest. The 3D guided implant procedure was fast and healed with zero pain.',
              },
              {
                name: 'Liam T.',
                treatment: 'Routine Hygiene & Checkup',
                text: 'Easily the most comprehensive checkup I have ever had. The intraoral photos allowed me to actually see what the dentist was explaining. Spotless clinic.',
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{testi.text}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{testi.name}</div>
                    <div className="text-[10px] text-teal-700">{testi.treatment}</div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
            Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Frequently Asked Patient Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Answers to common questions regarding our clinic, insurance, appointments, and procedures.
          </p>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-teal-700"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-teal-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. LOCATION, HOURS & TRANSIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Visit Our Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Convenient Downtown Location
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Situated in the historic 450 Sutter Health Building, with convenient valet parking and adjacent BART/Muni subway connections.
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  {settings.address.street}, {settings.address.suite}, {settings.address.city}, {settings.address.state} {settings.address.zip}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Monday – Friday: 8:00 AM – 6:30 PM · Saturday: 9:00 AM – 3:00 PM</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                Directions & Transit Info →
              </button>
              <button
                onClick={() => startBooking()}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-100 rounded-2xl overflow-hidden aspect-[16/9] relative border border-slate-200">
            {/* Visual interactive map illustration */}
            <div className="absolute inset-0 bg-[#e5ebee] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-lg text-teal-700 flex items-center justify-center mb-3 animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="font-bold text-slate-900 text-sm">450 Sutter Health Suite 1200</div>
              <div className="text-xs text-slate-500 mt-1">San Francisco, CA 94108</div>
              <div className="mt-3 text-[11px] bg-white/90 px-3 py-1.5 rounded-full text-slate-700 font-medium shadow-sm">
                Near Union Square BART / Powell St Station
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL APPOINTMENT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready for a Comfortable, Healthy Smile?
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Book your comprehensive examination and digital 3D scan online in under 2 minutes. No upfront charge, transparent estimates, and same-week availability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => startBooking()}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-teal-900 font-bold text-sm py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Book an Appointment Online</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto border border-teal-300/40 hover:bg-white/10 text-white font-medium text-sm py-3.5 px-6 rounded-xl transition-all"
              >
                Contact Our Reception
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
