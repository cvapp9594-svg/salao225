import * as React from 'react';
import { Appointment, Service, SiteSettings } from '../types';
import { MessageSquare, Bell, Check, Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminRemindersProps {
  appointments: Appointment[];
  services: Service[];
  settings: SiteSettings;
  onUpdate: (appointments: Appointment[]) => void;
}

const AdminReminders: React.FC<AdminRemindersProps> = ({ appointments, services, settings, onUpdate }) => {
  const { t } = useLanguage();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const upcomingAppointments = appointments.filter(a => a.date === tomorrowStr && a.status === 'confirmed');

  const sendReminder = (app: Appointment) => {
    const srv = services.find(s => s.id === app.serviceId);

    // Get raw message template from translations
    let message = t('admin.reminders.whatsapp.msg')
      .replace('{name}', app.clientName)
      .replace('{date}', app.date)
      .replace('{time}', app.time)
      .replace('{service}', srv?.name || 'Beleza')
      .replace('{salon}', settings.salonName);

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${app.clientPhone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank');

    // Marcar como lembrete enviado
    const updated = appointments.map(a => a.id === app.id ? { ...a, reminderSent: true } : a);
    onUpdate(updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-800 flex items-center">
          <Bell className="mr-3 text-rose-500" size={32} /> {t('admin.reminders.title')}
        </h1>
        <p className="text-slate-500">{t('admin.reminders.subtitle').replace('{date}', tomorrowStr)}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(app => {
            const srv = services.find(s => s.id === app.serviceId);
            return (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-rose-200 transition-all">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className={`p-4 rounded-2xl ${app.reminderSent ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-500'}`}>
                    {app.reminderSent ? <Check size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{app.clientName}</h4>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Calendar size={14} className="mr-1" /> {app.time} • {srv?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {app.reminderSent && (
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-wider">
                      {t('admin.reminders.sent')}
                    </span>
                  )}
                  <button
                    onClick={() => sendReminder(app)}
                    className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${app.reminderSent
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-green-200'
                      }`}
                  >
                    <MessageSquare size={18} />
                    <span>{app.reminderSent ? t('admin.reminders.btn.resend') : t('admin.reminders.btn.send')}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={32} />
            </div>
            <h3 className="text-slate-800 font-bold text-xl mb-1">{t('admin.reminders.empty.title')}</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">{t('admin.reminders.empty.sub')}</p>
          </div>
        )}
      </div>

      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
        <h4 className="text-rose-800 font-bold mb-2 flex items-center">
          <MessageSquare size={16} className="mr-2" /> {t('admin.reminders.tip.title')}
        </h4>
        <p className="text-rose-700 text-sm leading-relaxed">
          {t('admin.reminders.tip.text')}
        </p>
      </div>
    </div>
  );
};

export default AdminReminders;
