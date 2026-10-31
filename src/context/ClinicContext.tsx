import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClinicSettings, Dentist, DentalService } from '../types/dental';
import { initialClinicSettings, initialDentists, initialServices } from '../data/initialData';
import { apiFetch } from '../utils/clientApiBridge';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ClinicContextType {
  settings: ClinicSettings;
  dentists: Dentist[];
  services: DentalService[];
  loading: boolean;
  currentPath: string;
  navigate: (path: string) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
  preselectedServiceId: string | null;
  preselectedDentistId: string | null;
  startBooking: (serviceId?: string, dentistId?: string) => void;
  isSmileQuizOpen: boolean;
  setIsSmileQuizOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings>(initialClinicSettings);
  const [dentists, setDentists] = useState<Dentist[]>(initialDentists);
  const [services, setServices] = useState<DentalService[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedDentistId, setPreselectedDentistId] = useState<string | null>(null);
  const [isSmileQuizOpen, setIsSmileQuizOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return typeof window !== 'undefined' ? !!localStorage.getItem('luma_admin_token') : false;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen to popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [settingsRes, dentistsRes, servicesRes] = await Promise.all([
        apiFetch('/api/settings').catch(() => null),
        apiFetch('/api/dentists').catch(() => null),
        apiFetch('/api/services').catch(() => null),
      ]);

      if (settingsRes && settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
      if (dentistsRes && dentistsRes.ok) {
        const data = await dentistsRes.json();
        setDentists(data);
      }
      if (servicesRes && servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data);
      }
    } catch (e) {
      console.warn('API fetch warning, using fallback seed data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const startBooking = (serviceId?: string, dentistId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setPreselectedDentistId(dentistId || null);
    navigate('/book-appointment');
  };

  return (
    <ClinicContext.Provider
      value={{
        settings,
        dentists,
        services,
        loading,
        currentPath,
        navigate,
        toast,
        showToast,
        hideToast,
        refreshData,
        preselectedServiceId,
        preselectedDentistId,
        startBooking,
        isSmileQuizOpen,
        setIsSmileQuizOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
