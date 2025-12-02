import React, { useRef, useEffect, useState } from 'react';
import { useDeploymentStore } from '../stores/deploymentStore';
import { usePresenter } from '../contexts/PresenterContext';
import { DeploymentStatus } from '../types';
import { Terminal } from '../components/Terminal';
import { ArrowRight, ShieldCheck, Github, Globe, Loader2, Sparkles, FolderArchive, Upload, FileCode, X, Check, ExternalLink, Lock, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { URLS } from '../constants';

const STEPS = [
    { id: 1, label: 'Import', desc: 'Connect Source' },
    { id: 2, label: 'Secure', desc: 'AI Safety Check' },
    { id: 3, label: 'Live', desc: 'Launch App' }
];

export const NewDeployment: React.FC = () => {
  const presenter = usePresenter();
  const state = useDeploymentStore(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    return () => presenter.deployment.resetWizard();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      presenter.deployment.handleFileDrop(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      presenter.deployment.handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleDeployStart = () => {
    presenter.deployment.startBuildSimulation(() => {
       const identifier = state.sourceType === 'github' ? state.repoUrl : (state.zipFile?.name || 'archive.zip');
       const url = URLS.getDeploymentUrl(state.projectName);
       presenter.project.addProject(state.projectName, url, state.sourceType, identifier);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Deploy Your Project</h1>
        <p className="text-lg text-slate-500 dark:text-gray-400">Bring your own code. We handle the hosting & security.</p>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center justify-center mb-16 relative max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-gray-800 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-brand-500 -z-10 rounded-full transition-all duration-500 ease-out" 
             style={{ width: `${((state.step - 1) / (STEPS.length - 1)) * 100}%` }}></div>

        {STEPS.map((s, i) => {
            const isActive = i + 1 === state.step;
            const isCompleted = i + 1 < state.step;
            return (
                <div key={i} className="flex-1 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 z-10 bg-white dark:bg-app-bg ${
                        isActive ? 'border-brand-500 text-brand-600 dark:text-brand-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-110' : 
                        isCompleted ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-100 dark:border-gray-800 text-slate-300 dark:text-gray-600'
                    }`}>
                        {isCompleted ? <Check className="w-6 h-6" /> : i + 1}
                    </div>
                    <div className={`mt-4 text-center transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-gray-600'}`}>
                        <span className="text-sm font-bold block">{s.label}</span>
                    </div>
                </div>
            )
        })}
      </div>

      {/* Step 1: Import Source */}
      {state.step === 1 && (
        <div className="space-y-8 animate-slide-up max-w-3xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Option A: GitHub */}
             <button
                onClick={() => state.actions.setSourceType('github')}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-4 group overflow-hidden ${
                    state.sourceType === 'github' 
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 ring-4 ring-brand-500/10 shadow-xl scale-[1.02]' 
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg'
                }`}
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${state.sourceType === 'github' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30'}`}>
                    <Github className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">GitHub Repo</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Import directly from URL</p>
                </div>
                {state.sourceType === 'github' && <div className="absolute top-4 right-4 text-brand-500"><Check className="w-6 h-6" /></div>}
             </button>

             {/* Option B: Zip Upload */}
             <button
                onClick={() => {
                    state.actions.setSourceType('zip');
                    // Automatically trigger file dialog if switching to zip
                    if(state.sourceType !== 'zip') setTimeout(() => fileInputRef.current?.click(), 100);
                }}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-4 group overflow-hidden ${
                    state.sourceType === 'zip' 
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 ring-4 ring-brand-500/10 shadow-xl scale-[1.02]' 
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg'
                }`}
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${state.sourceType === 'zip' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30'}`}>
                    <FolderArchive className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload File</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Drag & drop .zip archive</p>
                </div>
                {state.sourceType === 'zip' && <div className="absolute top-4 right-4 text-brand-500"><Check className="w-6 h-6" /></div>}
             </button>
          </div>

          {/* Dynamic Input Area */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/5 animate-fade-in">
             {state.sourceType === 'github' ? (
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2 ml-1">Paste Repository URL</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            value={state.repoUrl}
                            onChange={(e) => {
                                state.actions.setRepoUrl(e.target.value);
                                presenter.deployment.autoProjectName(e.target.value, 'github');
                            }}
                            placeholder="https://github.com/username/project"
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-mono text-sm"
                        />
                    </div>
                </div>
             ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white dark:hover:bg-white/5 transition-colors group"
                >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={handleFileChange} />
                    {state.zipFile ? (
                        <div className="animate-fade-in">
                            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FileCode className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{state.zipFile.name}</h4>
                            <p className="text-sm text-green-600 dark:text-green-400">Ready to upload</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Click to browse</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-400">or drag file here</p>
                        </>
                    )}
                </div>
             )}
          </div>
            
          <div className="flex justify-end pt-2">
            <button 
              onClick={() => (state.sourceType === 'github' ? state.repoUrl : state.zipFile) && state.actions.setStep(2)}
              disabled={!(state.sourceType === 'github' ? state.repoUrl : state.zipFile)}
              className="bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-brand-500/40 w-full md:w-auto justify-center"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Simplified "Magic" Security Check */}
      {state.step === 2 && (
        <div className="animate-slide-up max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
             
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-900/10 dark:to-transparent pointer-events-none"></div>

             <div className="relative z-10">
                {state.analyzedCode ? (
                    // State: Success
                    <div className="animate-fade-in">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            <ShieldCheck className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Code Secure</h2>
                        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            We've configured the secure proxy for your app. It's ready to go live.
                        </p>
                    </div>
                ) : (
                    // State: Idle or Analyzing
                    <div className="py-8">
                        {state.isAnalyzing ? (
                             <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-brand-200 dark:border-brand-900 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-brand-500 animate-pulse" />
                                </div>
                             </div>
                        ) : (
                            <div className="w-32 h-32 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Lock className="w-12 h-12 text-slate-400 dark:text-gray-500" />
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {state.isAnalyzing ? 'Optimizing Security...' : 'Security Check'}
                        </h2>
                        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {state.isAnalyzing 
                                ? 'Scanning for exposed keys and configuring edge proxies.' 
                                : 'We will automatically detect API keys and move them to a secure vault before deploying.'}
                        </p>
                    </div>
                )}

                {!state.analyzedCode && !state.isAnalyzing && (
                    <button 
                        onClick={() => presenter.deployment.handleAnalyzeCode()}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-3"
                    >
                        <Sparkles className="w-5 h-5" /> Secure & Continue
                    </button>
                )}

                {state.analyzedCode && (
                    <div className="flex flex-col gap-4">
                         <button 
                            onClick={handleDeployStart}
                            className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
                        >
                            <RocketIcon className="w-5 h-5" /> Launch Now
                        </button>
                        <div className="flex justify-between items-center px-2">
                             <button onClick={() => state.actions.setStep(1)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Back</button>
                             <button onClick={() => setShowTechnical(!showTechnical)} className="text-brand-600 text-sm font-medium hover:underline flex items-center gap-1">
                                {showTechnical ? 'Hide' : 'Show'} technical details {showTechnical ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                             </button>
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* Technical Details (Hidden by default for beginners) */}
          {showTechnical && state.analyzedCode && (
            <div className="mt-6 animate-slide-up">
                <div className="bg-[#0d1117] rounded-xl border border-gray-800 p-4 font-mono text-xs overflow-x-auto text-gray-300">
                    <p className="text-gray-500 mb-2">// Proposed Changes to client.ts</p>
                    <pre className="text-green-400">{state.analyzedCode}</pre>
                    <div className="mt-4 pt-4 border-t border-gray-800 text-gray-500">
                        <span className="text-brand-400 font-bold">AI Note:</span> {state.explanation}
                    </div>
                </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Friendly Deployment Progress */}
      {state.step === 3 && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
           
           {/* Status Card */}
           <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
             {state.deploymentStatus === DeploymentStatus.SUCCESS ? (
                <div className="animate-slide-up">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">You are Live!</h2>
                    <p className="text-slate-500 mb-8">Your application is running on the edge.</p>
                    
                    <a href={URLS.getDeploymentUrl(state.projectName)} target="_blank" rel="noreferrer" className="block w-full bg-slate-900 dark:bg-white text-white dark:text-black p-4 rounded-xl font-bold text-lg mb-4 hover:scale-[1.02] transition-transform">
                        Open Website
                    </a>
                    <button onClick={() => presenter.ui.navigateTo('dashboard')} className="text-slate-500 hover:text-slate-800 font-medium">
                        Back to Dashboard
                    </button>
                </div>
             ) : state.deploymentStatus === DeploymentStatus.FAILED ? (
                <div>
                     <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 mb-6">We couldn't launch the app. Check the logs for details.</p>
                    <button onClick={() => state.actions.setStep(1)} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg font-medium">Try Again</button>
                </div>
             ) : (
                <div className="py-6">
                    <div className="relative w-full max-w-sm mx-auto mb-8">
                         {/* Friendly Progress Bar */}
                         <div className="h-4 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-brand-500 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                         </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white animate-pulse">Building your website...</h2>
                    <p className="text-slate-500 dark:text-gray-400 mt-2">This usually takes about 15 seconds.</p>
                </div>
             )}
           </div>

           {/* Collapsible Logs (Hidden by default for simplicity) */}
           <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <button 
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                  <span className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" /> 
                    {state.deploymentStatus === DeploymentStatus.SUCCESS ? 'View Build Logs' : 'Show Technical Details'}
                  </span>
                  {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {(showTechnical || state.deploymentStatus === DeploymentStatus.FAILED) && (
                  <Terminal logs={state.logs} className="h-64" />
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const RocketIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
)