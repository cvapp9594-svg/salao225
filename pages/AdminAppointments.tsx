
import * as React from 'react';
import { useState, useMemo } from 'react';
import { Appointment, Service, Professional } from '../types';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Check, X, Phone, User as UserIcon, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  onUpdate: (appointments: Appointment[]) => void;
}

type CalendarView = 'month' | 'week' | 'day';

const AdminAppointments: React.FC<AdminAppointmentsProps> = ({ appointments, services, professionals, onUpdate }) => {
  const { t, language } = useLanguage();
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('calendar');
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterProfessionalId, setFilterProfessionalId] = useState<string>('all');

  const updateStatus = (id: string, status: Appointment['status']) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    onUpdate(updated);
  };

  const filteredAppointments = useMemo(() => {
    if (filterProfessionalId === 'all') return appointments;
    return appointments.filter(a => a.professionalId === filterProfessionalId);
  }, [appointments, filterProfessionalId]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentDate]);

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') newDate.setMonth(currentDate.getMonth() + direction);
    if (calendarView === 'week') newDate.setDate(currentDate.getDate() + (direction * 7));
    if (calendarView === 'day') newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear();
  };

  const appointmentsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredAppointments.filter(a => a.date === dateStr);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">{t('admin.appointments.title')}</h1>
          <p className="text-slate-500">{t('admin.appointments.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Professional Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={filterProfessionalId}
              onChange={(e) => setFilterProfessionalId(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-200 focus:outline-none transition appearance-none min-w-[200px]"
            >
              <option value="all">{t('admin.appointments.filter.all')}</option>
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeView === 'calendar' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <CalendarIcon size={18} />
              <span className="font-medium">{t('admin.appointments.view.calendar')}</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${activeView === 'list' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <List size={18} />
              <span className="font-medium">{t('admin.appointments.view.list')}</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'calendar' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-white rounded-full transition shadow-sm border border-slate-200"><ChevronLeft size={20} /></button>
              <h2 className="text-xl font-bold text-slate-800 min-w-[150px] text-center capitalize">{formatMonth(currentDate)}</h2>
              <button onClick={() => navigateDate(1)} className="p-2 hover:bg-white rounded-full transition shadow-sm border border-slate-200"><ChevronRight size={20} /></button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['month', 'week', 'day'] as CalendarView[]).map(v => (
                <button
                  key={v}
                  onClick={() => setCalendarView(v)}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition ${calendarView === v ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {v === 'month' ? t('admin.appointments.calendar.month') : v === 'week' ? t('admin.appointments.calendar.week') : t('admin.appointments.calendar.day')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2">
            <div className="grid grid-cols-7 border-b">
              {(language === 'pt' ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 bg-slate-50">
              {monthData.map((day, idx) => (
                <div
                  key={idx}
                  className={`min-h-[120px] bg-white p-2 transition-colors border-t border-l border-slate-50 ${day === null ? 'bg-slate-50/30' : 'hover:bg-slate-50'}`}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${isToday(day) ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'text-slate-600'}`}>
                          {day}
                        </span>
                        {appointmentsForDay(day).length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {appointmentsForDay(day).slice(0, 3).map(app => (
                          <div
                            key={app.id}
                            className={`text-[10px] p-1 rounded truncate border ${app.status === 'confirmed' ? 'bg-green-50 border-green-100 text-green-700' :
                                app.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-700' :
                                  'bg-amber-50 border-amber-100 text-amber-700'
                              }`}
                          >
                            <span className="font-bold">{app.time}</span> {app.clientName}
                          </div>
                        ))}
                        {appointmentsForDay(day).length > 3 && (
                          <div className="text-[10px] text-slate-400 font-bold px-1">+{appointmentsForDay(day).length - 3} {language === 'pt' ? 'mais' : 'more'}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-sm font-bold text-slate-500">{t('admin.appointments.table.client')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">{t('admin.appointments.table.service')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">{t('admin.appointments.table.date')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">{t('admin.appointments.table.status')}</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">{t('admin.appointments.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.slice().reverse().map(app => {
                const srv = services.find(s => s.id === app.serviceId);
                const pro = professionals.find(p => p.id === app.professionalId);
                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-6">
                      <p className="font-bold text-slate-800">{app.clientName}</p>
                      <p className="text-xs text-slate-500 flex items-center"><Phone size={12} className="mr-1" /> {app.clientPhone}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-medium text-slate-700">{srv?.name}</p>
                      <p className="text-xs text-rose-500 flex items-center"><UserIcon size={12} className="mr-1" /> {pro?.name}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-medium text-slate-700">{app.date}</p>
                      <p className="text-xs text-slate-500">{app.time}</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                          app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex space-x-2">
                        {app.status !== 'confirmed' && (
                          <button
                            onClick={() => updateStatus(app.id, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition shadow-sm"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(app.id, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition shadow-sm"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                    {t('admin.appointments.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
