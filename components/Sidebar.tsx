import React from 'react';
import { LayoutDashboard, Settings, Zap, Github, Compass, Sparkles, Rocket } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { usePresenter } from '../contexts/PresenterContext';

export const Sidebar: React.FC = () => {
  const currentView = useUIStore((state) => state.currentView);
  const presenter = usePresenter();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deploy', label: 'Magic Box', icon: Sparkles },
    { id: 'explore', label: 'Explore Apps', icon: Compass }, 
    { id: 'integrations', label: 'Integrations', icon: Github },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 flex flex-col glass border-r-0 z-50">
      <div className="p-8 pb-6 flex items-center gap-3">
        <div className="relative group cursor-pointer" onClick={() => presenter.ui.navigateTo('dashboard')}>
            <div className="absolute inset-0 bg-brand-500 blur opacity-40 rounded-lg group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                <Zap className="text-white w-5 h-5 fill-white" />
            </div>
        </div>
        <div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">Gemi<span className="text-brand-500">Go</span></h1>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase">Magic Edition</span>
        </div>
      </div>

      <div className="px-6 mb-2">
         <p className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-2">My Magic</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => presenter.ui.navigateTo(item.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent border-l-2 border-brand-500 opacity-100"></div>
              )}
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-b from-slate-100 to-transparent dark:from-white/5 border border-slate-200 dark:border-white/5 group hover:border-brand-500/30 transition-colors">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 flex items-center justify-center border border-indigo-500/20 dark:border-indigo-500/30">
              <Rocket className="w-4 h-4" />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">The Showcase</p>
              <p className="text-[10px] text-slate-500 dark:text-gray-400">Pro Plan (Coming Soon)</p>
           </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-gray-800 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full w-[80%] rounded-full"></div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
        <button className="flex items-center gap-3 w-full hover:bg-slate-200/50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-white dark:ring-black"></div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Indie Hacker</p>
            <p className="text-xs text-slate-500 dark:text-gray-500">The Playground</p>
          </div>
        </button>
      </div>
    </div>
  );
};