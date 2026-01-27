
import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Pequeno atraso para feedback visual e UX profissional
    setTimeout(() => {
      const cleanUser = user.trim().toLowerCase();
      const cleanPass = pass.trim();

      // Aceita variações comuns para evitar frustração do usuário
      const isValidUser = cleanUser === 'admin caboverde' || cleanUser === 'admincaboverde';
      const isValidPass = cleanPass === 'adminsalao';

      if (isValidUser && isValidPass) {
        onLogin();
      } else {
        setError('Usuário ou senha incorretos. Verifique suas credenciais.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-200">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Painel do Gestor</h2>
          <p className="text-slate-500">Acesse para gerenciar seu salão</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                className="w-full pl-12 p-4 rounded-xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none transition bg-slate-50/30"
                placeholder="Ex: admincaboverde"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-12 p-4 rounded-xl border-2 border-slate-100 focus:border-rose-300 focus:outline-none transition bg-slate-50/30"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold p-4 rounded-xl text-center animate-shake flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-slate-900 text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Acessar Dashboard'
            )}
          </button>
          
          <div className="pt-4 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Acesso restrito a administradores</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
