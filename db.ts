
import { Service, Professional, Appointment, SiteSettings, Category } from './types';

const STORAGE_KEYS = {
  SERVICES: 'glow_services',
  PROFESSIONALS: 'glow_professionals',
  APPOINTMENTS: 'glow_appointments',
  SETTINGS: 'glow_settings',
  ADMIN_AUTH: 'glow_admin_auth',
  CATEGORIES: 'glow_categories',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Cabelo' },
  { id: 'cat2', name: 'Unhas' },
  { id: 'cat3', name: 'Maquiagem' },
];

const DEFAULT_SETTINGS: SiteSettings = {
  salonName: 'Glow Beauty Studio',
  logo: '✨',
  heroTitle: 'Realce sua Beleza Natural',
  heroSubtitle: 'Agende seu momento de cuidado com os melhores profissionais da região.',
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
  servicesTitle: 'Serviços Exclusivos',
  servicesSubtitle: 'Oferecemos o que há de melhor em tratamentos de beleza, com produtos premium e técnicas modernas.',
  professionalsTitle: 'Nossa Equipe',
  professionalsSubtitle: 'Especialistas apaixonados por elevar sua autoestima e realçar sua beleza única.',
  aboutTitle: 'Conforto e Estilo em cada detalhe',
  aboutText: 'Focamos na sua experiência completa, desde o café até o resultado final. Nossa missão é elevar sua autoestima.',
  aboutImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
  whatsappNumber: '5511999999999',
  address: 'Rua das Flores, 123 - Centro, São Paulo',
  openingHours: {
    'Segunda - Sexta': '09:00 - 19:00',
    'Sábado': '09:00 - 17:00',
    'Domingo': 'Fechado',
  },
  primaryColor: 'rose-500',
  accentColor: 'rose-100',
};

const DEFAULT_SERVICES: Service[] = [
  { id: '1', name: 'Corte Feminino', description: 'Corte moderno com lavagem inclusa', price: 120, duration: 60, categoryId: 'cat1', isActive: true },
  { id: '2', name: 'Manicure', description: 'Cutilagem e esmaltação tradicional', price: 45, duration: 40, categoryId: 'cat2', isActive: true },
];

const DEFAULT_PROFESSIONALS: Professional[] = [
  { id: 'p1', name: 'Ana Silva', role: 'Hair Stylist', avatar: 'https://i.pravatar.cc/150?u=ana', bio: 'Especialista em cortes e coloração.', services: ['1'] },
];

export const db = {
  getServices: (): Service[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : DEFAULT_SERVICES;
    } catch { return DEFAULT_SERVICES; }
  },
  saveServices: (services: Service[]) => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  },
  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch { return DEFAULT_CATEGORIES; }
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  getProfessionals: (): Professional[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFESSIONALS);
      return data ? JSON.parse(data) : DEFAULT_PROFESSIONALS;
    } catch { return DEFAULT_PROFESSIONALS; }
  },
  saveProfessionals: (professionals: Professional[]) => {
    localStorage.setItem(STORAGE_KEYS.PROFESSIONALS, JSON.stringify(professionals));
  },
  getAppointments: (): Appointment[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler agendamentos:", e);
      return [];
    }
  },
  saveAppointments: (appointments: Appointment[]) => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },
  getSettings: (): SiteSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  setAdminAuthenticated: (value: boolean) => {
    if (value) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },
};
