import {
  initialClinicSettings,
  initialDentists,
  initialServices,
  sampleAppointments,
} from '../data/initialData';
import { Appointment, PatientEnquiry, NotificationLog, TimeSlot } from '../types/dental';

const STORAGE_KEY = 'luma_dental_local_db';

interface LocalStore {
  settings: typeof initialClinicSettings;
  dentists: typeof initialDentists;
  services: typeof initialServices;
  appointments: Appointment[];
  enquiries: PatientEnquiry[];
  notifications: NotificationLog[];
}

function getLocalStore(): LocalStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  const initial: LocalStore = {
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
        message: 'Hello, I have dental anxiety. Do you offer gentle pacing for new patient checkups?',
        preferredContact: 'email',
        status: 'in-progress',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        adminResponse: 'Dr. Julian Chen responded with details on noise-cancelling headphones and calm protocol.',
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

  saveLocalStore(initial);
  return initial;
}

function saveLocalStore(store: LocalStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to local storage:', e);
  }
}

// Compute real-time slots in-browser
function computeSlots(dentistId: string, dateStr: string): TimeSlot[] {
  const store = getLocalStore();
  const targetDate = new Date(dateStr + 'T00:00:00');
  if (isNaN(targetDate.getTime())) return [];

  const dayOfWeek = targetDate.getDay();
  if (dayOfWeek === 0) return []; // Sunday closed

  let candidateDentists = store.dentists.filter((d) => d.activeStatus);
  if (dentistId && dentistId !== 'any' && dentistId !== 'all') {
    candidateDentists = candidateDentists.filter((d) => d.id === dentistId);
  }

  const workingDentists = candidateDentists.filter((d) => d.workingDays.includes(dayOfWeek));
  if (workingDentists.length === 0) return [];

  const isSaturday = dayOfWeek === 6;
  const startMinutes = 8 * 60 + 30;
  const endMinutes = isSaturday ? 15 * 60 : 17 * 60 + 30;
  const slotStep = 45;

  const slots: TimeSlot[] = [];
  const now = new Date();
  const isToday = now.toISOString().split('T')[0] === dateStr;
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + 60;

  for (let timeMinutes = startMinutes; timeMinutes + slotStep <= endMinutes; timeMinutes += slotStep) {
    if (timeMinutes >= 13 * 60 && timeMinutes < 14 * 60) continue; // Lunch
    if (isToday && timeMinutes < currentMinutes) continue;

    const hours = Math.floor(timeMinutes / 60);
    const mins = timeMinutes % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    const availableDentist = workingDentists.find((d) => {
      const isConflict = store.appointments.some((a) => {
        if (a.dentistId !== d.id) return false;
        if (a.appointmentDate !== dateStr) return false;
        if (a.status === 'cancelled') return false;
        return a.appointmentTime === timeStr;
      });
      return !isConflict;
    });

    slots.push({
      time: timeStr,
      available: !!availableDentist,
      dentistId: availableDentist?.id,
      dentistName: availableDentist?.name,
      reason: availableDentist ? undefined : 'Slot booked',
    });
  }

  return slots;
}

/**
 * Universal API fetch that tries the real backend first.
 * If backend is unavailable or returns 404/HTML (e.g. static host without Node),
 * falls back to local storage handler.
 */
export async function apiFetch(urlStr: string, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(urlStr, init);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      return response;
    }
    return handleClientRoute(urlStr, init);
  } catch (e) {
    return handleClientRoute(urlStr, init);
  }
}

function handleClientRoute(urlStr: string, init?: RequestInit): Response {
  const url = new URL(urlStr, window.location.origin);
  const path = url.pathname;
  const method = (init?.method || 'GET').toUpperCase();
  const store = getLocalStore();

  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // 1. Settings
  if (path === '/api/settings') {
    if (method === 'GET') {
      return jsonResponse(store.settings);
    }
    if (method === 'PUT') {
      const body = JSON.parse((init?.body as string) || '{}');
      store.settings = { ...store.settings, ...body };
      saveLocalStore(store);
      return jsonResponse(store.settings);
    }
  }

  // 2. Dentists
  if (path === '/api/dentists') {
    return jsonResponse(store.dentists);
  }

  // 3. Services
  if (path === '/api/services') {
    return jsonResponse(store.services);
  }
  if (path.startsWith('/api/services/') && method === 'PUT') {
    const id = path.replace('/api/services/', '');
    const body = JSON.parse((init?.body as string) || '{}');
    const idx = store.services.findIndex((s) => s.id === id);
    if (idx !== -1) {
      store.services[idx] = { ...store.services[idx], ...body };
      saveLocalStore(store);
      return jsonResponse(store.services[idx]);
    }
  }

  // 4. Availability
  if (path === '/api/availability') {
    const dentistId = url.searchParams.get('dentistId') || 'any';
    const date = url.searchParams.get('date') || '';
    const slots = computeSlots(dentistId, date);
    return jsonResponse({ date, dentistId, slots });
  }

  // 5. Appointments Creation
  if (path === '/api/appointments' && method === 'POST') {
    const body = JSON.parse((init?.body as string) || '{}');
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const bookingReference = `LDS-${randomCode}`;

    let dentistId = body.dentistId;
    if (!dentistId || dentistId === 'any') {
      const slots = computeSlots('any', body.appointmentDate);
      const slot = slots.find((s) => s.time === body.appointmentTime && s.available);
      dentistId = slot?.dentistId || store.dentists[0].id;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      bookingReference,
      patientName: body.patientName,
      patientEmail: body.patientEmail,
      patientPhone: body.patientPhone,
      patientType: body.patientType || 'new',
      dentistId,
      serviceId: body.serviceId,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      durationMinutes: body.durationMinutes || 45,
      status: 'confirmed',
      notes: body.notes,
      accessibilityRequests: body.accessibilityRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.appointments.push(newApt);
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      bookingReference,
      recipientEmail: body.patientEmail,
      recipientPhone: body.patientPhone,
      type: 'booking-confirmed',
      channel: 'both',
      subject: `Appointment Confirmed: Booking #${bookingReference}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    saveLocalStore(store);
    return jsonResponse(newApt, 201);
  }

  // 6. Appointment Lookup by Reference
  if (path.startsWith('/api/appointments/') && method === 'GET') {
    const ref = path.replace('/api/appointments/', '').toUpperCase();
    const apt = store.appointments.find((a) => a.bookingReference.toUpperCase() === ref);
    if (!apt) return jsonResponse({ error: 'Appointment not found' }, 404);
    return jsonResponse(apt);
  }

  // 7. Cancel Appointment
  if (path.includes('/cancel') && method === 'POST') {
    const parts = path.split('/');
    const ref = parts[3]?.toUpperCase();
    const body = JSON.parse((init?.body as string) || '{}');
    const apt = store.appointments.find((a) => a.bookingReference.toUpperCase() === ref);
    if (apt) {
      apt.status = 'cancelled';
      apt.cancellationReason = body.reason;
      saveLocalStore(store);
      return jsonResponse({ success: true, appointment: apt });
    }
  }

  // 8. Reschedule Appointment
  if (path.includes('/reschedule') && method === 'POST') {
    const parts = path.split('/');
    const ref = parts[3]?.toUpperCase();
    const body = JSON.parse((init?.body as string) || '{}');
    const apt = store.appointments.find((a) => a.bookingReference.toUpperCase() === ref);
    if (apt) {
      apt.appointmentDate = body.newDate;
      apt.appointmentTime = body.newTime;
      apt.status = 'confirmed';
      saveLocalStore(store);
      return jsonResponse({ success: true, appointment: apt });
    }
  }

  // 9. Admin Endpoints
  if (path === '/api/admin/appointments') {
    return jsonResponse(store.appointments);
  }
  if (path.startsWith('/api/admin/appointments/') && method === 'PATCH') {
    const id = path.replace('/api/admin/appointments/', '');
    const body = JSON.parse((init?.body as string) || '{}');
    const apt = store.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = body.status;
      saveLocalStore(store);
      return jsonResponse(apt);
    }
  }
  if (path === '/api/admin/login' && method === 'POST') {
    const body = JSON.parse((init?.body as string) || '{}');
    if (body.username === 'admin' && (body.password === 'luma2026' || body.password === 'admin')) {
      return jsonResponse({ success: true, token: 'luma-admin-token-secure-session' });
    }
    return jsonResponse({ error: 'Invalid credentials' }, 401);
  }
  if (path === '/api/admin/stats') {
    return jsonResponse({
      totalAppointments: store.appointments.length,
      confirmedCount: store.appointments.filter((a) => a.status === 'confirmed').length,
      newEnquiriesCount: store.enquiries.filter((e) => e.status === 'new').length,
      todayCount: store.appointments.filter(
        (a) => a.appointmentDate === new Date().toISOString().split('T')[0]
      ).length,
    });
  }
  if (path === '/api/admin/notifications') {
    return jsonResponse(store.notifications);
  }

  // 10. Enquiries
  if (path === '/api/enquiries') {
    if (method === 'GET') {
      return jsonResponse(store.enquiries);
    }
    if (method === 'POST') {
      const body = JSON.parse((init?.body as string) || '{}');
      const enq: PatientEnquiry = {
        id: `enq-${Date.now()}`,
        name: body.name,
        email: body.email,
        phone: body.phone,
        category: body.category || 'general',
        message: body.message,
        preferredContact: body.preferredContact || 'email',
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      store.enquiries.unshift(enq);
      saveLocalStore(store);
      return jsonResponse(enq, 201);
    }
  }
  if (path.startsWith('/api/enquiries/') && method === 'PATCH') {
    const id = path.replace('/api/enquiries/', '');
    const body = JSON.parse((init?.body as string) || '{}');
    const enq = store.enquiries.find((e) => e.id === id);
    if (enq) {
      Object.assign(enq, body);
      saveLocalStore(store);
      return jsonResponse(enq);
    }
  }

  return jsonResponse({ error: 'Not Found' }, 404);
}
