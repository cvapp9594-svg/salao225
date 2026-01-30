
import * as React from 'react';
import { useState, useRef } from 'react';
import { Professional, Service } from '../types';
import { Plus, Trash2, Edit2, UserPlus, Scissors, Camera, Check, X, User, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminProfessionalsProps {
  professionals: Professional[];
  services: Service[];
  onUpdate: (professionals: Professional[]) => void;
}

const AdminProfessionals: React.FC<AdminProfessionalsProps> = ({ professionals, services, onUpdate }) => {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPro, setEditingPro] = useState<Professional | null>(null);
  const [newPro, setNewPro] = useState<Partial<Professional>>({
    name: '',
    role: '',
    avatar: 'https://i.pravatar.cc/150?u=placeholder',
    bio: '',
    services: [],
    isActive: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit && editingPro) {
          setEditingPro({ ...editingPro, avatar: base64String });
        } else {
          setNewPro({ ...newPro, avatar: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleService = (serviceId: string, isEdit = false) => {
    if (isEdit && editingPro) {
      const currentServices = editingPro.services || [];
      const nextServices = currentServices.includes(serviceId)
        ? currentServices.filter(id => id !== serviceId)
        : [...currentServices, serviceId];
      setEditingPro({ ...editingPro, services: nextServices });
    } else {
      const currentServices = newPro.services || [];
      const nextServices = currentServices.includes(serviceId)
        ? currentServices.filter(id => id !== serviceId)
        : [...currentServices, serviceId];
      setNewPro({ ...newPro, services: nextServices });
    }
  };

  const handleAdd = () => {
    if (!newPro.name || !newPro.role) return;
    const item: Professional = {
      id: 'pro_' + Math.random().toString(36).substr(2, 9),
      name: newPro.name!,
      role: newPro.role!,
      avatar: newPro.avatar || 'https://i.pravatar.cc/150?u=placeholder',
      bio: newPro.bio || '',
      services: newPro.services || [],
      isActive: newPro.isActive !== false
    };
    onUpdate([...professionals, item]);
    setNewPro({ name: '', role: '', avatar: 'https://i.pravatar.cc/150?u=placeholder', bio: '', services: [], isActive: true });
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (!editingPro) return;
    const next = professionals.map(p => p.id === editingPro.id ? editingPro : p);
    onUpdate(next);
    setEditingPro(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('admin.professionals.delete.confirm'))) {
      onUpdate(professionals.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">{t('admin.professionals.title')}</h1>
          <p className="text-slate-500">{t('admin.professionals.subtitle')}</p>
        </div>
        <button
          onClick={() => { setIsAdding(!isAdding); setEditingPro(null); }}
          className="bg-rose-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-rose-600 transition flex items-center shadow-lg shadow-rose-200"
        >
          {isAdding ? <X size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />}
          {isAdding ? t('common.cancel') : t('admin.professionals.btn.add')}
        </button>
      </div>

      {(isAdding || editingPro) && (
        <div className="bg-white p-8 rounded-3xl border-2 border-rose-100 shadow-xl space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            {editingPro ? <Edit2 size={20} className="mr-2 text-rose-500" /> : <Plus size={20} className="mr-2 text-rose-500" />}
            {editingPro ? t('admin.professionals.form.edit').replace('{name}', editingPro.name) : t('admin.professionals.form.new')}
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => editingPro ? editFileInputRef.current?.click() : fileInputRef.current?.click()}
              >
                <img
                  src={editingPro ? editingPro.avatar : newPro.avatar}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-rose-50 shadow-lg group-hover:brightness-75 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                  <Camera size={24} />
                </div>
                <input
                  type="file"
                  ref={editingPro ? editFileInputRef : fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, !!editingPro)}
                />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">{t('admin.professionals.form.photo')}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.professionals.form.name')}</label>
                <input
                  type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={editingPro ? editingPro.name : newPro.name}
                  onChange={e => editingPro ? setEditingPro({ ...editingPro, name: e.target.value }) : setNewPro({ ...newPro, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.professionals.form.role')}</label>
                <input
                  type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none"
                  value={editingPro ? editingPro.role : newPro.role}
                  onChange={e => editingPro ? setEditingPro({ ...editingPro, role: e.target.value }) : setNewPro({ ...newPro, role: e.target.value })}
                  placeholder={t('admin.professionals.form.role_placeholder')}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Status de Disponibilidade</label>
                <button
                  type="button"
                  onClick={() => editingPro ? setEditingPro({ ...editingPro, isActive: !editingPro.isActive }) : setNewPro({ ...newPro, isActive: !newPro.isActive })}
                  className={`w-full p-3 rounded-xl border-2 transition-all font-bold flex items-center justify-center space-x-2 ${(editingPro ? editingPro.isActive : newPro.isActive) !== false
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                >
                  {(editingPro ? editingPro.isActive : newPro.isActive) !== false ? <Check size={18} /> : <X size={18} />}
                  <span>{(editingPro ? editingPro.isActive : newPro.isActive) !== false ? 'Presente / Disponível' : 'Ausente / Indisponível'}</span>
                </button>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">{t('admin.professionals.form.bio')}</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none h-24"
                  value={editingPro ? editingPro.bio : newPro.bio}
                  onChange={e => editingPro ? setEditingPro({ ...editingPro, bio: e.target.value }) : setNewPro({ ...newPro, bio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase flex items-center">
              <Scissors size={14} className="mr-2" /> {t('admin.professionals.form.services')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {services.map(s => {
                const isSelected = editingPro ? editingPro.services.includes(s.id) : newPro.services?.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleToggleService(s.id, !!editingPro)}
                    className={`p-3 text-left rounded-xl border-2 text-sm transition ${isSelected
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    <p className="font-bold truncate">{s.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              onClick={() => { setIsAdding(false); setEditingPro(null); }}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={editingPro ? handleSaveEdit : handleAdd}
              className="bg-slate-900 text-white font-bold px-12 py-4 rounded-2xl hover:bg-slate-800 transition shadow-xl flex items-center"
            >
              <Save size={20} className="mr-2" />
              {editingPro ? t('admin.professionals.form.save_changes') : t('admin.professionals.form.save')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map(pro => (
          <div key={pro.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={pro.avatar} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => { setEditingPro(pro); setIsAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-rose-500 hover:text-white transition shadow-lg"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(pro.id)}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition shadow-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-xl font-bold">{pro.name}</h3>
                <p className="text-rose-300 text-sm font-medium">{pro.role}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${pro.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {pro.isActive !== false ? 'Disponível' : 'Ausente'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed italic">
                "{pro.bio || t('admin.professionals.bio.empty')}"
              </p>

              <div className="pt-4 border-t border-slate-50 mt-auto">
                <div className="flex flex-wrap gap-1">
                  {(pro.services || []).slice(0, 3).map(sid => {
                    const s = services.find(srv => srv.id === sid);
                    return s ? (
                      <span key={sid} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                        {s.name}
                      </span>
                    ) : null;
                  })}
                  {(pro.services || []).length > 3 && (
                    <span className="text-[10px] bg-rose-50 text-rose-500 px-2 py-1 rounded-md border border-rose-100 font-bold">
                      +{(pro.services || []).length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {professionals.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <User size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-slate-800 font-bold text-xl">{t('admin.professionals.empty.title')}</h3>
            <p className="text-slate-400">{t('admin.professionals.empty.sub')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfessionals;
