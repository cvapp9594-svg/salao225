
import * as React from 'react';
import { useState, useRef } from 'react';
import { SiteSettings } from '../types';
import { Save, Image as ImageIcon, Phone, MapPin, Clock, Layout, Camera, Type, Palette, Check, Scissors, Users, Info, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdate: (settings: SiteSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdate }) => {
  const { t } = useLanguage();
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localSettings);
    setSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, [target]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpeningHoursChange = (day: string, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
    <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
      <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">{t('admin.settings.title')}</h1>
          <p className="text-slate-500">{t('admin.settings.subtitle')}</p>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <Check size={18} />
            <span>{t('admin.settings.saved')}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Identidade e Contato */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Info}
            title={t('admin.settings.info.title')}
            subtitle={t('admin.settings.info.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.info.name')}</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.salonName}
                onChange={e => setLocalSettings({ ...localSettings, salonName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.info.logo')}</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.logo}
                onChange={e => setLocalSettings({ ...localSettings, logo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.info.whatsapp')}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-white">
                  <Phone size={14} />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-bold text-emerald-600"
                  value={localSettings.whatsappNumber}
                  onChange={e => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                  placeholder="Ex: 2389999999"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Este número será usado para todos os agendamentos via WhatsApp.</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.info.address')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={localSettings.address}
                  onChange={e => setLocalSettings({ ...localSettings, address: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Layout}
            title={t('admin.settings.hero.title')}
            subtitle={t('admin.settings.hero.sub')}
          />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.hero.impact')}</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                    value={localSettings.heroTitle}
                    onChange={e => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.hero.subtitle')}</label>
                  <textarea
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-24 resize-none"
                    value={localSettings.heroSubtitle}
                    onChange={e => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t('admin.settings.hero.image')}</label>
                <div
                  className="relative group cursor-pointer h-44 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200"
                  onClick={() => heroFileRef.current?.click()}
                >
                  <img src={localSettings.heroImage} className="w-full h-full object-cover group-hover:brightness-50 transition" />
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                    <Camera size={32} />
                  </div>
                  <input type="file" ref={heroFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'heroImage')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Serviços e Equipe */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Type}
            title={t('admin.settings.sections.title')}
            subtitle={t('admin.settings.sections.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center text-rose-500 mb-2 font-bold text-xs uppercase tracking-wider">
                <Scissors size={14} className="mr-2" /> Seção de Serviços
              </div>
              <input
                type="text" placeholder="Título"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none mb-2"
                value={localSettings.servicesTitle}
                onChange={e => setLocalSettings({ ...localSettings, servicesTitle: e.target.value })}
              />
              <textarea
                placeholder="Breve descrição"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-20 resize-none text-sm"
                value={localSettings.servicesSubtitle}
                onChange={e => setLocalSettings({ ...localSettings, servicesSubtitle: e.target.value })}
              />
            </div>
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center text-rose-500 mb-2 font-bold text-xs uppercase tracking-wider">
                <Users size={14} className="mr-2" /> Seção de Equipe
              </div>
              <input
                type="text" placeholder="Título"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none mb-2"
                value={localSettings.professionalsTitle}
                onChange={e => setLocalSettings({ ...localSettings, professionalsTitle: e.target.value })}
              />
              <textarea
                placeholder="Breve descrição"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-20 resize-none text-sm"
                value={localSettings.professionalsSubtitle}
                onChange={e => setLocalSettings({ ...localSettings, professionalsSubtitle: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Sobre Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={ImageIcon}
            title={t('admin.settings.about.title')}
            subtitle={t('admin.settings.about.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.hero.impact')}</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={localSettings.aboutTitle}
                  onChange={e => setLocalSettings({ ...localSettings, aboutTitle: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Texto</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-44 resize-none"
                  value={localSettings.aboutText}
                  onChange={e => setLocalSettings({ ...localSettings, aboutText: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Foto do Ambiente</label>
              <div
                className="relative group cursor-pointer h-full min-h-[250px] rounded-3xl overflow-hidden border-2 border-dashed border-slate-200"
                onClick={() => aboutFileRef.current?.click()}
              >
                <img src={localSettings.aboutImage} className="w-full h-full object-cover group-hover:brightness-50 transition" />
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  <Camera size={32} />
                </div>
                <input type="file" ref={aboutFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'aboutImage')} />
              </div>
            </div>
          </div>
        </div>

        {/* Horários */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Clock}
            title={t('admin.settings.hours.title')}
            subtitle={t('admin.settings.hours.sub')}
          />
          <div className="space-y-4">
            {Object.entries(localSettings.openingHours).map(([day, hours]) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-700 min-w-[150px]">{day}</span>
                <input
                  type="text"
                  className="flex-1 p-2 rounded-lg border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={hours}
                  onChange={e => handleOpeningHoursChange(day, e.target.value)}
                  placeholder="Ex: 09:00 - 19:00 ou Fechado"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cores e Estilo */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Palette}
            title={t('admin.settings.theme.title')}
            subtitle={t('admin.settings.theme.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.settings.theme.primary')}</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="w-12 h-12 rounded-lg border-0 cursor-pointer p-0 overflow-hidden"
                  value={localSettings.primaryColor}
                  onChange={e => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                />
                <input
                  type="text"
                  className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-mono uppercase text-sm"
                  value={localSettings.primaryColor}
                  onChange={e => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.settings.theme.accent')}</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="w-12 h-12 rounded-lg border-0 cursor-pointer p-0 overflow-hidden"
                  value={localSettings.accentColor}
                  onChange={e => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                />
                <input
                  type="text"
                  className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-mono uppercase text-sm"
                  value={localSettings.accentColor}
                  onChange={e => setLocalSettings({ ...localSettings, accentColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Métricas e Diferenciais */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Palette}
            title={t('admin.settings.stats.title')}
            subtitle={t('admin.settings.stats.sub')}
          />
          <div className="space-y-8">
            <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
              <span className="text-[10px] font-black uppercase text-rose-500">Box 1 - Resultados</span>
              <input
                type="text" placeholder="Título (Ex: Resultados Surpreendentes)"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-bold"
                value={localSettings.statsResultsTitle}
                onChange={e => setLocalSettings({ ...localSettings, statsResultsTitle: e.target.value })}
              />
              <textarea
                placeholder="Descrição curta"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-20 resize-none text-sm"
                value={localSettings.statsResultsText}
                onChange={e => setLocalSettings({ ...localSettings, statsResultsText: e.target.value })}
              />
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
              <span className="text-[10px] font-black uppercase text-rose-500">Box 2 - Produtos</span>
              <input
                type="text" placeholder="Título (Ex: Produtos Premium)"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-bold"
                value={localSettings.statsProductsTitle}
                onChange={e => setLocalSettings({ ...localSettings, statsProductsTitle: e.target.value })}
              />
              <textarea
                placeholder="Descrição curta"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-20 resize-none text-sm"
                value={localSettings.statsProductsText}
                onChange={e => setLocalSettings({ ...localSettings, statsProductsText: e.target.value })}
              />
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
              <span className="text-[10px] font-black uppercase text-rose-500">Box 3 - Atendimento</span>
              <input
                type="text" placeholder="Título (Ex: Atendimento VIP)"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none font-bold"
                value={localSettings.statsVipTitle}
                onChange={e => setLocalSettings({ ...localSettings, statsVipTitle: e.target.value })}
              />
              <textarea
                placeholder="Descrição curta"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-20 resize-none text-sm"
                value={localSettings.statsVipText}
                onChange={e => setLocalSettings({ ...localSettings, statsVipText: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Depoimentos e Clientes */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Users}
            title={t('admin.settings.reviews.title')}
            subtitle={t('admin.settings.reviews.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Frase de Destaque</label>
              <textarea
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-32 resize-none"
                value={localSettings.reviewsQuote}
                onChange={e => setLocalSettings({ ...localSettings, reviewsQuote: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Métrica de Clientes</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.reviewsClients}
                onChange={e => setLocalSettings({ ...localSettings, reviewsClients: e.target.value })}
                placeholder="Ex: +500 Clientes Satisfeitas"
              />
            </div>
          </div>
        </div>

        {/* Etiquetas Auxiliares */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Type}
            title={t('admin.settings.labels.title')}
            subtitle={t('admin.settings.labels.sub')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Acima da Equipe</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.teamLabel}
                onChange={e => setLocalSettings({ ...localSettings, teamLabel: e.target.value })}
                placeholder="Ex: Especialistas"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Acima do Sobre</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.aboutLabel}
                onChange={e => setLocalSettings({ ...localSettings, aboutLabel: e.target.value })}
                placeholder="Ex: Nossa Essência"
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Layout}
            title={t('admin.settings.footer.title')}
            subtitle={t('admin.settings.footer.sub')}
          />
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.settings.footer.desc')}</label>
              <textarea
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-32 resize-none"
                value={localSettings.footerDescription}
                onChange={e => setLocalSettings({ ...localSettings, footerDescription: e.target.value })}
                placeholder={t('home.hero.subtitle')}
              />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Lock}
            title={t('admin.settings.security.title')}
            subtitle={t('admin.settings.security.sub')}
          />
          <div className="space-y-4">
            <div className="md:w-1/2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.settings.security.pass')}</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-4 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-300 focus:outline-none transition-all duration-300"
                  value={localSettings.adminPassword || ''}
                  onChange={e => setLocalSettings({ ...localSettings, adminPassword: e.target.value })}
                  placeholder={t('admin.settings.security.pass_placeholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-medium ml-1">
                {t('admin.settings.security.pass_sub')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            className="bg-slate-900 text-white font-bold px-12 py-5 rounded-3xl hover:bg-slate-800 transition shadow-2xl shadow-slate-200 flex items-center transform active:scale-95 group"
          >
            <div className="p-2 bg-white/10 rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <Save size={20} />
            </div>
            {t('admin.settings.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
