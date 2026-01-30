
import * as React from 'react';
import { useState, useEffect } from 'react';
import { db } from './db';
import { View, Service, Professional, Appointment, SiteSettings, Category } from './types';
import Home from './pages/Home';
import Booking from './pages/Booking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminServices from './pages/AdminServices';
import AdminSettings from './pages/AdminSettings';
import AdminProfessionals from './pages/AdminProfessionals';
import AdminAppointments from './pages/AdminAppointments';
import AdminReminders from './pages/AdminReminders';
import AdminHistory from './pages/AdminHistory';
import AdminCategories from './pages/AdminCategories';
import { Menu, X, Settings, LayoutDashboard, Scissors, Users, Calendar, LogOut, ChevronRight, Bell, History, Tag, Home as HomeIcon, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [view, setView] = useState<View>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(db.isAdminAuthenticated());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preSelectedServiceIds, setPreSelectedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [srvs, cats, pros, apps, sets] = await Promise.all([
          db.getServices(),
          db.getCategories(),
          db.getProfessionals(),
          db.getAppointments(),
          db.getSettings()
        ]);
        setServices(srvs);
        setCategories(cats);
        setProfessionals(pros);
        setAppointments(apps);
        setSettings(sets);
      } catch (err) {
        console.error("Failed to load data from Supabase", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', settings.primaryColor);
      root.style.setProperty('--brand-soft', settings.accentColor);
      root.style.setProperty('--brand-primary-dark', settings.primaryColor);
    }
  }, [settings]);

  useEffect(() => {
    if (isAdminLoggedIn && view === 'admin-login') {
      setView('admin-dashboard');
    }
  }, [isAdminLoggedIn, view]);

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    await db.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleUpdateServices = async (newServices: Service[]) => {
    await db.saveServices(newServices);
    setServices(newServices);
  };

  const handleUpdateCategories = async (newCategories: Category[]) => {
    await db.saveCategories(newCategories);
    setCategories(newCategories);
  };

  const handleUpdateProfessionals = async (newProfessionals: Professional[]) => {
    await db.saveProfessionals(newProfessionals);
    setProfessionals(newProfessionals);
  };

  const handleUpdateAppointments = async (newAppointments: Appointment[]) => {
    await db.saveAppointments(newAppointments);
    setAppointments(newAppointments);
  };

  const navigate = (v: View, serviceId?: string) => {
    if (v.startsWith('admin-') && !isAdminLoggedIn && v !== 'admin-login') {
      setView('admin-login');
    } else {
      setView(v);
      if (serviceId) {
        setPreSelectedServiceIds(prev => prev.includes(serviceId) ? prev : [...prev, serviceId]);
      }
    }
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    db.setAdminAuthenticated(false);
    setIsAdminLoggedIn(false);
    navigate('home');
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">{t('common.loading.studio')}</p>
        </div>
      </div>
    );
  }

  const isAdminView = view.startsWith('admin-') && view !== 'admin-login';

  const AdminSidebarItem = ({ target, icon: Icon, label, count }: { target: View, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => navigate(target)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${view === target
        ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20 translate-x-1'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className={view === target ? 'animate-pulse' : ''} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${view === target ? 'bg-white text-rose-500' : 'bg-rose-100 text-rose-600'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {!isAdminView ? (
        <>
          <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
            ? 'py-3 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm'
            : view === 'home' ? 'py-6 bg-transparent' : 'py-3 bg-white border-b border-slate-100'
            }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div
                  className="flex items-center group cursor-pointer"
                  onClick={() => navigate('home')}
                >
                  <span className={`text-3xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                    {settings.logo}
                  </span>
                  <span className={`text-2xl font-serif font-bold ml-3 tracking-tight ${view === 'home' && !isScrolled ? 'text-white' : 'text-slate-900'
                    }`}>
                    {settings.salonName}
                  </span>
                </div>

                <div className="hidden md:flex space-x-10 items-center">
                  <button
                    onClick={() => navigate('home')}
                    className={`font-bold text-sm uppercase tracking-[0.2em] transition-all hover:opacity-100 ${view === 'home' && !isScrolled ? 'text-white opacity-80' : 'text-slate-600 opacity-70'
                      }`}
                  >
                    {t('nav.home')}
                  </button>
                  <button
                    onClick={() => navigate('booking')}
                    className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 ${view === 'home' && !isScrolled
                      ? 'bg-white text-slate-950 hover:bg-slate-50 shadow-white/10'
                      : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                      }`}
                  >
                    {t('nav.book')}
                  </button>
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`p-2 transition-colors flex items-center space-x-1 ${view === 'home' && !isScrolled ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    <Globe size={18} />
                    <span className="text-xs font-black uppercase">{language}</span>
                  </button>
                  <button
                    onClick={() => navigate('admin-login')}
                    className={`p-2 transition-colors ${view === 'home' && !isScrolled ? 'text-white/40 hover:text-white' : 'text-slate-300 hover:text-slate-600'
                      }`}
                  >
                    <Settings size={20} />
                  </button>
                </div>

                <div className="md:hidden flex items-center space-x-4">
                  <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className={`p-2 transition-colors flex items-center space-x-1 ${view === 'home' && !isScrolled ? 'text-white/80 hover:text-white' : 'text-slate-900'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{language}</span>
                  </button>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`p-2 transition-colors ${view === 'home' && !isScrolled ? 'text-white' : 'text-slate-900'
                      }`}
                  >
                    {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Overlay Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 top-0 bg-white z-[200] animate-fade-in-up flex flex-col pt-24 px-8">
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-900"><X size={32} /></button>
                <div className="space-y-4">
                  <button onClick={() => navigate('home')} className="w-full flex items-center space-x-5 p-6 bg-slate-50 text-slate-900 font-black text-lg rounded-3xl">
                    <HomeIcon size={24} className="text-rose-500" />
                    <span>{t('nav.home')}</span>
                  </button>
                  <button onClick={() => navigate('booking')} className="w-full flex items-center justify-between p-6 bg-rose-500 text-white font-black text-lg rounded-3xl shadow-2xl shadow-rose-500/30">
                    <div className="flex items-center space-x-5">
                      <Calendar size={24} />
                      <span>{t('nav.book')}</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                  <div className="h-px bg-slate-100 my-8"></div>
                  <button onClick={() => navigate('admin-login')} className="w-full flex items-center space-x-5 p-6 text-slate-400 font-bold">
                    <Settings size={24} />
                    <span>{t('nav.admin')}</span>
                  </button>
                </div>
              </div>
            )}
          </nav>

          <main className={`flex-1 ${view !== 'home' ? 'pt-24' : ''} relative`}>
            <div className={view === 'home' ? 'block' : 'hidden'}>
              <Home settings={settings} services={services} professionals={professionals} onBookNow={(id) => navigate('booking', id)} />
            </div>
            <div className={view === 'booking' ? 'block' : 'hidden'}>
              <Booking settings={settings} services={services} professionals={professionals} onComplete={handleUpdateAppointments} preSelectedServiceIds={preSelectedServiceIds} />
            </div>
            <div className={view === 'admin-login' ? 'block' : 'hidden'}>
              <AdminLogin onLogin={() => { db.setAdminAuthenticated(true); setIsAdminLoggedIn(true); }} />
            </div>
          </main>
        </>
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen">
          <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-100 p-8 space-y-2 overflow-y-auto h-screen sticky top-0 shadow-[20px_0_50px_rgba(0,0,0,0.02)]">
            <div className="mb-12 flex items-center space-x-3">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                <span className="text-2xl leading-none">{settings.logo}</span>
              </div>
              <div>
                <span className="block font-serif font-black text-xl text-slate-900">{t('admin.sidebar.admin')}</span>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{settings.salonName}</span>
              </div>
            </div>

            <AdminSidebarItem target="admin-dashboard" icon={LayoutDashboard} label={t('admin.sidebar.overview')} />
            <AdminSidebarItem target="admin-appointments" icon={Calendar} label={t('admin.sidebar.agenda')} />
            <AdminSidebarItem target="admin-history" icon={History} label={t('admin.sidebar.history')} />
            <AdminSidebarItem
              target="admin-reminders"
              icon={Bell}
              label={t('admin.sidebar.notifications')}
              count={appointments.filter(a => {
                const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                return a.date === tomorrowStr && !a.reminderSent && a.status === 'confirmed';
              }).length}
            />

            <div className="pt-10 pb-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4">{t('admin.sidebar.site_mgmt')}</div>
            <AdminSidebarItem target="admin-categories" icon={Tag} label={t('admin.sidebar.categories')} />
            <AdminSidebarItem target="admin-services" icon={Scissors} label={t('admin.sidebar.services')} />
            <AdminSidebarItem target="admin-professionals" icon={Users} label={t('admin.sidebar.team')} />
            <AdminSidebarItem target="admin-settings" icon={Settings} label={t('admin.sidebar.settings')} />

            <div className="pt-12 mt-auto">
              <button
                onClick={logout}
                className="group w-full flex items-center space-x-3 px-6 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">{t('admin.sidebar.logout')}</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 lg:bg-[#fafafa] min-h-screen overflow-x-hidden">
            <div className="max-w-7xl mx-auto p-6 lg:p-12 pb-32 lg:pb-12">
              {view === 'admin-dashboard' && <AdminDashboard appointments={appointments} services={services} professionals={professionals} />}
              {view === 'admin-categories' && <AdminCategories categories={categories} onUpdate={handleUpdateCategories} />}
              {view === 'admin-services' && <AdminServices services={services} categories={categories} onUpdate={handleUpdateServices} />}
              {view === 'admin-professionals' && <AdminProfessionals professionals={professionals} services={services} onUpdate={handleUpdateProfessionals} />}
              {view === 'admin-appointments' && <AdminAppointments appointments={appointments} services={services} professionals={professionals} onUpdate={handleUpdateAppointments} />}
              {view === 'admin-settings' && <AdminSettings settings={settings} onUpdate={handleUpdateSettings} />}
              {view === 'admin-reminders' && <AdminReminders appointments={appointments} services={services} settings={settings} onUpdate={handleUpdateAppointments} />}
              {view === 'admin-history' && <AdminHistory appointments={appointments} services={services} professionals={professionals} onUpdate={handleUpdateAppointments} />}
            </div>
          </main>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 glass z-50 flex justify-around p-3 border-t border-white/50 shadow-2xl">
            <button onClick={() => navigate('admin-dashboard')} className={`p-4 rounded-2xl transition-all ${view === 'admin-dashboard' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}><LayoutDashboard /></button>
            <button onClick={() => navigate('admin-appointments')} className={`p-4 rounded-2xl transition-all ${view === 'admin-appointments' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}><Calendar /></button>
            <button onClick={() => navigate('admin-settings')} className={`p-4 rounded-2xl transition-all ${view === 'admin-settings' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}><Settings /></button>
            <button onClick={logout} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-all"><LogOut /></button>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {preSelectedServiceIds.length > 0 && view !== 'booking' && !view.startsWith('admin') && (
        <button
          onClick={() => navigate('booking')}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 animate-bounce-subtle hover:bg-slate-800 transition-all border border-white/10"
        >
          <div className="relative">
            <Sparkles size={24} className="text-rose-400" />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
              {preSelectedServiceIds.length}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Finalizar</p>
            <p className="font-bold text-sm leading-none">Agendamento</p>
          </div>
          <ArrowRight size={20} className="text-rose-400" />
        </button>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
