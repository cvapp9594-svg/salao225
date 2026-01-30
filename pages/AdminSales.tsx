import * as React from 'react';
import { useState, useMemo } from 'react';
import { Appointment, Service, Professional } from '../types';
import { TrendingUp, DollarSign, Calendar, User, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface AdminSalesProps {
    appointments: Appointment[];
    services: Service[];
    professionals: Professional[];
}

const AdminSales: React.FC<AdminSalesProps> = ({ appointments, services, professionals }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

    // Gerar lista de anos disponíveis
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        appointments.forEach(apt => {
            if (apt.date && apt.date !== 'A definir') {
                const year = new Date(apt.date).getFullYear();
                if (!isNaN(year)) years.add(year);
            }
        });
        if (years.size === 0) years.add(currentYear);
        return Array.from(years).sort((a, b) => b - a);
    }, [appointments, currentYear]);

    // Filtrar agendamentos por ano e mês
    const filteredAppointments = useMemo(() => {
        return appointments.filter(apt => {
            if (apt.date === 'A definir' || !apt.date) return false;

            const aptDate = new Date(apt.date);
            const aptYear = aptDate.getFullYear();
            const aptMonth = aptDate.getMonth() + 1;

            if (aptYear !== selectedYear) return false;
            if (selectedMonth && aptMonth !== selectedMonth) return false;

            return apt.status === 'confirmed' || apt.status === 'completed';
        });
    }, [appointments, selectedYear, selectedMonth]);

    // Calcular vendas por mês
    const salesByMonth = useMemo(() => {
        const monthData: { [key: number]: { total: number; count: number; appointments: Appointment[] } } = {};

        for (let i = 1; i <= 12; i++) {
            monthData[i] = { total: 0, count: 0, appointments: [] };
        }

        appointments.forEach(apt => {
            if (apt.date === 'A definir' || !apt.date) return;
            if (apt.status !== 'confirmed' && apt.status !== 'completed') return;

            const aptDate = new Date(apt.date);
            const aptYear = aptDate.getFullYear();
            const aptMonth = aptDate.getMonth() + 1;

            if (aptYear === selectedYear) {
                const service = services.find(s => s.id === apt.serviceId);
                const price = service?.price || 0;

                monthData[aptMonth].total += price;
                monthData[aptMonth].count += 1;
                monthData[aptMonth].appointments.push(apt);
            }
        });

        return monthData;
    }, [appointments, services, selectedYear]);

    // Calcular totais
    const totals = useMemo(() => {
        const total = filteredAppointments.reduce((sum, apt) => {
            const service = services.find(s => s.id === apt.serviceId);
            return sum + (service?.price || 0);
        }, 0);

        return {
            revenue: total,
            count: filteredAppointments.length,
            avgTicket: filteredAppointments.length > 0 ? total / filteredAppointments.length : 0
        };
    }, [filteredAppointments, services]);

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const getServiceName = (serviceId: string) => {
        return services.find(s => s.id === serviceId)?.name || 'Serviço desconhecido';
    };

    const getProfessionalName = (professionalId: string) => {
        return professionals.find(p => p.id === professionalId)?.name || 'Não especificado';
    };

    const getServicePrice = (serviceId: string) => {
        return services.find(s => s.id === serviceId)?.price || 0;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-black text-slate-900 mb-2">Relatório de Vendas</h1>
                    <p className="text-slate-500 font-medium">Visualize todas as vendas por mês e ano</p>
                </div>

                {/* Filtros */}
                <div className="flex gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(Number(e.target.value));
                            setSelectedMonth(null);
                        }}
                        className="px-6 py-3 rounded-xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none font-bold bg-white"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        value={selectedMonth || ''}
                        onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                        className="px-6 py-3 rounded-xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none font-bold bg-white"
                    >
                        <option value="">Todos os meses</option>
                        {monthNames.map((name, idx) => (
                            <option key={idx + 1} value={idx + 1}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <DollarSign size={28} />
                        </div>
                        <TrendingUp size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Receita Total</p>
                    <p className="text-4xl font-black">{totals.revenue}$00</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Package size={28} />
                        </div>
                        <Calendar size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total de Vendas</p>
                    <p className="text-4xl font-black">{totals.count}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <TrendingUp size={28} />
                        </div>
                        <DollarSign size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Ticket Médio</p>
                    <p className="text-4xl font-black">{Math.round(totals.avgTicket)}$00</p>
                </div>
            </div>

            {/* Vendas por Mês */}
            {!selectedMonth && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900">Vendas por Mês - {selectedYear}</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {monthNames.map((monthName, idx) => {
                            const monthNum = idx + 1;
                            const monthData = salesByMonth[monthNum];
                            const isExpanded = expandedMonth === monthNum;

                            return (
                                <div key={monthNum}>
                                    <button
                                        onClick={() => setExpandedMonth(isExpanded ? null : monthNum)}
                                        className="w-full p-6 hover:bg-slate-50 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                                                <Calendar size={20} className="text-rose-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-slate-900">{monthName}</p>
                                                <p className="text-sm text-slate-500">{monthData.count} vendas</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <p className="text-2xl font-black text-slate-900">{monthData.total}$00</p>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>

                                    {isExpanded && monthData.appointments.length > 0 && (
                                        <div className="bg-slate-50 p-6 space-y-3">
                                            {monthData.appointments.map(apt => (
                                                <div key={apt.id} className="bg-white p-4 rounded-xl flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-900">{apt.clientName}</p>
                                                        <p className="text-sm text-slate-500">{getServiceName(apt.serviceId)}</p>
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {apt.date} • {apt.time} • {getProfessionalName(apt.professionalId)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xl font-black text-rose-600">{getServicePrice(apt.serviceId)}$00</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Lista Detalhada (quando mês específico está selecionado) */}
            {selectedMonth && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900">
                            Vendas de {monthNames[selectedMonth - 1]} {selectedYear}
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map(apt => (
                                <div key={apt.id} className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{apt.clientName}</p>
                                                <p className="text-sm text-slate-500">{apt.clientPhone}</p>
                                            </div>
                                        </div>
                                        <div className="ml-13 space-y-1">
                                            <p className="text-sm font-bold text-slate-700">{getServiceName(apt.serviceId)}</p>
                                            <p className="text-xs text-slate-500">
                                                📅 {apt.date} • ⏰ {apt.time} • 👤 {getProfessionalName(apt.professionalId)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-rose-600">{getServicePrice(apt.serviceId)}$00</p>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                                            {apt.status === 'completed' ? '✓ Concluído' : '⏳ Confirmado'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma venda encontrada</h3>
                                <p className="text-slate-500">Não há vendas registradas para este período.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSales;
