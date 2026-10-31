import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, TimeSlot } from '../../types/dental';
import { apiFetch } from '../../utils/clientApiBridge';

export const PatientPortalPage: React.FC = () => {
  const { settings, services, dentists, showToast } = useClinic();

  const [bookingRef, setBookingRef] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Reschedule state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlots, setNewSlots] = useState<TimeSlot[]>([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) {
      setSearchError('Please enter your 5-digit Booking Reference (e.g. LDS-94218).');
      return;
    }

    setSearching(true);
    setSearchError(null);
    setAppointment(null);

    try {
      const cleanRef = bookingRef.trim();
      const queryParam = emailOrPhone ? `?emailOrPhone=${encodeURIComponent(emailOrPhone.trim())}` : '';
      const res = await apiFetch(`/api/appointments/${cleanRef}${queryParam}`);

      if (!res.ok) {
        throw new Error('Appointment not found or verification credentials do not match.');
      }

      const data = await res.json();
      setAppointment(data);
    } catch (err: any) {
      setSearchError(err.message || 'Unable to locate appointment.');
    } finally {
      setSearching(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;
    setCancelling(true);
    try {
      const res = await apiFetch(`/api/appointments/${appointment.bookingReference}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason || 'Patient requested cancellation' }),
      });
      if (!res.ok) throw new Error('Cancellation failed');
      const data = await res.json();
      setAppointment(data.appointment);
      setCancelModalOpen(false);
      showToast('Appointment successfully cancelled.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Error cancelling appointment', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const loadRescheduleSlots = async (dateStr: string) => {
    if (!appointment || !dateStr) return;
    setNewDate(dateStr);
    setSlotsLoading(true);
    try {
      const res = await apiFetch(
        `/api/availability?dentistId=${appointment.dentistId}&date=${dateStr}&duration=${appointment.durationMinutes}`
      );
      if (res.ok) {
        const data = await res.json();
        setNewSlots(data.slots || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!appointment || !newDate || !selectedNewSlot) return;
    setRescheduling(true);
    try {
      const res = await apiFetch(`/api/appointments/${appointment.bookingReference}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDate,
          newTime: selectedNewSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Reschedule failed');
      }

      setAppointment(data.appointment);
      setRescheduleOpen(false);
      showToast('Appointment rescheduled successfully!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Reschedule slot conflict', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  const service = appointment ? services.find((s) => s.id === appointment.serviceId) : null;
  const dentist = appointment ? dentists.find((d) => d.id === appointment.dentistId) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Heading */}
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Patient Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Manage Your Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Look up your reservation details, download calendar invitations, or request a reschedule in compliance with our 24-hour notice policy.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Booking Reference *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LDS-94218"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono uppercase rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or Mobile Phone (Verification)
              </label>
              <input
                type="text"
                placeholder="jane@example.com or phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {searchError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={searching}
              className="bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all shadow flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? 'Verifying Booking...' : 'Find My Appointment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appointment Result View */}
      {appointment && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-mono">Reference: {appointment.bookingReference}</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {service?.name || 'Dental Appointment'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  appointment.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : appointment.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.status === 'cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Clinician</span>
              <div className="text-sm font-bold text-slate-900">{dentist?.name || 'Clinic Dentist'}</div>
              <div className="text-slate-500">{dentist?.specialization}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Date & Time</span>
              <div className="text-sm font-bold text-slate-900">
                {appointment.appointmentDate} at {appointment.appointmentTime}
              </div>
              <div className="text-slate-500">Duration: {appointment.durationMinutes} minutes</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Patient Details</span>
              <div className="text-sm font-bold text-slate-900">{appointment.patientName}</div>
              <div className="text-slate-500">
                {appointment.patientEmail} · {appointment.patientPhone}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Clinic Location</span>
              <div className="text-sm font-bold text-slate-900">
                {settings.address.street}, {settings.address.suite}
              </div>
              <div className="text-slate-500">{settings.address.city}, {settings.address.state}</div>
            </div>
          </div>

          {appointment.cancellationReason && (
            <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-200">
              <strong>Cancellation note: </strong> {appointment.cancellationReason}
            </div>
          )}

          {/* Actions */}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setRescheduleOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reschedule Appointment</span>
              </button>

              <button
                onClick={() => setCancelModalOpen(true)}
                className="border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Confirm Appointment Cancellation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you wish to cancel booking <strong>{appointment?.bookingReference}</strong>? Please give us a brief reason:
            </p>
            <input
              type="text"
              placeholder="e.g. Work schedule change, feeling better, illness..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="w-1/2 border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancel}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">
              Pick a new date to view real-time open slots with {dentist?.name}:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={(e) => loadRescheduleSlots(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
              />
            </div>

            {slotsLoading && <div className="text-xs text-teal-700 animate-pulse">Checking schedule...</div>}

            {newSlots.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-500">Available Slots:</span>
                <div className="grid grid-cols-3 gap-2">
                  {newSlots.map((s) => (
                    <button
                      type="button"
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSelectedNewSlot(s.time)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        !s.available
                          ? 'bg-slate-100 text-slate-400 line-through'
                          : selectedNewSlot === s.time
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setRescheduleOpen(false)}
                className="w-1/2 border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50"
              >
                Close
              </button>
              <button
                disabled={!selectedNewSlot || rescheduling}
                onClick={handleConfirmReschedule}
                className="w-1/2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
              >
                {rescheduling ? 'Updating...' : 'Confirm New Time'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
