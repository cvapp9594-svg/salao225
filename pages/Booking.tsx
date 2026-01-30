
import * as React from 'react';
import { useState, useMemo } from 'react';
import { SiteSettings, Service, Professional, Appointment } from '../types';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Clock, User, Phone, Sparkles } from 'lucide-react';

interface BookingProps {
  settings: SiteSettings;
  services: Service[];
  professionals: Professional[];
  preSelectedServiceIds?: string[];
  onComplete: (appointments: Appointment[]) => void;
}

import { useLanguage } from '../contexts/LanguageContext';

const Booking: React.FC<BookingProps> = ({ settings, services, professionals, preSelectedServiceIds = [], onComplete }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1); // Always start at Step 1 to allow cart review/multi-selection
  const [selectedServices, setSelectedServices] = useState<Service[]>(
    services.filter(s => preSelectedServiceIds.includes(s.id))
  );
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Sync selectedServices when props change (e.g. added from Home page)
  React.useEffect(() => {
    const currentIds = selectedServices.map(s => s.id);
    const hasChanged = preSelectedServiceIds.length !== currentIds.length ||
      preSelectedServiceIds.some(id => !currentIds.includes(id));

    if (hasChanged && services.length > 0) {
      const updated = services.filter(s => preSelectedServiceIds.includes(s.id));
      setSelectedServices(updated);
    }
  }, [preSelectedServiceIds, services]);

  const activeServices = services.filter(s => s.isActive);

  const availableProfessionals = useMemo(() => {
    // Show ALL active professionals as requested by the user
    return professionals.filter(p => p.isActive !== false);
  }, [professionals]);

  const timeSlots = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const totalPrice = selectedServices.reduce((acc, s) => acc + (s.price || 0), 0);

  const handleFinish = () => {
    if (selectedServices.length === 0 || !clientName || !clientPhone) return;

    // Create a generic record for each service
    const newAppointments: Appointment[] = selectedServices.map(service => ({
      id: Math.random().toString(36).substr(2, 9),
      clientName,
      clientPhone,
      serviceId: service.id,
      professionalId: selectedProfessional?.id || '',
      date: selectedDate || 'A definir',
      time: selectedTime || 'A definir',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));

    // Save to local for analytics/admin view
    const existingRaw = localStorage.getItem('glow_appointments');
    const existing: Appointment[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [...existing, ...newAppointments];
    onComplete(updated);

    // Dynamic message (Novo Pedido Format)
    const pedidoNum = Math.floor(10000 + Math.random() * 90000);
    let message = `🧾 *NOVO PEDIDO*\n`;
    message += `📦 Pedido Nº: ${pedidoNum}\n`;
    message += `👤 Cliente: ${clientName}\n`;
    message += `📱 WhatsApp: ${clientPhone}\n`;
    if (selectedProfessional) message += `👤 Profissional: ${selectedProfessional.name}\n`;
    if (selectedDate) message += `📅 Data: ${selectedDate}\n`;
    if (selectedTime) message += `⏰ Horário: ${selectedTime}\n`;

    message += `\n🛒 Itens:\n`;
    selectedServices.forEach(s => {
      message += `- ${s.name} x1 (${s.price}$00)\n`;
    });

    message += `\n💰 Total: ${totalPrice}$00`;

    const encodedMsg = encodeURIComponent(message);
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');

    // Open WhatsApp BEFORE async operations to avoid popup blockers
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMsg}`, '_blank');

    onComplete(updated);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[70vh]">
      <div className="mb-16">
        <div className="flex justify-between items-center max-w-sm mx-auto mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 ${step > i ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                step === i ? 'bg-rose-500 text-white shadow-xl shadow-rose-200 scale-110' :
                  'bg-slate-200 text-slate-500'
                }`}>
                {step > i ? <Check size={18} /> : i}
              </div>
              {i < 2 && (
                <div className={`absolute left-1/2 w-full h-1 top-5 -z-0 ${step > i ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">
            {step === 1 && t('booking.steps.service')}
            {step === 2 && t('booking.steps.confirm')}
            {step === 3 && t('booking.success.title')}
          </h2>
          <p className="text-slate-500 font-medium">
            {step === 1 && t('booking.step1.sub')}
            {step === 2 && 'Preencha seus dados para finalizarmos via WhatsApp.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 transition-all duration-500 min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.length > 0 ? (
                activeServices.map((service) => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`group flex flex-col p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden bg-white shadow-sm ${isSelected ? 'border-rose-500 bg-rose-50/20' : 'border-slate-50 hover:border-rose-200 hover:bg-rose-50/20'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-rose-500 group-hover:text-white'
                          }`}>
                          <Sparkles size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-900">{service.price}$00</span>
                      </div>
                      <h4 className="font-black text-lg text-slate-800 mb-1">
                        {language === 'en' ? t(`service.${service.id}.name` as any) : service.name}
                      </h4>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                        {language === 'en' ? t(`service.${service.id}.desc` as any) : service.description}
                      </p>
                      <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <Clock size={12} className="mr-1.5" />
                        {service.duration} MIN
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-rose-500">
                          <Check size={24} />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{t('booking.empty.title')}</h3>
                  <p className="text-slate-500">{t('booking.empty.message')}</p>
                </div>
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in-up">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/20">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black">{selectedServices.length} {selectedServices.length === 1 ? 'Serviço' : 'Serviços'} Selecionados</h4>
                    <p className="text-slate-400 font-medium">Total: {totalPrice}$00</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full md:w-auto px-12 py-5 bg-rose-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center space-x-3"
                >
                  <span>{t('booking.button.continue')}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('booking.input.name')} *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    className="w-full pl-12 p-4 rounded-xl border-2 border-slate-50 focus:border-rose-300 focus:outline-none font-bold"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('booking.input.phone')} *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    className="w-full pl-12 p-4 rounded-xl border-2 border-slate-50 focus:border-rose-300 focus:outline-none font-bold"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Profissional (Opcional)</label>
                <select
                  className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-rose-300 focus:outline-none font-bold bg-white"
                  value={selectedProfessional?.id || ''}
                  onChange={e => setSelectedProfessional(professionals.find(p => p.id === e.target.value) || null)}
                >
                  <option value="">Qualquer profissional</option>
                  {availableProfessionals.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 col-span-full">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Previsão de Data e Horário (Opcional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Escolha a Data</label>
                    <input
                      type="date"
                      className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-rose-300 focus:outline-none font-bold text-sm"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Horário Personalizado</label>
                    <input
                      type="text"
                      placeholder="Ex: 08:45 ou 14:15"
                      className="w-full p-4 rounded-xl border-2 border-slate-50 focus:border-rose-300 focus:outline-none font-bold text-sm"
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Ou selecione um horário da tabela:</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bg-slate-50/50 p-4 rounded-3xl border-2 border-slate-50">
                    {timeSlots.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 px-1 rounded-lg text-xs font-black transition-all ${selectedTime === t
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                            : 'bg-white text-slate-600 hover:border-rose-300 border border-transparent'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white flex flex-col gap-6 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">{t('booking.cart.title')}</span>
                <div className="mt-4 space-y-3">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                        <span className="font-bold">{s.name}</span>
                      </div>
                      <span className="font-black text-rose-400">{s.price}$00</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/10 my-6"></div>
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest text-xs text-slate-400">{t('booking.cart.total')}</span>
                  <span className="text-3xl font-black text-rose-400">{totalPrice}$00</span>
                </div>
                <p className="text-slate-400 text-xs mt-6">{t('booking.total')}. O agendamento final será concluído no WhatsApp.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-slate-50 rounded-2xl hover:bg-slate-50">Voltar</button>
              <button
                onClick={handleFinish}
                disabled={!clientName || !clientPhone}
                className={`flex-1 py-5 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3 ${!clientName || !clientPhone ? 'bg-slate-200' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'}`}
              >
                <Phone size={18} />
                <span>Agendar via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-20 animate-fade-in-up flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
              <Check size={48} />
            </div>
            <h3 className="text-4xl font-serif font-black mb-4 text-slate-900">{t('booking.success.whatsapp_title')}</h3>
            <p className="text-slate-500 mb-12 max-w-md mx-auto leading-relaxed text-lg">
              {t('booking.success.whatsapp_message')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { setSelectedServices([]); setStep(1); }}
                className="px-10 py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/20"
              >
                {t('booking.success.button')}
              </button>
              <button
                onClick={() => { setSelectedServices([]); window.location.href = '/'; }}
                className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                {t('nav.home')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
