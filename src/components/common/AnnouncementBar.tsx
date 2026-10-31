import React from 'react';
import { Phone, Clock, MapPin, AlertCircle, X } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const AnnouncementBar: React.FC = () => {
  const { settings, navigate } = useClinic();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || !settings.showAnnouncement) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 font-medium text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            {settings.announcementText}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            Mon–Fri 8am–6:30pm · Sat 9am–3pm
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <a
            href={`tel:${settings.emergencyPhone}`}
            className="flex items-center gap-1 text-rose-300 hover:text-rose-200 font-medium transition-colors"
            title="Urgent Dental Emergency Line"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Emergency: {settings.emergencyPhone}
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            {settings.phone}
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
