import React from 'react';
import { Search, Zap, Star, User, TrendingUp, Filter, Play } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

// Mock Data for the Marketplace
const PUBLIC_APPS = [
  {
    id: 1,
    name: 'Gemini Coder Pro',
    description: 'Advanced code refactoring agent specialized in React & TypeScript.',
    author: 'DevStudio_X',
    cost: 5,
    category: 'Development',
    rating: 4.8,
    installs: '12k',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 2,
    name: 'Dreamscape Gen',
    description: 'Generate 4K fantasy landscapes with simple text prompts.',
    author: 'ArtifyAI',
    cost: 12,
    category: 'Image Gen',
    rating: 4.9,
    installs: '8.5k',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    name: 'DataWhiz Analyst',
    description: 'Upload CSVs and get instant charts and insights.',
    author: 'DataCorp',
    cost: 8,
    category: 'Productivity',
    rating: 4.6,
    installs: '5k',
    color: 'from-emerald-500 to-teal-400'
  },
  {
    id: 4,
    name: 'CopyWrite Ultra',
    description: 'Marketing copy generator optimized for SEO and conversion.',
    author: 'CopyNinja',
    cost: 3,
    category: 'Marketing',
    rating: 4.5,
    installs: '15k',
    color: 'from-orange-500 to-amber-400'
  },
  {
    id: 5,
    name: 'Legal Eagle',
    description: 'Summarize complex legal documents in seconds.',
    author: 'LawTech_Solutions',
    cost: 20,
    category: 'Legal',
    rating: 4.9,
    installs: '2k',
    color: 'from-slate-600 to-slate-400'
  },
  {
    id: 6,
    name: 'Retro Game Maker',
    description: 'Create simple JS browser games via prompts.',
    author: 'GameJammer',
    cost: 10,
    category: 'Development',
    rating: 4.7,
    installs: '4.2k',
    color: 'from-indigo-500 to-violet-500'
  }
];

export const Explore: React.FC = () => {
  const { credits, actions } = useUserStore();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                Explore Apps <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs px-2 py-1 rounded-full border border-brand-200 dark:border-brand-500/20">Beta</span>
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-1">Discover AI tools built by the community. Spend credits, support creators.</p>
        </div>
        
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
                type="text" 
                placeholder="Search for AI apps..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm"
            />
        </div>
      </div>

      {/* Featured Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-brand-300 font-medium">
                <TrendingUp className="w-5 h-5" />
                <span>Top Trending</span>
            </div>
            <h3 className="text-4xl font-extrabold mb-4 leading-tight">Monetize Your AI Models</h3>
            <p className="text-slate-300 text-lg mb-8">
                Publish your Gemini-powered applications to the marketplace. You earn 70% of the credit revenue every time someone uses your app.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                Become a Creator
            </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All Apps', 'Development', 'Image Gen', 'Productivity', 'Marketing', 'Legal', 'Fun'].map((cat, i) => (
            <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                i === 0 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'
            }`}>
                {cat}
            </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLIC_APPS.map((app) => (
            <div key={app.id} className="glass-card rounded-xl p-5 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg`}>
                        <Zap className="w-7 h-7" />
                    </div>
                    <div className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/5">
                        <span className="text-amber-500">⚡</span> {app.cost} Credits
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{app.name}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 h-10 line-clamp-2 leading-relaxed">
                    {app.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-gray-500 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {app.author}
                    </div>
                    <div className="flex items-center gap-1">
                         <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {app.rating}
                    </div>
                    <div>{app.installs} uses</div>
                </div>

                <button 
                    onClick={() => {
                        if(credits >= app.cost) {
                            actions.spendCredits(app.cost);
                        } else {
                            alert("Not enough credits!");
                        }
                    }}
                    className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium text-sm hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-brand-500/20"
                >
                    <Play className="w-4 h-4 fill-current" /> Launch App
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};