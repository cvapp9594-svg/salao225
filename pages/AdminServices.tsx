
import React, { useState } from 'react';
import { Service, Category } from '../types';
import { Plus, Trash2, Edit2, Scissors, Tag, Save, X, Check } from 'lucide-react';

interface AdminServicesProps {
  services: Service[];
  categories: Category[];
  onUpdate: (services: Service[]) => void;
}

const AdminServices: React.FC<AdminServicesProps> = ({ services, categories, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({ isActive: true });

  const handleAdd = () => {
    if (!newService.name || !newService.price || !newService.categoryId) return;
    const item: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name!,
      description: newService.description || '',
      price: Number(newService.price),
      duration: Number(newService.duration || 60),
      categoryId: newService.categoryId,
      isActive: true
    };
    onUpdate([...services, item]);
    setNewService({ isActive: true });
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    const next = services.map(s => s.id === editingService.id ? editingService : s);
    onUpdate(next);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      onUpdate(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">Catálogo de Serviços</h1>
          <p className="text-slate-500">Configure os tratamentos oferecidos aos seus clientes.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingService(null); }}
          className="bg-rose-500 text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl hover:bg-rose-600 transition shadow-lg shadow-rose-200"
        >
          {isAdding ? <X size={18} className="mr-2 inline" /> : <Plus size={18} className="mr-2 inline" />}
          {isAdding ? 'Cancelar' : 'Adicionar Serviço'}
        </button>
      </div>

      {(isAdding || editingService) && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-rose-100 shadow-xl space-y-6 animate-fade-in-up">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <Scissors className="mr-3 text-rose-500" size={20}/> 
            {editingService ? `Editando: ${editingService.name}` : 'Novo Serviço'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Serviço</label>
              <input 
                type="text" placeholder="Ex: Hidratação profunda" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none bg-slate-50/30" 
                value={editingService ? editingService.name : newService.name || ''} 
                onChange={e => editingService ? setEditingService({...editingService, name: e.target.value}) : setNewService({...newService, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
              <select 
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none bg-slate-50/30 appearance-none"
                value={editingService ? editingService.categoryId : newService.categoryId || ''}
                onChange={e => editingService ? setEditingService({...editingService, categoryId: e.target.value}) : setNewService({...newService, categoryId: e.target.value})}
              >
                <option value="">Selecionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preço (R$)</label>
              <input 
                type="number" placeholder="0.00" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none bg-slate-50/30" 
                value={editingService ? editingService.price : newService.price || ''} 
                onChange={e => editingService ? setEditingService({...editingService, price: Number(e.target.value)}) : setNewService({...newService, price: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duração (minutos)</label>
              <input 
                type="number" placeholder="60" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none bg-slate-50/30" 
                value={editingService ? editingService.duration : newService.duration || ''} 
                onChange={e => editingService ? setEditingService({...editingService, duration: Number(e.target.value)}) : setNewService({...newService, duration: Number(e.target.value)})}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Breve Descrição</label>
              <textarea 
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none bg-slate-50/30 h-24 resize-none"
                value={editingService ? editingService.description : newService.description || ''} 
                onChange={e => editingService ? setEditingService({...editingService, description: e.target.value}) : setNewService({...newService, description: e.target.value})}
                placeholder="Detalhes sobre o procedimento..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
            <button 
              onClick={() => { setIsAdding(false); setEditingService(null); }}
              className="px-8 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl"
            >
              Cancelar
            </button>
            <button 
              onClick={editingService ? handleSaveEdit : handleAdd} 
              className="bg-slate-900 text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:bg-slate-800 transition shadow-xl"
            >
              <Save size={18} className="mr-2 inline" />
              {editingService ? 'Salvar Alterações' : 'Salvar Serviço'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(s => {
          const cat = categories.find(c => c.id === s.categoryId);
          return (
            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl hover:border-rose-100 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-30"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <Scissors size={24} />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingService(s); setIsAdding(false); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100"><Edit2 size={18}/></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100"><Trash2 size={18}/></button>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-black text-xl text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">{s.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-400 px-3 py-1.5 rounded-full">
                    <Tag size={10} className="mr-1.5" /> {cat?.name || 'Geral'}
                  </span>
                  {!s.isActive && (
                    <span className="inline-flex items-center text-[9px] font-black uppercase tracking-[0.2em] bg-red-50 text-red-400 px-3 py-1.5 rounded-full border border-red-100">
                      Inativo
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                {s.description || 'Nenhuma descrição detalhada fornecida para este serviço.'}
              </p>

              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</span>
                  <span className="text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">R$ {s.price}</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duração</span>
                  <span className="text-sm font-bold text-slate-600">{s.duration} MIN</span>
                </div>
              </div>
            </div>
          );
        })}
        {services.length === 0 && (
          <div className="col-span-full py-24 text-center bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100">
            <Scissors size={48} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-400 font-bold text-xl">Seu menu de serviços está vazio.</p>
            <p className="text-slate-300 text-sm mt-2">Clique em "Adicionar Serviço" para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
