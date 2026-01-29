
import * as React from 'react';
import { SiteSettings, Service, Professional } from '../types';
import { Clock, MapPin, Heart, Sparkles, Phone, ChevronRight, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface HomeProps {
  settings: SiteSettings;
  services: Service[];
  professionals: Professional[];
  onBookNow: (serviceId?: string) => void;
}

import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC<HomeProps> = ({ settings, services, professionals, onBookNow }) => {
  const { t, language } = useLanguage();
  // ... (cutting content for prompt efficiency as I know lines 28+)
  // Safety check for loading state
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const activeServices = services.filter(s => s.isActive).slice(0, 4);

  const scrollToServices = () => {
    const element = document.getElementById('services-section');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={settings.heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-white text-xs font-bold uppercase tracking-widest">{settings.salonName}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-[0.9] mb-8">
              {(language === 'en' ? t('dynamic.hero.title') : settings.heroTitle || 'Bem vindo').split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-rose-400 block mt-2" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed font-light max-w-xl">
              {language === 'en' ? t('dynamic.hero.subtitle') : settings.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookNow}
                className="group bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold px-10 py-5 rounded-2xl transition-all flex items-center justify-center shadow-2xl shadow-rose-500/20 active:scale-95"
              >
                {t('home.cta.book')}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToServices}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl border border-white/20 transition-all active:scale-95"
              >
                {t('home.cta.services')}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50 cursor-pointer" onClick={scrollToServices}>
          <span className="text-[10px] font-bold uppercase tracking-widest mb-2">{t('home.scroll')}</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* Brand Stats */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-start space-x-5">
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-500">
              <Sparkles size={28} />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2 text-slate-800">{t('home.stats.results.title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('home.stats.results.text')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-5">
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-600">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2 text-slate-800">{t('home.stats.products.title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('home.stats.products.text')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-5">
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-500">
              <Star size={28} />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2 text-slate-800">{t('home.stats.vip.title')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{t('home.stats.vip.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                {language === 'en' ? t('dynamic.services.title') : (settings.servicesTitle || t('home.services.title'))}
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                {language === 'en' ? t('dynamic.services.subtitle') : (settings.servicesSubtitle || t('home.services.subtitle'))}
              </p>
            </div>
            <button onClick={onBookNow} className="group flex items-center space-x-3 text-rose-500 font-black uppercase tracking-widest text-xs hover:text-rose-600 transition">
              <span>{t('home.cta.services')}</span>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-rose-100 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                <ChevronRight size={20} />
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeServices.map((service, idx) => (
              <div
                key={service.id}
                className={`group relative p-8 rounded-[2.5rem] border border-slate-100 hover:border-rose-200 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col h-full bg-white ${idx % 2 === 0 ? 'md:-translate-y-4' : 'md:translate-y-4'}`}
              >
                <div className="mb-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                    <Sparkles size={28} />
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-rose-600 transition-colors">
                  {language === 'en' ? t(`service.${service.id}.name` as any) : service.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">
                  {language === 'en' ? t(`service.${service.id}.desc` as any) : service.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <span className="text-2xl font-black text-slate-900">{service.price}$00</span>
                  <button
                    onClick={() => onBookNow(service.id)}
                    className="flex items-center space-x-2 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition group/btn"
                  >
                    <span>{t('nav.book')}</span>
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-500 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Especialistas</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight">
              {language === 'en' ? t('dynamic.team.title') : (settings.professionalsTitle || t('home.team.title'))}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
              {language === 'en' ? t('dynamic.team.subtitle') : (settings.professionalsSubtitle || t('home.team.subtitle'))}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {professionals.map((pro) => (
              <div key={pro.id} className="group relative">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 relative shadow-2xl">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <button onClick={onBookNow} className="w-full py-4 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity shadow-xl active:scale-95">
                      Agendar com {(pro.name || 'Profissional').split(' ')[0]}
                    </button>
                  </div>
                </div>
                <h4 className="text-2xl font-black mb-1 group-hover:text-rose-400 transition-colors text-white">{pro.name}</h4>
                <p className="text-slate-500 font-black text-slate-400 text-[10px] tracking-[0.2em] uppercase mb-4">{pro.role}</p>
                <p className="text-slate-400 text-sm italic line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  "{language === 'en' ? t(`pro.${pro.id}.bio` as any) : pro.bio}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-rose-50 rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <img
              src={settings.aboutImage}
              alt="Interior do Salão"
              className="relative z-10 rounded-[2.5rem] shadow-2xl w-full h-[650px] object-cover hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute -bottom-10 -right-10 z-20 bg-white p-8 rounded-[2rem] shadow-2xl max-w-[280px] hidden md:block">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-white" />)}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('home.reviews.clients')}</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight">"{t('home.reviews.quote')}"</p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
              </div>
            </div>
          </div>

          <div className="lg:pl-12">
            <span className="text-rose-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Nossa Essência</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-10 leading-[1] tracking-tight">
              {language === 'en' ? t('dynamic.about.title') : (settings.aboutTitle || t('home.about.title'))}
            </h2>
            <p className="text-slate-600 mb-12 text-lg leading-relaxed font-light">
              {language === 'en' ? t('dynamic.about.text') : settings.aboutText}
            </p>

            <div className="space-y-6 mb-16">
              <div className="flex items-center space-x-6 p-6 rounded-3xl border border-slate-50 hover:bg-slate-50 transition duration-300">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{t('home.footer.address')}</h4>
                  <p className="text-slate-500 text-sm font-medium">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 rounded-3xl border border-slate-50 hover:bg-slate-50 transition duration-300">
                <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{t('home.footer.hours')}</h4>
                  <p className="text-slate-500 text-sm font-medium">Consulte nosso cronograma.</p>
                </div>
              </div>
            </div>

            <button
              onClick={onBookNow}
              className="w-full sm:w-auto px-12 py-6 bg-slate-950 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-800 transition shadow-2xl shadow-slate-200 active:scale-95"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-32 pb-12 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 pb-24 border-b border-white/10 mb-20">
            <div>
              <div className="flex items-center space-x-3 mb-10">
                <span className="text-4xl">{settings.logo}</span>
                <span className="text-3xl font-serif font-bold tracking-tight">{settings.salonName}</span>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-md font-light mb-12">
                {settings.footerDescription || t('home.hero.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <h5 className="font-black text-white mb-8 text-[10px] uppercase tracking-[0.3em] opacity-40">Navegação</h5>
                <ul className="space-y-4">
                  <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-400 hover:text-white transition font-medium">{t('nav.home')}</button></li>
                  <li><button onClick={onBookNow} className="text-slate-400 hover:text-white transition font-medium">{t('nav.book')}</button></li>
                  <li><button onClick={scrollToServices} className="text-slate-400 hover:text-white transition font-medium">{t('home.cta.services')}</button></li>
                </ul>
              </div>
              <div>
                <h5 className="font-black text-white mb-8 text-[10px] uppercase tracking-[0.3em] opacity-40">{t('home.footer.contact')}</h5>
                <p className="text-slate-400 mb-6 leading-relaxed font-medium">{settings.address}</p>
                <p className="text-rose-400 font-black text-xl tracking-tight">{settings.whatsappNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>&copy; 2024 {settings.salonName}. {t('footer.rights')}</p>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white transition">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
