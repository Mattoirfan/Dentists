import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Calendar,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const PricingPage: React.FC = () => {
  const { services, startBooking, navigate } = useClinic();

  const pricingCategories = [
    {
      category: 'Preventive & Examination',
      items: [
        { name: 'Comprehensive Dental Examination', fee: '$120 - $180', includes: 'Full mouth digital low-dose X-rays, 3D optical scan, periodontal charting, and cancer screening.' },
        { name: 'Routine Hygiene & Ultrasonic Scaling', fee: '$140 - $210', includes: 'Gentle ultrasonic plaque removal, airflow stain polish, and fluoride remineralization.' },
        { name: 'Preventive Fluoride Varnish', fee: '$45 - $65', includes: 'Medical-grade concentrated fluoride varnish application for sensitive or high-risk enamel.' },
      ],
    },
    {
      category: 'Cosmetic Dentistry',
      items: [
        { name: 'Professional LED In-Clinic Whitening', fee: '$450 - $650', includes: '3 x 15-minute cycles of medical peroxide with LED activation plus custom take-home trays.' },
        { name: 'Handcrafted Porcelain Veneers', fee: '$1,200 - $2,200 / tooth', includes: '3D Digital Smile Design mockup, micro-thin ceramic facings by master ceramists.' },
        { name: 'Cosmetic Composite Bonding', fee: '$350 - $650 / tooth', includes: 'Single-visit artistic resin sculpting to repair chips or close small front spaces.' },
      ],
    },
    {
      category: 'Orthodontics & Clear Aligners',
      items: [
        { name: 'Invisalign Clear Aligner Full Course', fee: '$3,200 - $5,800', includes: 'All aligner stages, ClinCheck 3D digital simulation, refinement sets, and initial retainers.' },
        { name: 'Orthodontic Consultation & 3D Scan', fee: '$95 - $150', includes: 'Digital bite evaluation and simulated outcome preview. Credited toward treatment.' },
        { name: 'Vivera Clear Retainers (Set of 3)', fee: '$450', includes: 'Three sets of durable post-treatment clear retainers to protect teeth from shifting.' },
      ],
    },
    {
      category: 'Restorative & Implants',
      items: [
        { name: 'Tooth-Colored Composite Fillings', fee: '$180 - $320', includes: 'BPA-free nano-hybrid composite shade-matched precisely to natural enamel.' },
        { name: 'Precision Ceramic Crown / Bridge Unit', fee: '$950 - $1,650', includes: 'Monolithic zirconia or E.max porcelain crown, 3D digital scan, and temporary crown.' },
        { name: 'Gentle Rotary Root Canal Therapy', fee: '$850 - $1,400', includes: 'Painless rotary canal debridement, antimicrobial sterilization, and biocompatible sealing.' },
        { name: '3D Guided Dental Implant & Crown', fee: '$2,400 - $4,200', includes: 'Cone-Beam 3D surgical guide, titanium implant fixture, custom abutment, and ceramic crown.' },
      ],
    },
    {
      category: 'Oral Surgery & Emergencies',
      items: [
        { name: 'Same-Day Emergency Assessment', fee: '$150 - $220', includes: 'Emergency triage, focused digital X-ray, and immediate pain stabilization treatment.' },
        { name: 'Gentle Tooth Extraction', fee: '$220 - $380', includes: 'Local anaesthesia, atraumatic tooth removal, and post-operative socket dressing.' },
        { name: 'Surgical Wisdom Tooth Removal', fee: '$380 - $650 / tooth', includes: 'Surgical sectioning of impacted wisdom tooth, dissolvable sutures, and recovery kit.' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Fee Guide & Financial Transparency
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Transparent Dental Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          We believe in honest, predictable dentistry without surprise bills. Below is our indicative fee schedule for common dental procedures.
        </p>
      </div>

      {/* Insurance & Financing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Dental Insurance Accepted</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We work with and submit direct claims to all leading PPO insurance providers (Delta Dental, Cigna, MetLife, Aetna, Guardian, and UnitedHealthcare).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Flexible 0% APR Financing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Spread the cost of orthodontic aligners, dental implants, and cosmetic smile makeovers across 6 to 24 interest-free monthly payments.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Printed Treatment Blueprints</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Following your comprehensive checkup, receive an itemized treatment roadmap detailing every procedure, duration, and patient copay.
          </p>
        </div>
      </div>

      {/* Fee Tables */}
      <div className="space-y-10">
        {pricingCategories.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">{group.category}</h2>
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Indicative Range
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.includes}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-sm font-extrabold text-slate-900">{item.fee}</div>
                    <button
                      onClick={() => startBooking()}
                      className="bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors"
                    >
                      Book →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Medical & Quotation Disclaimer */}
      <div className="bg-slate-100 rounded-2xl p-6 text-xs text-slate-600 border border-slate-200 space-y-2 leading-relaxed">
        <h4 className="font-bold text-slate-900">Quotation Notice & Clinical Policy:</h4>
        <p>
          Prices listed above are indicative and subject to clinical examination. Every individual patient has unique oral anatomy, bone density, and health needs. An exact, binding treatment estimate can only be provided after a qualified dentist conducts an in-person clinical assessment and evaluates diagnostic imaging.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Request an Individualized Estimate</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Schedule your comprehensive checkup and 3D digital scan to discuss treatment options and receive your transparent printed estimate.
        </p>
        <div className="pt-2">
          <button
            onClick={() => startBooking()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 px-8 rounded-xl shadow transition-all"
          >
            Book Comprehensive Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
