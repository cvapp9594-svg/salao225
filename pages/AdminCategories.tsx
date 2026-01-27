
import React, { useState } from 'react';
import { Category } from '../types';
import { Plus, Trash2, Tag, Edit2, Check, X } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, onUpdate }) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const item: Category = {
      id: 'cat_' + Math.random().toString(36).substr(2, 5),
      name: newName.trim()
    };
    onUpdate([...categories, item]);
    setNewName('');
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = categories.map(c => 
      c.id === id ? { ...c, name: editName.trim() } : c
    );
    onUpdate(updated);
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir esta categoria? Isso pode afetar a exibição de serviços vinculados.')) {
      onUpdate(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-800 flex items-center">
          <Tag className="mr-3 text-rose-500" size={32} /> Categorias
        </h1>
        <p className="text-slate-500">Organize seu catálogo de serviços por grupos.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-xl">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input 
            type="text" 
            placeholder="Nova Categoria (ex: Coloração)" 
            className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-rose-300 focus:outline-none transition bg-slate-50/30 font-medium"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit" className="bg-rose-500 text-white font-bold px-6 rounded-xl hover:bg-rose-600 transition flex items-center shadow-lg shadow-rose-100 whitespace-nowrap active:scale-95">
            <Plus size={20} className="mr-1" /> Criar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-rose-200 transition duration-300">
            {editingId === cat.id ? (
              <div className="flex-1 flex items-center gap-2 animate-fade-in-up">
                <input 
                  autoFocus
                  type="text" 
                  className="flex-1 p-2 text-sm border-2 border-rose-300 rounded-lg focus:outline-none bg-rose-50/30 font-bold text-slate-700"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit(cat.id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                />
                <button 
                  onClick={() => handleSaveEdit(cat.id)}
                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-md shadow-emerald-100"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={cancelEditing}
                  className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                    <Tag size={18} />
                  </div>
                  <span className="font-bold text-slate-700">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => startEditing(cat)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                    title="Editar Categoria"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Excluir Categoria"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Tag size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Nenhuma categoria cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
