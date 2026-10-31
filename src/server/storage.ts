import fs from 'fs';
import path from 'path';
import {
  ClinicSettings,
  Dentist,
  DentalService,
  Appointment,
  PatientEnquiry,
  NotificationLog,
  TimeSlot,
} from '../types/dental';
import {
  initialClinicSettings,
  initialDentists,
  initialServices,
  sampleAppointments,
} from '../data/initialData';

interface DbSchema {
  settings: ClinicSettings;
  dentists: Dentist[];
  services: DentalService[];
  appointments: Appointment[];
  enquiries: PatientEnquiry[];
  notifications: NotificationLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class StorageManager {
  private data: DbSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DbSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read db.json, initializing fresh store:', e);
    }

    const initial: DbSchema = {
      settings: initialClinicSettings,
      dentists: initialDentists,
      services: initialServices,
      appointments: sampleAppointments,
      enquiries: [
        {
          id: 'enq-1',
          name: 'James Wilson',
          email: 'jwilson@example.com',
          phone: '+1 (555) 349-2019',
          category: 'nervous-patient',
          message: 'Hello, I have not seen a dentist in 5 years due to dental phobia. Do you offer nitrous oxide or sedation for gentle cleanings?',
          preferredContact: 'email',
          status: 'in-progress',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          adminResponse: 'Dr. Julian Chen responded explaining our calming protocol and noise-cancelling headphones options.',
        },
      ],
      notifications: [
        {
          id: 'notif-1',
          bookingReference: 'LDS-94218',
          recipientEmail: 'sarah.j@example.com',
          recipientPhone: '+1 (555) 492-8172',
          type: 'booking-confirmed',
          channel: 'both',
          subject: 'Appointment Confirmed: Comprehensive Examination with Dr. Elena Rostova',
          status: 'sent',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DbSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public getSettings(): ClinicSettings {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<ClinicSettings>): ClinicSettings {
    this.data.settings = { ...this.data.settings, ...partial };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getDentists(): Dentist[] {
    return this.data.dentists;
  }

  public getDentistBySlug(slug: string): Dentist | undefined {
    return this.data.dentists.find((d) => d.slug === slug || d.id === slug);
  }

  public updateDentist(id: string, updates: Partial<Dentist>): Dentist | null {
    const idx = this.data.dentists.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.data.dentists[idx] = { ...this.data.dentists[idx], ...updates };
    this.saveData(this.data);
    return this.data.dentists[idx];
  }

  public getServices(): DentalService[] {
    return this.data.services;
  }

  public getServiceBySlug(slug: string): DentalService | undefined {
    return this.data.services.find((s) => s.slug === slug || s.id === slug);
  }

  public updateService(id: string, updates: Partial<DentalService>): DentalService | null {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.saveData(this.data);
    return this.data.services[idx];
  }

  public getAppointments(filters?: { status?: string; date?: string; dentistId?: string }): Appointment[] {
    let result = [...this.data.appointments];
    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters?.date) {
      result = result.filter((a) => a.appointmentDate === filters.date);
    }
    if (filters?.dentistId && filters.dentistId !== 'all') {
      result = result.filter((a) => a.dentistId === filters.dentistId);
    }
    return result.sort((a, b) => (b.appointmentDate + b.appointmentTime).localeCompare(a.appointmentDate + a.appointmentTime));
  }

  public getAppointmentByReference(reference: string, emailOrPhone?: string): Appointment | undefined {
    const cleanRef = reference.trim().toUpperCase();
    const apt = this.data.appointments.find((a) => a.bookingReference.toUpperCase() === cleanRef);
    if (!apt) return undefined;
    if (emailOrPhone) {
      const q = emailOrPhone.trim().toLowerCase();
      const matchEmail = apt.patientEmail.toLowerCase() === q;
      const matchPhone = apt.patientPhone.replace(/\D/g, '').endsWith(q.replace(/\D/g, '').slice(-7));
      if (!matchEmail && !matchPhone) {
        return undefined;
      }
    }
    return apt;
  }

  public getAvailableSlots(dentistId: string, dateStr: string, _durationMinutes = 45): TimeSlot[] {
    const targetDate = new Date(dateStr + 'T00:00:00');
    if (isNaN(targetDate.getTime())) return [];

    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Clinic is closed on Sunday
    if (dayOfWeek === 0) {
      return [];
    }

    // Determine target dentists
    let candidateDentists = this.data.dentists.filter((d) => d.activeStatus);
    if (dentistId && dentistId !== 'any' && dentistId !== 'all') {
      candidateDentists = candidateDentists.filter((d) => d.id === dentistId);
    }

    // Filter to dentists who work on this day
    const workingDentists = candidateDentists.filter((d) => d.workingDays.includes(dayOfWeek));
    if (workingDentists.length === 0) {
      return [];
    }

    // Standard day interval slots: 8:30 to 17:30 (Saturday ends at 15:00)
    const isSaturday = dayOfWeek === 6;
    const standardStartMinutes = 8 * 60 + 30; // 08:30
    const standardEndMinutes = isSaturday ? 15 * 60 : 17 * 60 + 30; // 15:00 or 17:30
    const slotStep = 45; // 45-minute appointment slots

    const slots: TimeSlot[] = [];
    const now = new Date();
    const isToday = now.toISOString().split('T')[0] === dateStr;
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 60; // 1 hour buffer

    for (let timeMinutes = standardStartMinutes; timeMinutes + slotStep <= standardEndMinutes; timeMinutes += slotStep) {
      // Exclude lunch break 13:00 - 14:00 (780 to 840)
      if (timeMinutes >= 13 * 60 && timeMinutes < 14 * 60) {
        continue;
      }

      if (isToday && timeMinutes < currentMinutes) {
        continue; // past slot today
      }

      const hours = Math.floor(timeMinutes / 60);
      const mins = timeMinutes % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // Check which dentist is free at this slot
      let availableDentist: Dentist | undefined;
      for (const d of workingDentists) {
        // Check if dentist's personal shift covers this time
        const [dStartH, dStartM] = d.workHours.start.split(':').map(Number);
        const [dEndH, dEndM] = d.workHours.end.split(':').map(Number);
        const dStart = dStartH * 60 + dStartM;
        const dEnd = dEndH * 60 + dEndM;

        if (timeMinutes < dStart || timeMinutes + slotStep > dEnd) {
          continue;
        }

        // Check if dentist already has a non-cancelled booking at this slot
        const isConflict = this.data.appointments.some((a) => {
          if (a.dentistId !== d.id) return false;
          if (a.appointmentDate !== dateStr) return false;
          if (a.status === 'cancelled') return false;

          const [aH, aM] = a.appointmentTime.split(':').map(Number);
          const aStart = aH * 60 + aM;
          const aEnd = aStart + a.durationMinutes;

          // Check overlap
          return Math.max(timeMinutes, aStart) < Math.min(timeMinutes + slotStep, aEnd);
        });

        if (!isConflict) {
          availableDentist = d;
          break;
        }
      }

      slots.push({
        time: timeStr,
        available: !!availableDentist,
        dentistId: availableDentist?.id,
        dentistName: availableDentist?.name,
        reason: availableDentist ? undefined : 'Slot booked or unavailable',
      });
    }

    return slots;
  }

  public createAppointment(params: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientType: 'new' | 'returning';
    dentistId: string;
    serviceId: string;
    appointmentDate: string;
    appointmentTime: string;
    durationMinutes?: number;
    notes?: string;
    accessibilityRequests?: string;
  }): { success: boolean; appointment?: Appointment; error?: string } {
    const {
      patientName,
      patientEmail,
      patientPhone,
      patientType,
      serviceId,
      appointmentDate,
      appointmentTime,
      notes,
      accessibilityRequests,
    } = params;

    let dentistId = params.dentistId;
    const duration = params.durationMinutes || 45;

    // Resolve dentist if 'any' or 'first-available'
    if (!dentistId || dentistId === 'any' || dentistId === 'first-available') {
      const slots = this.getAvailableSlots('any', appointmentDate, duration);
      const matchingSlot = slots.find((s) => s.time === appointmentTime && s.available);
      if (matchingSlot && matchingSlot.dentistId) {
        dentistId = matchingSlot.dentistId;
      } else {
        return { success: false, error: 'No clinicians are available for this selected date and time slot.' };
      }
    }

    // Atomic double-booking check
    const [reqH, reqM] = appointmentTime.split(':').map(Number);
    const reqStart = reqH * 60 + reqM;
    const reqEnd = reqStart + duration;

    const hasConflict = this.data.appointments.some((a) => {
      if (a.dentistId !== dentistId) return false;
      if (a.appointmentDate !== appointmentDate) return false;
      if (a.status === 'cancelled') return false;

      const [aH, aM] = a.appointmentTime.split(':').map(Number);
      const aStart = aH * 60 + aM;
      const aEnd = aStart + a.durationMinutes;

      return Math.max(reqStart, aStart) < Math.min(reqEnd, aEnd);
    });

    if (hasConflict) {
      return {
        success: false,
        error: 'This appointment slot was just reserved by another patient. Please choose an adjacent time.',
      };
    }

    // Generate random 5-digit booking reference
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const bookingReference = `LDS-${randomCode}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingReference,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone.trim(),
      patientType,
      dentistId,
      serviceId,
      appointmentDate,
      appointmentTime,
      durationMinutes: duration,
      status: 'confirmed',
      notes,
      accessibilityRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.appointments.push(newAppointment);

    // Create automated transactional notification record
    const service = this.data.services.find((s) => s.id === serviceId);
    const dentist = this.data.dentists.find((d) => d.id === dentistId);

    const notification: NotificationLog = {
      id: `notif-${Date.now()}`,
      bookingReference,
      recipientEmail: patientEmail,
      recipientPhone: patientPhone,
      type: 'booking-confirmed',
      channel: 'both',
      subject: `Appointment Confirmed: ${service?.name || 'Dental Visit'} with ${dentist?.name || 'Luma Dentist'}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
    this.data.notifications.unshift(notification);

    this.saveData(this.data);
    return { success: true, appointment: newAppointment };
  }

  public updateAppointmentStatus(
    id: string,
    status: Appointment['status'],
    cancellationReason?: string
  ): Appointment | null {
    const apt = this.data.appointments.find((a) => a.id === id || a.bookingReference === id);
    if (!apt) return null;

    apt.status = status;
    apt.updatedAt = new Date().toISOString();
    if (cancellationReason) {
      apt.cancellationReason = cancellationReason;
    }

    if (status === 'cancelled') {
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        bookingReference: apt.bookingReference,
        recipientEmail: apt.patientEmail,
        recipientPhone: apt.patientPhone,
        type: 'cancelled',
        channel: 'email',
        subject: `Appointment Cancelled: Booking #${apt.bookingReference}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
      });
    }

    this.saveData(this.data);
    return apt;
  }

  public rescheduleAppointment(
    reference: string,
    newDate: string,
    newTime: string,
    dentistId?: string
  ): { success: boolean; appointment?: Appointment; error?: string } {
    const apt = this.data.appointments.find((a) => a.bookingReference === reference);
    if (!apt) return { success: false, error: 'Appointment not found' };

    const targetDentist = dentistId || apt.dentistId;

    // Check slot availability
    const slots = this.getAvailableSlots(targetDentist, newDate, apt.durationMinutes);
    const matching = slots.find((s) => s.time === newTime && s.available);
    if (!matching) {
      return { success: false, error: 'The requested new slot is not available.' };
    }

    apt.appointmentDate = newDate;
    apt.appointmentTime = newTime;
    apt.dentistId = targetDentist;
    apt.status = 'confirmed';
    apt.updatedAt = new Date().toISOString();

    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      bookingReference: apt.bookingReference,
      recipientEmail: apt.patientEmail,
      recipientPhone: apt.patientPhone,
      type: 'rescheduled',
      channel: 'both',
      subject: `Appointment Rescheduled: ${newDate} at ${newTime}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    this.saveData(this.data);
    return { success: true, appointment: apt };
  }

  public getEnquiries(): PatientEnquiry[] {
    return this.data.enquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public createEnquiry(params: Omit<PatientEnquiry, 'id' | 'status' | 'createdAt'>): PatientEnquiry {
    const enquiry: PatientEnquiry = {
      id: `enq-${Date.now()}`,
      ...params,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.data.enquiries.unshift(enquiry);
    this.saveData(this.data);
    return enquiry;
  }

  public updateEnquiry(id: string, updates: Partial<PatientEnquiry>): PatientEnquiry | null {
    const enq = this.data.enquiries.find((e) => e.id === id);
    if (!enq) return null;
    Object.assign(enq, updates);
    this.saveData(this.data);
    return enq;
  }

  public getNotifications(): NotificationLog[] {
    return this.data.notifications;
  }

  public getAdminStats() {
    const totalAppointments = this.data.appointments.length;
    const confirmedCount = this.data.appointments.filter((a) => a.status === 'confirmed').length;
    const pendingCount = this.data.appointments.filter((a) => a.status === 'pending').length;
    const completedCount = this.data.appointments.filter((a) => a.status === 'completed').length;
    const cancelledCount = this.data.appointments.filter((a) => a.status === 'cancelled').length;
    const newEnquiriesCount = this.data.enquiries.filter((e) => e.status === 'new').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAppointments = this.data.appointments.filter((a) => a.appointmentDate === todayStr);

    return {
      totalAppointments,
      confirmedCount,
      pendingCount,
      completedCount,
      cancelledCount,
      newEnquiriesCount,
      todayCount: todaysAppointments.length,
      activeDentists: this.data.dentists.filter((d) => d.activeStatus).length,
      publishedServices: this.data.services.filter((s) => s.activeStatus).length,
    };
  }
}

export const db = new StorageManager();
