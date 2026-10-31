import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const SmileAssessmentModal: React.FC = () => {
  const { isSmileQuizOpen, setIsSmileQuizOpen, startBooking, services } = useClinic();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');

  if (!isSmileQuizOpen) return null;

  const handleClose = () => {
    setIsSmileQuizOpen(false);
    setStep(1);
    setGoal('');
    setSensitivity('');
    setTimeline('');
  };

  const getRecommendedServices = () => {
    if (goal === 'align') {
      return services.filter((s) => s.slug === 'clear-aligner-therapy' || s.slug === 'hygiene-and-scaling');
    }
    if (goal === 'whiten') {
      return services.filter((s) => s.slug === 'professional-teeth-whitening' || s.slug === 'comprehensive-examination');
    }
    if (goal === 'repair') {
      return services.filter((s) => s.slug === 'porcelain-veneers' || s.slug === 'cosmetic-composite-bonding');
    }
    if (goal === 'missing') {
      return services.filter((s) => s.slug === 'dental-implants' || s.slug === 'ceramic-crowns-and-bridges');
    }
    return services.filter((s) => s.slug === 'comprehensive-examination' || s.slug === 'hygiene-and-scaling');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step < 4 ? (
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Smile Assessment · Step {step} of 3</span>
            </div>

            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  What is your primary smile or dental goal?
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Select the focus area that matters most to you right now.
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'checkup', title: 'Routine Health & Comprehensive Checkup', desc: 'Maintain clean, healthy teeth and check for any early issues.' },
                    { id: 'align', title: 'Discreet Tooth Straightening (Aligners)', desc: 'Fix crowding, overlapping teeth, or gaps with invisible trays.' },
                    { id: 'whiten', title: 'Professional Teeth Brightening', desc: 'Lift stubborn stains and achieve an evenly luminous, whiter shade.' },
                    { id: 'repair', title: 'Repair Chipped, Worn, or Uneven Teeth', desc: 'Porcelain veneers or artistic composite bonding for symmetry.' },
                    { id: 'missing', title: 'Replace Missing Teeth (Implants)', desc: 'Permanent, immovable teeth that function just like natural roots.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGoal(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start justify-between ${
                        goal === opt.id
                          ? 'border-teal-600 bg-teal-50/70 text-slate-900 font-medium'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{opt.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                      {goal === opt.id && <Check className="w-4 h-4 text-teal-600 shrink-0 mt-1 ml-2" />}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!goal}
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Have you noticed any discomfort or sensitivity?
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  This helps our clinical team tailor the gentleness of your first session.
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'none', title: 'No pain or discomfort', desc: 'My teeth feel generally fine; this is primarily for aesthetics or checkup.' },
                    { id: 'sensitivity', title: 'Sensitivity to cold, hot, or sweets', desc: 'Occasional brief twinges when drinking cold liquids.' },
                    { id: 'bleeding', title: 'Bleeding gums when flossing or brushing', desc: 'Occasional redness, puffiness, or bleeding.' },
                    { id: 'anxiety', title: 'Dental nervousness or phobia', desc: 'I feel anxious in dental clinics and prefer extra gentle pacing.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSensitivity(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start justify-between ${
                        sensitivity === opt.id
                          ? 'border-teal-600 bg-teal-50/70 text-slate-900 font-medium'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{opt.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                      {sensitivity === opt.id && <Check className="w-4 h-4 text-teal-600 shrink-0 mt-1 ml-2" />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    disabled={!sensitivity}
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  When would you ideally like to begin?
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  We offer flexible daytime, evening, and Saturday appointments.
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'asap', title: 'As soon as possible / Within a few days' },
                    { id: 'two-weeks', title: 'Within the next 2–3 weeks' },
                    { id: 'next-month', title: 'Next month or preparing for an upcoming event' },
                    { id: 'exploring', title: 'Just exploring options and gathering information' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTimeline(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                        timeline === opt.id
                          ? 'border-teal-600 bg-teal-50/70 text-slate-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{opt.title}</span>
                      {timeline === opt.id && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    disabled={!timeline}
                    onClick={() => setStep(4)}
                    className="w-2/3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>View Recommendations</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Your Tailored Treatment Path</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Based on your preferences, our clinical team recommends starting with these suitable options:
              </p>
            </div>

            <div className="space-y-3 my-5 max-h-60 overflow-y-auto pr-1">
              {getRecommendedServices().map((serv) => (
                <div key={serv.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{serv.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{serv.shortDescription}</p>
                    <div className="mt-2 text-xs font-medium text-teal-800">
                      Indicative: {serv.indicativePrice} · {serv.durationMinutes} mins
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      startBooking(serv.id);
                    }}
                    className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Book This
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Complimentary 3D digital scan included with all initial consultations.</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="w-1/2 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl hover:bg-slate-50 text-xs"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  const recs = getRecommendedServices();
                  handleClose();
                  startBooking(recs[0]?.id);
                }}
                className="w-1/2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-2.5 rounded-xl transition-all text-xs"
              >
                Schedule First Available →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
