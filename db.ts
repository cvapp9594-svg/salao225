
import { createClient } from '@supabase/supabase-js';
import { Service, Professional, Appointment, SiteSettings, Category } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const STORAGE_KEYS = {
  ADMIN_AUTH: 'glow_admin_auth',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Cabelo' },
  { id: 'cat2', name: 'Unhas' },
  { id: 'cat3', name: 'Maquiagem' },
];

const DEFAULT_SERVICES: Service[] = [
  { id: 'srv1', name: 'Corte e Escova', description: 'Corte personalizado e finalização perfeita.', price: 3000, duration: 60, categoryId: 'cat1', isActive: true },
  { id: 'srv2', name: 'Manicure Completa', description: 'Cuidado completo para suas mãos.', price: 1000, duration: 45, categoryId: 'cat2', isActive: true },
  { id: 'srv3', name: 'Maquiagem Social', description: 'Para eventos especiais e festas.', price: 4000, duration: 60, categoryId: 'cat3', isActive: true },
  { id: 'srv4', name: 'Hidratação Profunda', description: 'Recupere o brilho e maciez dos fios.', price: 2400, duration: 45, categoryId: 'cat1', isActive: true },
];

const DEFAULT_PROFESSIONALS: Professional[] = [
  { id: 'pro1', name: 'Ana Silva', role: 'Hair Stylist', avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400', bio: 'Especialista em cortes modernos e coloração.', services: ['srv1', 'srv4'] },
  { id: 'pro2', name: 'Julia Costa', role: 'Nail Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', bio: 'Apaixonada por unhas perfeitas e arte.', services: ['srv2'] },
  { id: 'pro3', name: 'Mariana Santos', role: 'Makeup Artist', avatar: 'https://images.unsplash.com/photo-1588731238444-43836afd7963?auto=format&fit=crop&q=80&w=400', bio: 'Realçando sua beleza natural para qualquer ocasião.', services: ['srv3'] },
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
  primaryColor: '#f43f5e',
  accentColor: '#fff1f2',
  footerDescription: 'Agende seu momento de cuidado com os melhores profissionais da região.',
  statsResultsTitle: 'Resultados Surpreendentes',
  statsResultsText: 'Técnicas avançadas para realçar sua beleza natural.',
  statsProductsTitle: 'Produtos Premium',
  statsProductsText: 'Utilizamos apenas as melhores marcas do mercado mundial.',
  statsVipTitle: 'Atendimento VIP',
  statsVipText: 'Experiência personalizada em um ambiente acolhedor.',
  reviewsQuote: 'O melhor atendimento que já recebi. Saí me sentindo renovada e com a autoestima lá no alto!',
  reviewsClients: 'Mais de 500 clientes satisfeitas',
  teamLabel: 'Especialistas',
  aboutLabel: 'Nossa Essência',
  adminPassword: 'adminsalao'
};

export const db = {
  getServices: async (): Promise<Service[]> => {
    const { data, error } = await supabase.from('services').select('*').order('name');
    if (error || !data || data.length === 0) return DEFAULT_SERVICES;
    return data.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration,
      categoryId: s.category_id,
      isActive: s.is_active
    }));
  },
  saveServices: async (services: Service[]) => {
    for (const s of services) {
      await supabase.from('services').upsert({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
        category_id: s.categoryId,
        is_active: s.isActive
      });
    }
  },
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;
    return data;
  },
  saveCategories: async (categories: Category[]) => {
    for (const c of categories) {
      await supabase.from('categories').upsert(c);
    }
  },
  getProfessionals: async (): Promise<Professional[]> => {
    const { data, error } = await supabase.from('professionals').select('*').order('name');
    if (error || !data || data.length === 0) return DEFAULT_PROFESSIONALS;
    return data;
  },
  saveProfessionals: async (professionals: Professional[]) => {
    for (const p of professionals) {
      await supabase.from('professionals').upsert(p);
    }
  },
  getAppointments: async (): Promise<Appointment[]> => {
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(a => ({
      id: a.id,
      clientName: a.client_name,
      clientPhone: a.client_phone,
      serviceId: a.service_id,
      professionalId: a.professional_id,
      date: a.date,
      time: a.time,
      status: a.status,
      reminderSent: a.reminder_sent,
      createdAt: a.created_at
    }));
  },
  saveAppointments: async (appointments: Appointment[]) => {
    for (const a of appointments) {
      await supabase.from('appointments').upsert({
        id: a.id,
        client_name: a.clientName,
        client_phone: a.clientPhone,
        service_id: a.serviceId,
        professional_id: a.professionalId,
        date: a.date,
        time: a.time,
        status: a.status,
        reminder_sent: a.reminderSent,
        created_at: a.createdAt
      });
    }
  },
  getSettings: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 'main').single();
    if (error || !data) return DEFAULT_SETTINGS;
    return {
      salonName: data.salon_name,
      logo: data.logo,
      heroTitle: data.hero_title || '',
      heroSubtitle: data.hero_subtitle,
      heroImage: data.hero_image,
      servicesTitle: data.services_title,
      servicesSubtitle: data.services_subtitle,
      professionalsTitle: data.professionals_title,
      professionalsSubtitle: data.professionals_subtitle,
      aboutTitle: data.about_title,
      aboutText: data.about_text,
      aboutImage: data.about_image,
      whatsappNumber: data.whatsapp_number,
      address: data.address,
      openingHours: data.opening_hours,
      primaryColor: data.primary_color || '#f43f5e',
      accentColor: data.accent_color || '#fff1f2',
      footerDescription: data.footer_description || '',
      statsResultsTitle: data.stats_results_title || DEFAULT_SETTINGS.statsResultsTitle,
      statsResultsText: data.stats_results_text || DEFAULT_SETTINGS.statsResultsText,
      statsProductsTitle: data.stats_products_title || DEFAULT_SETTINGS.statsProductsTitle,
      statsProductsText: data.stats_products_text || DEFAULT_SETTINGS.statsProductsText,
      statsVipTitle: data.stats_vip_title || DEFAULT_SETTINGS.statsVipTitle,
      statsVipText: data.stats_vip_text || DEFAULT_SETTINGS.statsVipText,
      reviewsQuote: data.reviews_quote || DEFAULT_SETTINGS.reviewsQuote,
      reviewsClients: data.reviews_clients || DEFAULT_SETTINGS.reviewsClients,
      teamLabel: data.team_label || DEFAULT_SETTINGS.teamLabel,
      aboutLabel: data.about_label || DEFAULT_SETTINGS.aboutLabel,
      adminPassword: data.admin_password || 'adminsalao'
    };
  },
  saveSettings: async (settings: SiteSettings) => {
    await supabase.from('settings').upsert({
      id: 'main',
      salon_name: settings.salonName,
      logo: settings.logo,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      hero_image: settings.heroImage,
      services_title: settings.servicesTitle,
      services_subtitle: settings.servicesSubtitle,
      professionals_title: settings.professionalsTitle,
      professionals_subtitle: settings.professionalsSubtitle,
      about_title: settings.aboutTitle,
      about_text: settings.aboutText,
      about_image: settings.aboutImage,
      whatsapp_number: settings.whatsappNumber,
      address: settings.address,
      opening_hours: settings.openingHours,
      primary_color: settings.primaryColor,
      accent_color: settings.accentColor,
      footer_description: settings.footerDescription,
      stats_results_title: settings.statsResultsTitle,
      stats_results_text: settings.statsResultsText,
      stats_products_title: settings.statsProductsTitle,
      stats_products_text: settings.statsProductsText,
      stats_vip_title: settings.statsVipTitle,
      stats_vip_text: settings.statsVipText,
      reviews_quote: settings.reviewsQuote,
      reviews_clients: settings.reviewsClients,
      team_label: settings.teamLabel,
      about_label: settings.aboutLabel,
      admin_password: settings.adminPassword
    });
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
