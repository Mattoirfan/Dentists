import React, { useState } from 'react';
import { Menu, X, Calendar, ChevronDown, User, Sparkles, AlertTriangle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, startBooking, setIsSmileQuizOpen } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Our Dentists', path: '/dentists' },
    { label: 'About Us', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Patient Info', path: '/patient-information' },
    { label: 'Emergency', path: '/emergency', isEmergency: true },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setServicesDropdown(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-2 group text-left focus:outline-none"
              aria-label="Luma Dental Studio Home"
            >
              <img
                src="/brand/logo.svg"
                alt="Luma Dental Studio"
                className="h-11 w-auto transition-transform group-hover:scale-[1.02]"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`flex items-center gap-1 py-2 transition-colors relative ${
                        isActive(item.path)
                          ? 'text-teal-700 font-semibold'
                          : 'text-slate-700 hover:text-teal-700'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-transform" />
                      {isActive(item.path) && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                      )}
                    </button>

                    {/* Services Dropdown */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-3 px-2 transition-all">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1.5 border-b border-slate-100">
                          Treatment Categories
                        </div>
                        <div className="mt-1 space-y-0.5">
                          <button
                            onClick={() => handleNavClick('/services?cat=preventive')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Preventive & Checkups</span>
                            <span className="text-[10px] text-slate-400">Regular care</span>
                          </button>
                          <button
                            onClick={() => handleNavClick('/services?cat=cosmetic')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Cosmetic & Veneers</span>
                            <span className="text-[10px] text-slate-400">Smile Design</span>
                          </button>
                          <button
                            onClick={() => handleNavClick('/services?cat=orthodontics')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Invisalign & Aligners</span>
                            <span className="text-[10px] text-slate-400">Orthodontics</span>
                          </button>
                          <button
                            onClick={() => handleNavClick('/services?cat=implants')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Dental Implants</span>
                            <span className="text-[10px] text-slate-400">3D Guided</span>
                          </button>
                          <button
                            onClick={() => handleNavClick('/services?cat=restorative')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Crowns, Fillings & Roots</span>
                            <span className="text-[10px] text-slate-400">Restoration</span>
                          </button>
                          <div className="pt-1.5 border-t border-slate-100">
                            <button
                              onClick={() => handleNavClick('/services')}
                              className="w-full text-center py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                            >
                              View All 16 Treatments →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`py-2 relative transition-colors ${
                    item.isEmergency
                      ? 'text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1'
                      : isActive(item.path)
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-700 hover:text-teal-700'
                  }`}
                >
                  {item.isEmergency && <AlertTriangle className="w-3.5 h-3.5" />}
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setIsSmileQuizOpen(true)}
              className="text-xs font-medium text-slate-600 hover:text-teal-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Find the right treatment for your smile"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Smile Match</span>
            </button>

            <button
              onClick={() => handleNavClick('/patient-portal')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Manage existing booking"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Portal</span>
            </button>

            <button
              onClick={() => startBooking()}
              className="bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => startBooking()}
              className="bg-teal-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full text-left px-3 py-2.5 text-base font-medium rounded-lg transition-colors flex items-center justify-between ${
                item.isEmergency
                  ? 'text-rose-600 bg-rose-50/60 font-semibold'
                  : isActive(item.path)
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {item.isEmergency && <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-mono">Urgent</span>}
            </button>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setIsSmileQuizOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Interactive Smile Assessment</span>
            </button>

            <button
              onClick={() => handleNavClick('/patient-portal')}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>Patient Portal (My Booking)</span>
            </button>

            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <span>Clinic Staff & Admin</span>
            </button>

            <button
              onClick={() => {
                startBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 rounded-xl shadow-sm text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
