
import * as React from 'react';
import { useState, useMemo } from 'react';
import { Appointment, Service, Professional } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
// Added History to the lucide-react import list to fix JSX errors
import { Search, Filter, Phone, User, Calendar, Clock, Trash2, CheckCircle, XCircle, HelpCircle, History } from 'lucide-react';

interface AdminHistoryProps {
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
  onUpdate: (appointments: Appointment[]) => void;
}

const AdminHistory: React.FC<AdminHistoryProps> = ({ appointments, services, professionals, onUpdate }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => {
        const matchesSearch = app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.clientPhone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [appointments, searchTerm, statusFilter, dateSort]);

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.history.delete.confirm'))) {
      const updated = appointments.filter(a => a.id !== id);
      onUpdate(updated);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} className="mr-1" />;
      case 'cancelled': return <XCircle size={14} className="mr-1" />;
      case 'pending': return <HelpCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return t('admin.history.filter.confirmed');
      case 'pending': return t('admin.history.filter.pending');
      case 'cancelled': return t('admin.history.filter.cancelled');
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">{t('admin.history.title')}</h1>
          <p className="text-slate-500">{t('admin.history.subtitle')}</p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-slate-50 px-3 py-1 rounded-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('common.total')}</span>
            <p className="text-xl font-bold text-slate-800">{filteredAppointments.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('admin.history.search.placeholder')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none transition bg-slate-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none transition bg-slate-50/50 appearance-none min-w-[160px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('admin.history.filter.all')}</option>
                <option value="confirmed">{t('admin.history.filter.confirmed')}</option>
                <option value="pending">{t('admin.history.filter.pending')}</option>
                <option value="cancelled">{t('admin.history.filter.cancelled')}</option>
              </select>
            </div>

            <button
              onClick={() => setDateSort(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 font-medium text-slate-600"
            >
              <Calendar size={16} />
              {dateSort === 'desc' ? t('admin.history.sort.recent') : t('admin.history.sort.oldest')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.appointments.table.client')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.appointments.table.service')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.appointments.table.date')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{t('admin.appointments.table.status')}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{t('admin.history.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.map(app => {
              const srv = services.find(s => s.id === app.serviceId);
              const pro = professionals.find(p => p.id === app.professionalId);
              return (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 flex items-center">
                        <User size={14} className="mr-1.5 text-slate-400" /> {app.clientName}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center mt-1">
                        <Phone size={12} className="mr-1 text-slate-400" /> {app.clientPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{srv?.name || t('common.removed')}</span>
                      <span className="text-xs text-rose-500 font-medium mt-1">{pro?.name || t('common.any_pro')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 flex items-center">
                        <Calendar size={14} className="mr-1.5 text-slate-400" /> {app.date}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1 text-slate-400" /> {app.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir Registro"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <History size={32} />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">{t('admin.history.empty')}</h3>
            <p className="text-slate-500 text-sm">{t('common.search_fail')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHistory;
