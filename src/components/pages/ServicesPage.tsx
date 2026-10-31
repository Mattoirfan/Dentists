import React, { useState } from 'react';
import { Search, Sparkles, Clock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { ServiceCategory } from '../../types/dental';

export const ServicesPage: React.FC = () => {
  const { services, navigate, startBooking, setIsSmileQuizOpen } = useClinic();

  // Read URL query parameter if present, e.g. /services?cat=cosmetic
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialCat = (urlParams?.get('cat') as ServiceCategory | 'all') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>(initialCat);
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Treatments' },
    { id: 'preventive', label: 'Preventive & Checkups' },
    { id: 'cosmetic', label: 'Cosmetic & Veneers' },
    { id: 'orthodontics', label: 'Invisalign & Ortho' },
    { id: 'implants', label: 'Dental Implants' },
    { id: 'restorative', label: 'Restorative & Crowns' },
    { id: 'gum-care', label: 'Periodontics & Gum Care' },
    { id: 'pediatric', label: 'Pediatric Care' },
    { id: 'oral-surgery', label: 'Oral Surgery & Wisdom' },
  ];

  const filteredServices = services.filter((s) => {
    if (!s.activeStatus) return false;
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchDesc = s.shortDescription.toLowerCase().includes(q);
      const matchBen = s.benefits.some((b) => b.toLowerCase().includes(q));
      return matchName || matchDesc || matchBen;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Comprehensive Clinical Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Dental Treatments & Services
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From preventive hygiene and digital examinations to complex smile restorations, clear aligner orthodontics, and 3D guided implant surgery.
        </p>
      </div>

      {/* Interactive Smile Match Quiz Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Unsure which treatment is right for you?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Answer 3 brief questions to view tailored recommendations with transparent timeframes and costs.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSmileQuizOpen(true)}
          className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
        >
          Take Smile Assessment →
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search treatments (e.g. veneers, whitening, implants)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No treatments found matching your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="mt-3 text-xs text-teal-700 font-semibold hover:underline"
          >
            Clear filters and show all treatments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-600" />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider mb-1">
                    {service.category.replace('-', ' ')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    {service.benefits.slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Indicative Fee:</span>
                    <span className="font-bold text-slate-900">{service.indicativePrice}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => navigate(`/services/${service.slug}`)}
                  className="flex-1 text-center py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Full Details →
                </button>
                <button
                  onClick={() => startBooking(service.id)}
                  className="flex-1 text-center py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-6 text-xs text-slate-600 border border-slate-200 leading-relaxed">
        <h4 className="font-bold text-slate-900 mb-1">Important Treatment & Fee Information:</h4>
        <p>
          Treatment descriptions represent standard clinical procedures at Luma Dental Studio. Suitability for any dental treatment, duration, and final fees are determined solely by an in-person clinical examination and diagnostic review with your dentist. All clinical treatments are provided by registered dental practitioners.
        </p>
      </div>
    </div>
  );
};
