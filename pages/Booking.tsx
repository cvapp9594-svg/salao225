
import * as React from 'react';
import { useState, useMemo } from 'react';
import { SiteSettings, Service, Professional, Appointment } from '../types';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Clock, User, Phone, Sparkles } from 'lucide-react';

interface BookingProps {
  settings: SiteSettings;
  services: Service[];
  professionals: Professional[];
  onComplete: (appointments: Appointment[]) => void;
}

const Booking: React.FC<BookingProps> = ({ settings, services, professionals, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const activeServices = services.filter(s => s.isActive);
  
  const availableProfessionals = useMemo(() => {
    if (!selectedService) return [];
    return professionals.filter(p => p.services.includes(selectedService.id));
  }, [selectedService, professionals]);

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleFinish = () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime || !clientName || !clientPhone) return;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientName,
      clientPhone,
      serviceId: selectedService.id,
      professionalId: selectedProfessional.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Obter agendamentos atuais para manter o histórico
    const existingRaw = localStorage.getItem('glow_appointments');
    const existing: Appointment[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [...existing, newAppointment];
    
    // Notificar App.tsx para atualizar estado global
    onComplete(updated);

    const message = `Olá! Gostaria de confirmar meu agendamento:
📌 *Serviço:* ${selectedService.name}
👤 *Profissional:* ${selectedProfessional.name}
📅 *Data:* ${selectedDate}
⏰ *Horário:* ${selectedTime}
👤 *Nome:* ${clientName}

Aguardo confirmação! ✨`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodedMsg}`, '_blank');
    setStep(5);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[70vh]">
      <div className="mb-16">
        <div className="flex justify-between items-center max-w-sm mx-auto mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 ${
                step > i ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 
                step === i ? 'bg-rose-500 text-white shadow-xl shadow-rose-200 scale-110' : 
                'bg-slate-200 text-slate-500'
              }`}>
                {step > i ? <Check size={18} /> : i}
              </div>
              {i < 4 && (
                <div className={`absolute left-1/2 w-full h-1 top-5 -z-0 ${step > i ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">
            {step === 1 && "O que vamos fazer hoje?"}
            {step === 2 && "Quem irá te atender?"}
            {step === 3 && "Quando você prefere?"}
            {step === 4 && "Para finalizarmos..."}
            {step === 5 && "Solicitação Enviada!"}
          </h2>
          <p className="text-slate-500 font-medium">
            {step === 1 && "Escolha um de nossos serviços exclusivos."}
            {step === 2 && "Nossos especialistas estão prontos para você."}
            {step === 3 && "Selecione a data e o horário mais convenientes."}
            {step === 4 && "Preencha seus dados para contato rápido."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 transition-all duration-500 min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            {activeServices.map((service) => (
              <button
                key={service.id}
                onClick={() => { setSelectedService(service); setStep(2); }}
                className="group flex flex-col p-6 rounded-3xl border-2 border-slate-50 hover:border-rose-200 hover:bg-rose-50/20 transition-all text-left relative overflow-hidden bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-xl font-black text-slate-900">R$ {service.price}</span>
                </div>
                <h4 className="font-black text-lg text-slate-800 mb-1">{service.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock size={12} className="mr-1.5" />
                  {service.duration} MINUTOS
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up flex-1 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProfessionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => { setSelectedProfessional(pro); setStep(3); }}
                  className="p-6 rounded-[2.5rem] border-2 border-slate-50 hover:border-rose-200 flex flex-col items-center transition-all group bg-white hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative mb-6">
                    <img src={pro.avatar} alt={pro.name} className="w-28 h-28 rounded-full object-cover ring-8 ring-slate-50 group-hover:ring-rose-100 transition-all" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center border-4 border-white">
                      <Check size={14} />
                    </div>
                  </div>
                  <h4 className="font-black text-xl text-slate-900">{pro.name}</h4>
                  <p className="text-rose-500 text-sm font-bold uppercase tracking-widest mb-4">{pro.role}</p>
                  <p className="text-slate-400 text-xs text-center italic line-clamp-2">"{pro.bio}"</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-12 text-slate-400 hover:text-rose-500 flex items-center justify-center font-bold text-sm transition-colors uppercase tracking-widest">
              <ChevronLeft size={16} className="mr-2" /> Alterar Serviço
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-fade-in-up flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">1. Selecione a Data</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-6 rounded-3xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none bg-slate-50/30 text-lg font-bold text-slate-800"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">2. Horários Disponíveis</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-4 rounded-2xl border-2 font-black transition-all ${
                        selectedTime === time 
                        ? 'border-rose-500 bg-rose-500 text-white shadow-xl shadow-rose-200' 
                        : 'border-slate-50 text-slate-600 hover:border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-auto">
              <button onClick={() => setStep(2)} className="flex-1 py-6 text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition">Voltar</button>
              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(4)} 
                className={`flex-1 py-6 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl transition-all ${!selectedDate || !selectedTime ? 'bg-slate-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 active:scale-95'}`}
              >
                Próximo Passo
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in-up flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Ex: Maria Oliveira"
                    className="w-full pl-14 p-5 rounded-2xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none font-bold"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="tel" 
                    placeholder="Número com DDD"
                    className="w-full pl-14 p-5 rounded-2xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none font-bold"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="space-y-2 relative z-10 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Resumo da Reserva</span>
                <h4 className="text-2xl font-serif font-bold">{selectedService?.name}</h4>
                <p className="text-slate-400 text-sm font-medium">Com {selectedProfessional?.name} em {selectedDate} às {selectedTime}</p>
              </div>
              <div className="text-3xl font-black text-rose-400 relative z-10">R$ {selectedService?.price}</div>
            </div>

            <div className="flex space-x-4 mt-auto">
              <button onClick={() => setStep(3)} className="flex-1 py-6 text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-slate-50 rounded-2xl hover:bg-slate-50">Voltar</button>
              <button 
                onClick={handleFinish}
                disabled={!clientName || !clientPhone}
                className={`flex-1 py-6 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl transition-all ${!clientName || !clientPhone ? 'bg-slate-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 active:scale-95'}`}
              >
                Confirmar no WhatsApp
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-12 animate-fade-in-up flex-1 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <Check size={48} />
              </div>
            </div>
            <h3 className="text-4xl font-serif font-black mb-4 text-slate-900">Maravilha, {clientName.split(' ')[0]}!</h3>
            <p className="text-slate-500 mb-12 max-w-md mx-auto leading-relaxed text-lg">
              Sua solicitação foi enviada. Agora basta aguardar nossa equipe confirmar os detalhes finais pelo WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={resetBooking}
                className="px-12 py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition shadow-xl shadow-rose-500/20 active:scale-95"
              >
                Novo Agendamento
              </button>
              <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                className="px-12 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
