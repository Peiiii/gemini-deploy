import React from 'react';
import { ExternalLink, GitBranch, Clock, Sparkles, FolderArchive, Activity, Server, Zap, GraduationCap, Palette, Briefcase } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { usePresenter } from '../contexts/PresenterContext';
import { URLS } from '../constants';

export const Dashboard: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  const presenter = usePresenter();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Your Magic Spells</h2>
          <p className="text-slate-500 dark:text-gray-400">Manage your live apps and summon new ones.</p>
        </div>
        <button
          onClick={() => presenter.ui.navigateTo('deploy')}
          className="bg-action-green text-black hover:bg-[#2ce010] px-8 py-3 rounded-full font-extrabold transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] flex items-center gap-2 group hover:scale-105"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Create Magic
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            icon={Zap} 
            label="Active Spells" 
            value={projects.filter(p => p.status === 'Live').length.toString()} 
            sublabel="Running on Edge" 
            color="text-action-green"
            bgColor="bg-action-green/10"
        />
        <StatCard 
            icon={Activity} 
            label="Total Views" 
            value="12.4k" 
            sublabel="People love your stuff" 
            color="text-brand-500 dark:text-brand-400"
            bgColor="bg-brand-500/10"
        />
        <StatCard 
            icon={Server} 
            label="Magic Power" 
            value="100%" 
            sublabel="Systems Operational" 
            color="text-action-orange"
            bgColor="bg-action-orange/10"
        />
      </div>

      {/* Projects Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            Recent Creations
        </h3>
        
        {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                <div key={project.id} className="glass-card rounded-2xl p-6 group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    {/* Status Indicator Dot */}
                    <div className={`absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        project.status === 'Live' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 
                        project.status === 'Failed' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            project.status === 'Live' ? 'bg-green-500 dark:bg-green-400 animate-pulse' : 
                            project.status === 'Failed' ? 'bg-red-500 dark:bg-red-400' : 'bg-yellow-500 dark:bg-yellow-400'
                        }`}></div>
                        {project.status}
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                            project.framework === 'React' 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white border-slate-200 dark:border-white/10'
                        }`}>
                            <span className="font-bold text-sm tracking-tighter">{project.framework.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">{project.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-500 mt-1">
                                {project.sourceType === 'zip' ? <FolderArchive className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
                                <span className="truncate max-w-[150px]">{project.repoUrl.replace(URLS.GITHUB_BASE, '')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 mt-4 border-t border-slate-100 dark:border-white/5">
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {project.lastDeployed}
                        </span>
                        {project.url ? (
                            <a href={project.url} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 text-sm font-bold flex items-center gap-1 transition-colors hover:underline decoration-brand-500/50">
                                Visit App <ExternalLink className="w-3 h-3" />
                            </a>
                        ) : (
                            <span className="text-slate-400 dark:text-gray-600 text-sm italic">Not accessible</span>
                        )}
                    </div>
                </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                <div className="w-16 h-16 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    ✨
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No magic yet?</h3>
                <p className="text-slate-500 dark:text-gray-400 mb-6">Create your first app to see it here.</p>
                <button
                    onClick={() => presenter.ui.navigateTo('deploy')}
                    className="text-brand-600 font-bold hover:underline"
                >
                    Create New App
                </button>
             </div>
        )}
      </div>

      {/* Use Cases Section - Psychological Hooks */}
      <div className="pt-10 border-t border-slate-200 dark:border-white/5">
        <h3 className="text-center text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">What will you build?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UseCaseCard 
                icon={GraduationCap}
                title="For Students"
                headline="Showcase your Portfolio"
                text="Don't send PDF resumes. Send a GemiGo link. Let recruiters chat with your AI creations."
                color="text-blue-500"
            />
            <UseCaseCard 
                icon={Palette}
                title="For Creators"
                headline="Viral Content Machine"
                text="Created a funny AI character? Put it on the web and share it on TikTok instantly."
                color="text-purple-500"
            />
            <UseCaseCard 
                icon={Briefcase}
                title="For Business"
                headline="Internal Tools"
                text="Need a quick AI tool for your team? Password protect it and share securely."
                color="text-emerald-500"
            />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    sublabel: string;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, sublabel, color, bgColor }) => (
    <div className="glass-card p-5 rounded-2xl flex items-center gap-4 border border-white/50 dark:border-white/5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
            <p className={`text-xs font-medium opacity-80 ${color} mt-0.5`}>{sublabel}</p>
        </div>
    </div>
);

const UseCaseCard: React.FC<{icon: any, title: string, headline: string, text: string, color: string}> = ({icon: Icon, title, headline, text, color}) => (
    <div className="group p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-brand-500/30 transition-all hover:-translate-y-1">
        <div className={`flex items-center gap-2 mb-3 ${color}`}>
            <Icon className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wide">{title}</span>
        </div>
        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">{headline}</h4>
        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{text}</p>
    </div>
);