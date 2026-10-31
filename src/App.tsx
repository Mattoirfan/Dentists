import React from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { SmileAssessmentModal } from './components/common/SmileAssessmentModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { DentistsPage } from './components/pages/DentistsPage';
import { DentistDetailPage } from './components/pages/DentistDetailPage';
import { BookingPage } from './components/pages/BookingPage';
import { PricingPage } from './components/pages/PricingPage';
import { PatientInfoPage } from './components/pages/PatientInfoPage';
import { ContactPage } from './components/pages/ContactPage';
import { EmergencyPage } from './components/pages/EmergencyPage';
import { PatientPortalPage } from './components/pages/PatientPortalPage';
import { AdminPage } from './components/pages/AdminPage';
import {
  PrivacyPolicyPage,
  TermsPage,
  CancellationPolicyPage,
  NotFoundPage,
} from './components/pages/PolicyPages';

const AppRoutes: React.FC = () => {
  const { currentPath } = useClinic();

  // Route matching logic
  const renderPage = () => {
    // Normalise path (remove trailing slash except for root)
    const path = currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

    // 1. Static Pages
    if (path === '' || path === '/') {
      return <HomePage />;
    }
    if (path === '/services') {
      return <ServicesPage />;
    }
    if (path === '/about') {
      return <AboutPage />;
    }
    if (path === '/dentists') {
      return <DentistsPage />;
    }
    if (path === '/book-appointment') {
      return <BookingPage />;
    }
    if (path === '/pricing') {
      return <PricingPage />;
    }
    if (path === '/patient-information' || path === '/patient-info') {
      return <PatientInfoPage />;
    }
    if (path === '/contact') {
      return <ContactPage />;
    }
    if (path === '/emergency') {
      return <EmergencyPage />;
    }
    if (path === '/patient-portal') {
      return <PatientPortalPage />;
    }
    if (path === '/admin') {
      return <AdminPage />;
    }
    if (path === '/privacy') {
      return <PrivacyPolicyPage />;
    }
    if (path === '/terms') {
      return <TermsPage />;
    }
    if (path === '/cancellation-policy') {
      return <CancellationPolicyPage />;
    }

    // 2. Dynamic Treatment Pages: /services/:slug
    if (path.startsWith('/services/')) {
      const slug = path.replace('/services/', '');
      return <ServiceDetailPage slug={slug} />;
    }

    // 3. Dynamic Dentist Profiles: /dentists/:slug
    if (path.startsWith('/dentists/')) {
      const slug = path.replace('/dentists/', '');
      return <DentistDetailPage slug={slug} />;
    }

    // 4. Fallback 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <SmileAssessmentModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ClinicProvider>
      <AppRoutes />
    </ClinicProvider>
  );
}

export default App;
