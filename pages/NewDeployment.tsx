import React, { useRef, useEffect, useState } from 'react';
import { useDeploymentStore } from '../stores/deploymentStore';
import { usePresenter } from '../contexts/PresenterContext';
import { DeploymentStatus } from '../types';
import { Twitter, Copy, Check, Sparkles, UploadCloud, Rocket, Globe, Github } from 'lucide-react';
import { URLS } from '../constants';
import { QRCodeSVG } from 'qrcode.react';

const STEPS = [
    { id: 1, label: 'Export', desc: 'Create in Studio' },
    { id: 2, label: 'Drop', desc: 'Drag & Drop' },
    { id: 3, label: 'Go!', desc: 'Get your Link' }
];

export const NewDeployment: React.FC = () => {
  const presenter = usePresenter();
  const state = useDeploymentStore(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'zip' | 'github'>('github');
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    return () => presenter.deployment.resetWizard();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      presenter.deployment.handleFileDrop(e.target.files[0]);
      state.actions.setSourceType('zip');
      // Auto-advance for Zip
      setTimeout(() => state.actions.setStep(2), 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      presenter.deployment.handleFileDrop(e.dataTransfer.files[0]);
      state.actions.setSourceType('zip');
      setActiveTab('zip'); // Switch tab visually if they drop a file
      setTimeout(() => state.actions.setStep(2), 500);
    }
  };

  const handleGithubSubmit = () => {
      if (githubUrl.includes('github.com')) {
          state.actions.setSourceType('github');
          state.actions.setRepoUrl(githubUrl);
          presenter.deployment.autoProjectName(githubUrl, 'github');
          state.actions.setStep(2);
      } else {
          alert('Please enter a valid GitHub URL');
      }
  };

  const handleMagicStart = () => {
    presenter.deployment.handleAnalyzeCode().then(() => {
        // Automatically start build after analysis for seamless magic flow
        handleDeployStart();
    });
  };

  const handleDeployStart = () => {
    presenter.deployment.startBuildSimulation(() => {
       const identifier = state.sourceType === 'github' ? state.repoUrl : (state.zipFile?.name || 'archive.zip');
       const url = URLS.getDeploymentUrl(state.projectName || 'my-awesome-app');
       presenter.project.addProject(state.projectName || 'My App', url, state.sourceType, identifier);
       state.actions.setStep(3);
    });
  };

  const copyLink = () => {
      const url = URLS.getDeploymentUrl(state.projectName || 'my-app');
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in pb-24 min-h-[80vh] flex flex-col justify-center">
      
      {/* Hero Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
          Don't just Prompt it.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Publish it.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
           The missing "Share" button for Google AI Studio. From Zip to Link in 30 Seconds.
        </p>
      </div>

      {/* Progress Flow */}
      <div className="flex items-center justify-center gap-4 md:gap-12 mb-16 text-sm font-bold uppercase tracking-widest text-slate-400">
         {STEPS.map((s, i) => (
             <div key={i} className={`flex items-center gap-2 transition-colors ${state.step >= s.id ? 'text-brand-500' : ''}`}>
                 <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${state.step >= s.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 dark:border-gray-700'}`}>
                    {state.step > s.id ? <Check className="w-4 h-4"/> : i + 1}
                 </span>
                 <span className={state.step === s.id ? 'text-slate-900 dark:text-white' : ''}>{s.label}</span>
                 {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-slate-200 dark:bg-gray-800 mx-2"></div>}
             </div>
         ))}
      </div>

      {/* STEP 1: DROP (The Magic Box) */}
      {state.step === 1 && (
        <div className="animate-slide-up max-w-2xl mx-auto w-full">
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-6 border border-slate-200 dark:border-white/10">
                <button 
                    onClick={() => setActiveTab('github')}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'github' ? 'bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}
                >
                    <Github className="w-4 h-4" /> Import GitHub
                </button>
                <button 
                    onClick={() => setActiveTab('zip')}
                    className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'zip' ? 'bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'}`}
                >
                    <UploadCloud className="w-4 h-4" /> Drop Zip
                </button>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl border-4 border-dashed border-slate-300 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-300 relative overflow-hidden group">
                {activeTab === 'zip' ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="p-12 text-center cursor-pointer hover:bg-brand-500/5 transition-colors aspect-[4/3] flex flex-col items-center justify-center"
                    >
                        {state.zipFile ? (
                            <div className="text-center z-10 animate-bounce">
                                <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/30">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{state.zipFile.name}</h3>
                                <p className="text-brand-600 dark:text-brand-400 mt-2 font-bold">Ready for Magic!</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <UploadCloud className="w-10 h-10 text-brand-500" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Drop your Zip here</h3>
                                <p className="text-lg text-slate-500 dark:text-gray-400 mb-8">Export from Google AI Studio & Drag it in.</p>
                                <span className="bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 px-4 py-2 rounded-lg font-mono text-xs">.zip files only</span>
                            </>
                        )}
                         <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={handleFileChange} />
                    </div>
                ) : (
                    <div className="p-12 flex flex-col items-center justify-center aspect-[4/3]">
                        <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/10">
                            <Github className="w-10 h-10 text-white dark:text-black" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Import from GitHub</h3>
                        <p className="text-slate-500 dark:text-gray-400 mb-6 text-center max-w-sm">
                            Paste your repository link below and we will build it instantly.
                        </p>
                        <div className="w-full max-w-md relative mb-6">
                            <input 
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/username/repo"
                                className="w-full pl-4 pr-4 py-3 bg-white dark:bg-black/20 border-2 border-slate-200 dark:border-white/10 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-slate-900 dark:text-white text-center font-mono text-sm"
                            />
                        </div>
                        <button 
                            onClick={handleGithubSubmit}
                            disabled={!githubUrl}
                            className="bg-brand-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:scale-105 shadow-lg shadow-brand-500/20"
                        >
                            Import & Magic <Sparkles className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            
            <p className="text-center mt-6 text-slate-400 text-sm">
                Powered by Cloudflare Enterprise Network. Secure by default.
            </p>
        </div>
      )}

      {/* STEP 2: MAGIC (Processing) */}
      {state.step === 2 && (
        <div className="max-w-2xl mx-auto w-full text-center animate-slide-up">
            {!state.isAnalyzing && state.deploymentStatus === DeploymentStatus.IDLE ? (
                 <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 border border-slate-200 dark:border-gray-800 shadow-2xl">
                     <div className="w-24 h-24 bg-gradient-to-tr from-brand-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/40 animate-pulse">
                        <Sparkles className="w-12 h-12 text-white" />
                     </div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to make it live?</h2>
                     <p className="text-slate-500 dark:text-gray-400 mb-8 text-lg">
                        We will auto-configure the secure proxy and deploy to our global edge network.
                     </p>
                     
                     <div className="space-y-4">
                        <button 
                            onClick={handleMagicStart}
                            className="w-full bg-action-green hover:bg-green-400 text-black py-4 rounded-xl font-extrabold text-xl shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            <Rocket className="w-6 h-6" /> Make it Live 🚀
                        </button>
                        <button onClick={() => state.actions.setStep(1)} className="text-slate-400 hover:text-slate-600 font-medium text-sm">Cancel</button>
                     </div>
                 </div>
            ) : (
                <div className="py-12">
                     <div className="relative w-48 h-48 mx-auto mb-10">
                        {/* Magic Mixing Animation */}
                        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-action-green border-r-brand-500 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-4 border-4 border-transparent border-b-action-orange border-l-purple-500 rounded-full animate-spin reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl animate-bounce">🪄</span>
                        </div>
                     </div>
                     
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {state.logs.length > 0 ? state.logs[state.logs.length - 1].message : 'Preparing cauldron...'}
                     </h2>
                     <p className="text-slate-500 dark:text-gray-400 animate-pulse">Please wait, this is actual magic.</p>
                </div>
            )}
        </div>
      )}

      {/* STEP 3: GO (Share Envy) */}
      {state.step === 3 && (
        <div className="max-w-3xl mx-auto w-full animate-slide-up">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
                {/* Confetti Background Effect (CSS only simplified) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-action-green/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="inline-block bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-4 py-1 rounded-full font-bold text-sm mb-6 border border-green-500/20">
                        DEPLOYMENT SUCCESSFUL
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Your App is Ready.<br/>
                        <span className="text-brand-500">Time to brag.</span>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10 relative z-10">
                    {/* QR Code Section */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                        <QRCodeSVG value={URLS.getDeploymentUrl(state.projectName || 'app')} size={180} />
                        <p className="text-center text-xs font-mono mt-2 text-slate-400">SCAN TO VIEW</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 w-full md:w-auto min-w-[280px]">
                        <a 
                            href={URLS.getDeploymentUrl(state.projectName || 'app')} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-slate-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Globe className="w-5 h-5" /> Open Website
                        </a>
                        
                        <button 
                            onClick={copyLink}
                            className="bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                        >
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />} 
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>

                        <button className="bg-[#1DA1F2] text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1a91da] transition-colors shadow-lg shadow-blue-400/20">
                            <Twitter className="w-5 h-5 fill-current" /> Share to Twitter
                        </button>
                    </div>
                </div>

                <div className="text-center border-t border-slate-100 dark:border-white/10 pt-6">
                    <button onClick={() => presenter.ui.navigateTo('dashboard')} className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 font-medium text-sm">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};