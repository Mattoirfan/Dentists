export type ServiceCategory = 
  | 'preventive'
  | 'restorative'
  | 'cosmetic'
  | 'orthodontics'
  | 'implants'
  | 'gum-care'
  | 'pediatric'
  | 'oral-surgery';

export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface DentalService {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  indicativePrice: string;
  priceNote?: string;
  benefits: string[];
  reasonsForAssessment: string[];
  whatToExpect: string[];
  aftercare: string[];
  faqs: TreatmentFaq[];
  image: string;
  activeStatus: boolean;
  popular?: boolean;
}

export interface Dentist {
  id: string;
  name: string;
  slug: string;
  title: string;
  specialization: string;
  verifiedQualifications: string;
  registrationNumber: string; // e.g. GDC 278192 or ADA License #39281
  experienceYears: number;
  biography: string;
  fullBiography: string;
  areasOfInterest: string[];
  languages: string[];
  profileImage: string;
  assignedServiceIds: string[];
  activeStatus: boolean;
  workingDays: number[]; // 1 = Monday, 6 = Saturday
  workHours: { start: string; end: string }; // "08:30", "17:30"
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  bookingReference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientType: 'new' | 'returning';
  dentistId: string;
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  accessibilityRequests?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'general' | 'new-patient' | 'treatment' | 'nervous-patient' | 'billing';
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  adminResponse?: string;
}

export interface ClinicSettings {
  clinicName: string;
  tagline: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  whatsappNumber: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  timezone: string;
  currency: string;
  currencySymbol: string;
  bookingNoticeMinutes: number; // minimum advance hours for booking
  cancelPolicyHours: number;
  announcementText: string;
  showAnnouncement: boolean;
}

export interface NotificationLog {
  id: string;
  bookingReference: string;
  recipientEmail: string;
  recipientPhone: string;
  type: 'booking-request' | 'booking-confirmed' | 'rescheduled' | 'cancelled' | 'reminder';
  channel: 'email' | 'sms' | 'both';
  subject: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: string;
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
  dentistId?: string;
  dentistName?: string;
  reason?: string;
}
