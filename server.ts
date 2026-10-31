import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // 1. Clinic Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // 2. Dentists
  app.get('/api/dentists', (_req: Request, res: Response) => {
    res.json(db.getDentists());
  });

  app.get('/api/dentists/:slug', (req: Request, res: Response) => {
    const dentist = db.getDentistBySlug(req.params.slug);
    if (!dentist) {
      return res.status(404).json({ error: 'Dentist not found' });
    }
    res.json(dentist);
  });

  app.put('/api/dentists/:id', (req: Request, res: Response) => {
    const updated = db.updateDentist(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Dentist not found' });
    }
    res.json(updated);
  });

  // 3. Services
  app.get('/api/services', (_req: Request, res: Response) => {
    res.json(db.getServices());
  });

  app.get('/api/services/:slug', (req: Request, res: Response) => {
    const service = db.getServiceBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(updated);
  });

  // 4. Availability slots
  app.get('/api/availability', (req: Request, res: Response) => {
    const dentistId = (req.query.dentistId as string) || 'any';
    const date = req.query.date as string;
    const duration = parseInt(req.query.duration as string, 10) || 45;

    if (!date) {
      return res.status(400).json({ error: 'Query parameter "date" (YYYY-MM-DD) is required.' });
    }

    const slots = db.getAvailableSlots(dentistId, date, duration);
    res.json({ date, dentistId, slots });
  });

  // 5. Appointments
  app.post('/api/appointments', (req: Request, res: Response) => {
    const {
      patientName,
      patientEmail,
      patientPhone,
      patientType,
      dentistId,
      serviceId,
      appointmentDate,
      appointmentTime,
      durationMinutes,
      notes,
      accessibilityRequests,
    } = req.body;

    if (!patientName || !patientEmail || !patientPhone || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Please provide all required appointment fields.' });
    }

    const result = db.createAppointment({
      patientName,
      patientEmail,
      patientPhone,
      patientType: patientType || 'new',
      dentistId,
      serviceId,
      appointmentDate,
      appointmentTime,
      durationMinutes,
      notes,
      accessibilityRequests,
    });

    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }

    res.status(201).json(result.appointment);
  });

  app.get('/api/appointments/:reference', (req: Request, res: Response) => {
    const emailOrPhone = req.query.emailOrPhone as string | undefined;
    const apt = db.getAppointmentByReference(req.params.reference, emailOrPhone);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found or credentials do not match.' });
    }
    res.json(apt);
  });

  app.post('/api/appointments/:reference/cancel', (req: Request, res: Response) => {
    const { reason } = req.body;
    const updated = db.updateAppointmentStatus(req.params.reference, 'cancelled', reason);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json({ success: true, appointment: updated });
  });

  app.post('/api/appointments/:reference/reschedule', (req: Request, res: Response) => {
    const { newDate, newTime, dentistId } = req.body;
    if (!newDate || !newTime) {
      return res.status(400).json({ error: 'newDate and newTime are required.' });
    }
    const result = db.rescheduleAppointment(req.params.reference, newDate, newTime, dentistId);
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    res.json({ success: true, appointment: result.appointment });
  });

  // Admin Appointments List
  app.get('/api/admin/appointments', (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const date = req.query.date as string | undefined;
    const dentistId = req.query.dentistId as string | undefined;
    const list = db.getAppointments({ status, date, dentistId });
    res.json(list);
  });

  app.patch('/api/admin/appointments/:id', (req: Request, res: Response) => {
    const { status, cancellationReason } = req.body;
    const updated = db.updateAppointmentStatus(req.params.id, status, cancellationReason);
    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json(updated);
  });

  // 6. Patient Enquiries
  app.get('/api/enquiries', (_req: Request, res: Response) => {
    res.json(db.getEnquiries());
  });

  app.post('/api/enquiries', (req: Request, res: Response) => {
    const { name, email, phone, category, message, preferredContact } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const enquiry = db.createEnquiry({
      name,
      email,
      phone: phone || '',
      category: category || 'general',
      message,
      preferredContact: preferredContact || 'email',
    });
    res.status(201).json(enquiry);
  });

  app.patch('/api/enquiries/:id', (req: Request, res: Response) => {
    const updated = db.updateEnquiry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    res.json(updated);
  });

  // 7. Admin Stats & Notifications
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    res.json(db.getAdminStats());
  });

  app.get('/api/admin/notifications', (_req: Request, res: Response) => {
    res.json(db.getNotifications());
  });

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Clinic admin credentials
    if (username === 'admin' && (password === 'luma2026' || password === 'admin' || password === 'dentalcare')) {
      return res.json({
        success: true,
        token: 'luma-admin-token-secure-session',
        user: { name: 'Practice Manager', role: 'administrator' },
      });
    }
    return res.status(401).json({ error: 'Invalid practice manager credentials' });
  });

  // Vite integration (Dev vs Prod)
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Luma Dental Studio server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
