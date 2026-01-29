
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  categoryId: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  services: string[]; // array of service IDs
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string; // ISO string (YYYY-MM-DD)
  time: string; // "HH:mm"
  status: 'pending' | 'confirmed' | 'cancelled';
  reminderSent?: boolean;
  createdAt: string;
}

export interface SiteSettings {
  salonName: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  servicesTitle: string;
  servicesSubtitle: string;
  professionalsTitle: string;
  professionalsSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  whatsappNumber: string;
  address: string;
  openingHours: {
    [key: string]: string;
  };
  primaryColor: string;
  accentColor: string;
  adminPassword?: string;
}

export type View = 'home' | 'booking' | 'admin-login' | 'admin-dashboard' | 'admin-services' | 'admin-professionals' | 'admin-appointments' | 'admin-settings' | 'admin-reminders' | 'admin-history' | 'admin-categories';
