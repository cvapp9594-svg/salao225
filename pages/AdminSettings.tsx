
import * as React from 'react';
import { useState, useRef } from 'react';
import { SiteSettings } from '../types';
import { Save, Image as ImageIcon, Phone, MapPin, Clock, Layout, Camera, Type, Palette, Check, Scissors, Users, Info, Lock } from 'lucide-react';

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdate: (settings: SiteSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);
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
          <h1 className="text-3xl font-serif font-bold text-slate-800">Ajustes do Site</h1>
          <p className="text-slate-500">Personalize a identidade visual e os textos do seu salão.</p>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <Check size={18} />
            <span>Configurações Salvas!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Identidade e Contato */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Info}
            title="Informações Gerais"
            subtitle="Configurações básicas de contato e identidade."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Nome do Salão</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.salonName}
                onChange={e => setLocalSettings({ ...localSettings, salonName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Emoji/Logo</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.logo}
                onChange={e => setLocalSettings({ ...localSettings, logo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">WhatsApp (Apenas Números)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={localSettings.whatsappNumber}
                  onChange={e => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Endereço Completo</label>
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
            title="Banner Principal (Hero)"
            subtitle="A primeira impressão dos seus clientes ao abrir o site."
          />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Título de Impacto</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                    value={localSettings.heroTitle}
                    onChange={e => setLocalSettings({ ...localSettings, heroTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Subtítulo</label>
                  <textarea
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-24 resize-none"
                    value={localSettings.heroSubtitle}
                    onChange={e => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Imagem de Fundo</label>
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
            title="Títulos das Seções"
            subtitle="Customize os cabeçalhos das seções de serviços e equipe."
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
            title="Seção 'Sobre'"
            subtitle="Conte a história do seu salão e mostre fotos do ambiente."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Título da Seção</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={localSettings.aboutTitle}
                  onChange={e => setLocalSettings({ ...localSettings, aboutTitle: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Texto 'Sobre'</label>
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
            title="Horários de Funcionamento"
            subtitle="Exiba quando o salão está aberto para agendamentos."
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

        {/* Segurança */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <SectionHeader
            icon={Lock}
            title="Segurança"
            subtitle="Gerencie o acesso ao painel administrativo."
          />
          <div className="space-y-4">
            <div className="md:w-1/2 space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Senha do Administrador</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                value={localSettings.adminPassword || ''}
                onChange={e => setLocalSettings({ ...localSettings, adminPassword: e.target.value })}
                placeholder="Nova senha"
              />
              <p className="text-[10px] text-slate-400 mt-1">Deixe em branco para manter a senha atual ou digite para alterar.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            className="bg-slate-900 text-white font-bold px-12 py-5 rounded-2xl hover:bg-slate-800 transition shadow-2xl shadow-slate-200 flex items-center transform active:scale-95"
          >
            <Save size={24} className="mr-3" />
            Salvar Todas as Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
