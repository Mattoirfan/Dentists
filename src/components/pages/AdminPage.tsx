import React, { useState, useEffect } from 'react';
import {
  Lock,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Users,
  Settings as SettingsIcon,
  MessageSquare,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  LogOut,
  Edit2,
  Save,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, PatientEnquiry, NotificationLog } from '../../types/dental';
import { apiFetch } from '../../utils/clientApiBridge';

export const AdminPage: React.FC = () => {
  const {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    settings,
    services,
    dentists,
    refreshData,
    showToast,
  } = useClinic();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('luma2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'enquiries' | 'services' | 'dentists' | 'settings' | 'notifications'
  >('appointments');

  // Appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aptFilterStatus, setAptFilterStatus] = useState<string>('all');
  const [aptSearch, setAptSearch] = useState<string>('');
  const [loadingApts, setLoadingApts] = useState(false);

  // Enquiries data
  const [enquiries, setEnquiries] = useState<PatientEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Notifications log
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Operational stats
  const [stats, setStats] = useState<any>({
    totalAppointments: 0,
    confirmedCount: 0,
    newEnquiriesCount: 0,
    todayCount: 0,
  });

  // Settings edit state
  const [editAnnouncement, setEditAnnouncement] = useState(settings.announcementText);
  const [editPhone, setEditPhone] = useState(settings.phone);
  const [editEmergency, setEditEmergency] = useState(settings.emergencyPhone);
  const [savingSettings, setSavingSettings] = useState(false);

  // Service quick editing
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      localStorage.setItem('luma_admin_token', data.token);
      setIsAdminLoggedIn(true);
      showToast('Logged in as Practice Manager', 'success');
    } catch (e: any) {
      setLoginError(e.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('luma_admin_token');
    setIsAdminLoggedIn(false);
  };

  const fetchAdminData = async () => {
    try {
      setLoadingApts(true);
      const [aptRes, enqRes, statsRes, notifRes] = await Promise.all([
        apiFetch('/api/admin/appointments'),
        apiFetch('/api/enquiries'),
        apiFetch('/api/admin/stats'),
        apiFetch('/api/admin/notifications'),
      ]);

      if (aptRes.ok) setAppointments(await aptRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApts(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const res = await apiFetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Status update failed');
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast(`Appointment status changed to ${status}`, 'success');
      fetchAdminData();
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const updateEnquiryStatus = async (id: string, status: PatientEnquiry['status']) => {
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showToast('Enquiry status updated', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const saveClinicSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await apiFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcementText: editAnnouncement,
          phone: editPhone,
          emergencyPhone: editEmergency,
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      await refreshData();
      showToast('Clinic settings updated successfully!', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const saveServicePrice = async (serviceId: string) => {
    try {
      const res = await apiFetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicativePrice: editedPrice }),
      });
      if (!res.ok) throw new Error('Failed to update service fee');
      await refreshData();
      setEditingServiceId(null);
      showToast('Service price updated successfully', 'success');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // If unauthenticated, show login portal
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Practice Staff Login</h1>
            <p className="text-xs text-slate-500">
              Access appointment calendar, dentist schedules, and patient enquiries.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow"
            >
              Sign In to Practice Dashboard
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700">Demo Staff Credentials:</span>
            <div>Username: <code className="bg-white px-1.5 py-0.5 rounded border">admin</code></div>
            <div>Password: <code className="bg-white px-1.5 py-0.5 rounded border">luma2026</code></div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (aptFilterStatus !== 'all' && apt.status !== aptFilterStatus) return false;
    if (aptSearch.trim()) {
      const q = aptSearch.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchRef = apt.bookingReference.toLowerCase().includes(q);
      const matchEmail = apt.patientEmail.toLowerCase().includes(q);
      return matchName || matchRef || matchEmail;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Practice Management System</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Luma Dental Studio Operations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Operational Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500">Today's Bookings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.todayCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500">Confirmed Appointments</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.confirmedCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500">New Patient Enquiries</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">{stats.newEnquiriesCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500">Active Clinicians</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {dentists.filter((d) => d.activeStatus).length}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: 'appointments', label: 'Appointments Calendar', count: appointments.length },
          { id: 'enquiries', label: 'Patient Enquiries', count: enquiries.filter((e) => e.status === 'new').length },
          { id: 'services', label: 'Services & Pricing', count: services.length },
          { id: 'dentists', label: 'Clinicians & Hours', count: dentists.length },
          { id: 'settings', label: 'Practice Settings' },
          { id: 'notifications', label: 'Notification Logs', count: notifications.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-slate-800 text-teal-300' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: APPOINTMENTS LIST */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by patient name, ref..."
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              {['all', 'confirmed', 'pending', 'completed', 'cancelled', 'no-show'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAptFilterStatus(st)}
                  className={`text-[11px] font-semibold uppercase px-2.5 py-1.5 rounded-lg transition-colors ${
                    aptFilterStatus === st
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Treatment</th>
                  <th className="py-3 px-4">Clinician</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => {
                    const serv = services.find((s) => s.id === apt.serviceId);
                    const dent = dentists.find((d) => d.id === apt.dentistId);
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-teal-800">
                          {apt.bookingReference}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{apt.patientName}</div>
                          <div className="text-[11px] text-slate-400">
                            {apt.patientPhone} · {apt.patientEmail}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {serv?.name || apt.serviceId}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {dent?.name || apt.dentistId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{apt.appointmentDate}</div>
                          <div className="text-[11px] text-slate-400">{apt.appointmentTime}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {apt.status !== 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="text-[11px] text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded"
                                title="Confirm"
                              >
                                Confirm
                              </button>
                            )}
                            {apt.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                className="text-[11px] text-blue-700 hover:bg-blue-50 px-2 py-1 rounded"
                                title="Mark Completed"
                              >
                                Complete
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                className="text-[11px] text-rose-700 hover:bg-rose-50 px-2 py-1 rounded"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Patient Online Enquiries</h2>
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                    <span className="text-slate-400 ml-2">
                      {enq.email} · {enq.phone}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      enq.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : enq.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                  <span className="text-[10px] font-semibold text-teal-700 uppercase block mb-1">
                    Category: {enq.category} · Preferred Contact: {enq.preferredContact}
                  </span>
                  {enq.message}
                </div>

                {enq.adminResponse && (
                  <div className="text-[11px] text-slate-500 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                    <strong>Clinic response recorded:</strong> {enq.adminResponse}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Received: {new Date(enq.createdAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {enq.status !== 'in-progress' && (
                      <button
                        onClick={() => updateEnquiryStatus(enq.id, 'in-progress')}
                        className="text-[11px] font-semibold text-blue-700 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        Mark In-Progress
                      </button>
                    )}
                    {enq.status !== 'resolved' && (
                      <button
                        onClick={() => updateEnquiryStatus(enq.id, 'resolved')}
                        className="text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded"
                      >
                        Mark Resolved ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & PRICING */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Manage Published Treatments & Fees</h2>
          <div className="space-y-3">
            {services.map((s) => {
              const isEditing = editingServiceId === s.id;
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-semibold text-teal-700 uppercase">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                      {s.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs rounded-lg p-1.5 w-36 font-semibold"
                        />
                        <button
                          onClick={() => saveServicePrice(s.id)}
                          className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900">{s.indicativePrice}</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingServiceId(s.id);
                        setEditedPrice(s.indicativePrice);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
                      title="Edit fee"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CLINICIANS */}
      {activeTab === 'dentists' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Dentist Profiles & Shifts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dentists.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl border border-slate-200 flex gap-4 text-xs">
                <img
                  src={d.profileImage}
                  alt={d.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                  <div className="text-teal-700">{d.specialization}</div>
                  <div className="text-slate-400 text-[11px]">{d.registrationNumber}</div>
                  <div className="text-slate-500 text-[11px]">
                    Shift Hours: {d.workHours.start} – {d.workHours.end}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLINIC SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Configurable Clinic Details</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={editAnnouncement}
                onChange={(e) => setEditAnnouncement(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Clinic Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Urgent Emergency Hotline
                </label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={saveClinicSettings}
              disabled={savingSettings}
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: NOTIFICATION AUDIT LOGS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Transactional Email & SMS Delivery Logs
          </h2>
          <p className="text-xs text-slate-500">
            Audit of all automatic confirmation emails, reminders, and patient notification dispatches.
          </p>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs gap-4"
              >
                <div>
                  <div className="font-semibold text-slate-900">{notif.subject}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ref: <strong>{notif.bookingReference}</strong> · To: {notif.recipientEmail} ({notif.recipientPhone})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Delivered ({notif.channel})
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
