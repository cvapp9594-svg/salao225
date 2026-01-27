
import * as React from 'react';
import { Appointment, Service, Professional } from '../types';
import { Users, Calendar, TrendingUp, Scissors, Sparkles, Clock, Bell, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  professionals: Professional[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, services, professionals }) => {
  const pending = appointments.filter(a => a.status === 'pending').length;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const pendingReminders = appointments.filter(a => a.date === tomorrowStr && !a.reminderSent && a.status === 'confirmed').length;

  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed')
    .reduce((acc, curr) => {
      const s = services.find(srv => srv.id === curr.serviceId);
      return acc + (s?.price || 0);
    }, 0);

  const StatCard = ({ title, value, icon: Icon, color, trend, badge }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-xl shadow-opacity-20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {badge && (
          <span className="flex items-center space-x-1 text-rose-500 font-black text-[10px] bg-rose-50 px-3 py-1.5 rounded-full animate-pulse border border-rose-100 uppercase tracking-widest">
            {badge}
          </span>
        )}
        {trend && !badge && (
          <div className="flex items-center space-x-1 text-green-500 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <ArrowUpRight size={14} />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform ${color.replace('bg-', 'bg-')}`}></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-2">Painel Executivo</h1>
          <p className="text-slate-500 font-medium">Gestão centralizada e métricas de desempenho do estúdio.</p>
        </div>
        {pendingReminders > 0 && (
          <div className="glass px-6 py-4 rounded-3xl flex items-center text-rose-600 border border-rose-100 shadow-xl shadow-rose-500/5">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center mr-4 animate-bounce">
              <Bell size={20} />
            </div>
            <div>
              <span className="block text-xs font-black uppercase tracking-widest opacity-60">Ação Necessária</span>
              <span className="text-sm font-bold">{pendingReminders} lembretes para amanhã!</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Agendamentos" value={appointments.length} icon={Calendar} color="bg-rose-500" trend="12" />
        <StatCard title="Confirmações Pend." value={pending} icon={Clock} color="bg-amber-500" />
        <StatCard title="Ações p/ Amanhã" value={pendingReminders} icon={Bell} color="bg-indigo-500" badge={pendingReminders > 0 ? "Foco Total" : ""} />
        <StatCard title="Receita Prevista" value={`R$ ${totalRevenue}`} icon={TrendingUp} color="bg-emerald-500" trend="5.4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-serif font-black flex items-center text-slate-900">
              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mr-3">
                <Sparkles size={20} />
              </div>
              Menu de Elite
            </h3>
            <button className="text-xs font-black text-rose-500 uppercase tracking-widest hover:opacity-70">Ver Tudo</button>
          </div>
          
          <div className="space-y-6">
            {services.slice(0, 4).map(s => (
              <div key={s.id} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:border-rose-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-slate-100">
                    <Scissors size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{s.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Care</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-rose-500">R$ {s.price}</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">{s.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-serif font-black flex items-center text-slate-900">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <Calendar size={20} />
              </div>
              Atividade Mestra
            </h3>
            <button className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:opacity-70">Log Completo</button>
          </div>
          
          <div className="space-y-6">
            {appointments.slice(-4).reverse().map(a => {
              const srv = services.find(s => s.id === a.serviceId);
              return (
                <div key={a.id} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 font-bold group-hover:text-rose-500 transition-colors">
                      {a.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{a.clientName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{srv?.name} • {a.time}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                    a.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                    a.status === 'cancelled' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                    {a.status}
                  </span>
                </div>
              );
            })}
            {appointments.length === 0 && (
              <div className="text-center py-16 opacity-30">
                <Clock size={48} className="mx-auto mb-4" />
                <p className="font-black text-xs uppercase tracking-widest">Nenhuma atividade registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
