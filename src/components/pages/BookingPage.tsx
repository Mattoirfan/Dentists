import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Download,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { TimeSlot, Appointment } from '../../types/dental';
import { apiFetch } from '../../utils/clientApiBridge';

export const BookingPage: React.FC = () => {
  const {
    services,
    dentists,
    settings,
    preselectedServiceId,
    preselectedDentistId,
    navigate,
    showToast,
  } = useClinic();

  // Step state: 1 to 5 (5 = Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || 'srv-exam'
  );
  const [selectedDentistId, setSelectedDentistId] = useState<string>(
    preselectedDentistId || 'any'
  );

  // Default to tomorrow or next business day
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // If tomorrow is Sunday (0), advance to Monday
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowStr());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientType, setPatientType] = useState<'new' | 'returning'>('new');
  const [notes, setNotes] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  // Slot fetching state
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedDentist = dentists.find((d) => d.id === selectedDentistId);

  // Fetch available slots when dentist, date, or service changes
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotError(null);
      try {
        const res = await apiFetch(
          `/api/availability?dentistId=${encodeURIComponent(
            selectedDentistId
          )}&date=${selectedDate}&duration=${selectedService?.durationMinutes || 45}`
        );
        if (!res.ok) {
          throw new Error('Failed to load slots');
        }
        const data = await res.json();
        if (isMounted) {
          setAvailableSlots(data.slots || []);
          // Clear selected slot if no longer available
          if (selectedSlot && !data.slots.some((s: TimeSlot) => s.time === selectedSlot.time && s.available)) {
            setSelectedSlot(null);
          }
        }
      } catch (e: any) {
        if (isMounted) {
          setSlotError('Unable to load schedule. Please choose another date or contact the clinic.');
        }
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDentistId, selectedDate, selectedServiceId]);

  // Handle final appointment submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please choose an appointment time slot.');
      return;
    }
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      setBookingError('Please complete all required patient contact fields.');
      return;
    }
    if (!agreedPrivacy) {
      setBookingError('Please accept the clinic privacy and cancellation acknowledgment.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await apiFetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          patientType,
          dentistId: selectedDentistId === 'any' ? selectedSlot.dentistId : selectedDentistId,
          serviceId: selectedServiceId,
          appointmentDate: selectedDate,
          appointmentTime: selectedSlot.time,
          durationMinutes: selectedService?.durationMinutes || 45,
          notes,
          accessibilityRequests: accessibility,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Booking reservation could not be completed.');
      }

      setConfirmedBooking(data);
      setCurrentStep(5); // Jump to confirmation step
      showToast('Appointment reserved successfully!', 'success');
    } catch (err: any) {
      setBookingError(err.message || 'Slot conflict or network error. Please select another slot.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate iCal ICS download for calendar
  const downloadCalendarFile = () => {
    if (!confirmedBooking) return;
    const dateFormatted = confirmedBooking.appointmentDate.replace(/-/g, '');
    const [h, m] = confirmedBooking.appointmentTime.split(':');
    const startStr = `${dateFormatted}T${h}${m}00`;
    const endHour = (parseInt(h, 10) + 1).toString().padStart(2, '0');
    const endStr = `${dateFormatted}T${endHour}${m}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Luma Dental Studio//Appointment//EN
BEGIN:VEVENT
UID:${confirmedBooking.bookingReference}@lumadentalstudio.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startStr}
DTEND:${endStr}
SUMMARY:${selectedService?.name || 'Dental Appointment'} - Luma Dental Studio
DESCRIPTION:Appointment Reference: ${confirmedBooking.bookingReference}\\nDentist: ${
      selectedDentist?.name || 'Luma Dental Specialist'
    }\\nClinic Phone: ${settings.phone}
LOCATION:${settings.address.street}, ${settings.address.suite}, ${settings.address.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${confirmedBooking.bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Morning vs Afternoon slots
  const morningSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });
  const afternoonSlots = availableSlots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading */}
      <div className="text-center space-y-2">
        <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Online Scheduling Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Book Your Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Reserve real-time clinical time with our certified dental specialists. Instant confirmation with zero upfront payment.
        </p>
      </div>

      {/* Multi-Step Indicator (Steps 1 to 4) */}
      {currentStep < 5 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          {[
            { num: 1, label: 'Treatment' },
            { num: 2, label: 'Dentist' },
            { num: 3, label: 'Date & Time' },
            { num: 4, label: 'Patient Info' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                  currentStep === s.num
                    ? 'bg-teal-700 text-white shadow'
                    : currentStep > s.num
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium ${
                  currentStep === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: SELECT A SERVICE */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Step 1: Choose Your Dental Treatment</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the treatment or consultation type you are seeking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">
                        {service.category.replace('-', ' ')}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-1">{service.name}</div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{service.durationMinutes} mins</span>
                    <span className="font-semibold text-slate-800">{service.indicativePrice}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Next: Select Dentist</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT A DENTIST */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Step 2: Choose Your Clinician</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a preferred clinician, or pick "First Available Specialist" for the quickest appointment.
            </p>
          </div>

          <div className="space-y-3">
            {/* First Available Option */}
            <button
              type="button"
              onClick={() => setSelectedDentistId('any')}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                selectedDentistId === 'any'
                  ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    First Available Specialist (Recommended)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Maximizes schedule flexibility across all accredited practitioners.
                  </div>
                </div>
              </div>
              {selectedDentistId === 'any' && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
            </button>

            {/* Individual Dentists */}
            {dentists
              .filter((d) => d.activeStatus)
              .map((dentist) => {
                const isSelected = selectedDentistId === dentist.id;
                const canDoService = dentist.assignedServiceIds.includes(selectedServiceId);

                return (
                  <button
                    type="button"
                    key={dentist.id}
                    onClick={() => setSelectedDentistId(dentist.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={dentist.profileImage}
                        alt={dentist.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{dentist.name}</span>
                          {canDoService && (
                            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium">
                              Service Specialist
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{dentist.specialization}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{dentist.registrationNumber}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="border border-slate-200 text-slate-600 font-semibold text-xs py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Next: Date & Available Slots</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE AND TIME */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Step 3: Select Date & Time</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your appointment date to view real-time availability.
            </p>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-72 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none font-medium"
            />
            <span className="block text-[11px] text-slate-400 mt-1.5">
              Clinic is open Monday through Saturday. Sunday triage is on-call only.
            </span>
          </div>

          {/* Slots View */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Available Appointment Slots for {selectedDate}</span>
              </h3>
              {slotsLoading && <span className="text-xs text-teal-700 animate-pulse">Checking real-time calendar...</span>}
            </div>

            {slotError && (
              <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{slotError}</span>
              </div>
            )}

            {!slotsLoading && availableSlots.length === 0 && !slotError && (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-200">
                No open slots found for this date. The clinic may be fully booked or closed on this day. Please pick another date.
              </div>
            )}

            {/* Morning Slots */}
            {morningSlots.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Morning Slots (8:30 AM – 12:00 PM)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        type="button"
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        {slot.time}
                        {slot.dentistName && selectedDentistId === 'any' && (
                          <span className="block text-[9px] font-normal opacity-80 mt-0.5 truncate">
                            {slot.dentistName.split(' ')[1]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon Slots */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Afternoon Slots (12:00 PM – 5:30 PM)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        type="button"
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        {slot.time}
                        {slot.dentistName && selectedDentistId === 'any' && (
                          <span className="block text-[9px] font-normal opacity-80 mt-0.5 truncate">
                            {slot.dentistName.split(' ')[1]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="border border-slate-200 text-slate-600 font-semibold text-xs py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => setCurrentStep(4)}
              className="bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              <span>Next: Enter Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PATIENT DETAILS & REVIEW */}
      {currentStep === 4 && (
        <form onSubmit={handleSubmitBooking} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Step 4: Patient Details & Booking Review</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please provide essential contact details for your confirmation and clinical file.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="font-bold text-teal-900 text-sm mb-1">Appointment Summary:</div>
            <div className="flex justify-between">
              <span className="text-slate-600">Treatment:</span>
              <span className="font-semibold text-slate-900">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Clinician:</span>
              <span className="font-semibold text-slate-900">
                {selectedDentist?.name || (selectedSlot?.dentistName ? `${selectedSlot.dentistName}` : 'Assigned Specialist')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Date & Time:</span>
              <span className="font-semibold text-slate-900">
                {selectedDate} at {selectedSlot?.time} ({selectedService?.durationMinutes} mins)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Indicative Fee:</span>
              <span className="font-semibold text-slate-900">{selectedService?.indicativePrice}</span>
            </div>
          </div>

          {bookingError && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Patient Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPatientType('new')}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      patientType === 'new'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    New Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientType('returning')}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      patientType === 'returning'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Returning Patient
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address * (For Confirmation)
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Phone Number * (SMS Reminders)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Comfort / Accessibility Preferences (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. High dental anxiety, wheelchair access, prefer headphones, translation assistance"
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notes for the Dentist (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any specific tooth symptoms or smile goals you would like us to know beforehand..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <span>
                  I acknowledge the clinic's{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/cancellation-policy')}
                    className="text-teal-700 underline"
                  >
                    24-hour cancellation policy
                  </button>{' '}
                  and consent to receive appointment confirmations and reminders.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="border border-slate-200 text-slate-600 font-semibold text-xs py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-semibold text-xs py-3 px-7 rounded-xl transition-all shadow flex items-center gap-2"
            >
              {submitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CalendarIcon className="w-4 h-4" />
                  <span>Confirm Appointment Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: CONFIRMATION RECEIPT */}
      {currentStep === 5 && confirmedBooking && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Appointment Successfully Reserved!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your appointment has been confirmed on the clinic calendar. A confirmation email and SMS reminder have been dispatched.
            </p>
          </div>

          {/* Booking Card Details */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-lg mx-auto space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-teal-800 text-base">
                {confirmedBooking.bookingReference}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-semibold text-slate-900">{confirmedBooking.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-900">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dentist:</span>
              <span className="font-semibold text-slate-900">
                {selectedDentist?.name || confirmedBooking.dentistId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold text-slate-900">
                {confirmedBooking.appointmentDate} at {confirmedBooking.appointmentTime} ({confirmedBooking.durationMinutes} mins)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-900 text-right">
                {settings.address.street}, {settings.address.suite}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Confirmed in Clinic System
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={downloadCalendarFile}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Add to Calendar (.ICS)</span>
            </button>
            <button
              onClick={() => navigate('/patient-portal')}
              className="w-full sm:w-auto border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-3 px-5 rounded-xl transition-colors"
            >
              View in Patient Portal
            </button>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-400">
            Need to reschedule or have questions? Call reception at{' '}
            <a href={`tel:${settings.phone}`} className="text-teal-700 font-semibold">
              {settings.phone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
