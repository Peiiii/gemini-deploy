import React, { useRef, useEffect, useState } from 'react';
import { useDeploymentStore } from '../stores/deploymentStore';
import { usePresenter } from '../contexts/PresenterContext';
import { DeploymentStatus } from '../types';
import { Twitter, Copy, Check, Sparkles, UploadCloud, Rocket, Globe, Github, Terminal as TerminalIcon, ShieldCheck, Cpu, Code2, ArrowRight, Play, FileCode, Box } from 'lucide-react';
import { URLS } from '../constants';
import { QRCodeSVG } from 'qrcode.react';
import { Terminal } from '../components/Terminal';

export const NewDeployment: React.FC = () => {
  const presenter = usePresenter();
  const state = useDeploymentStore(); 
  
  useEffect(() => {
    return () => presenter.deployment.resetWizard();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-6 md:p-10 flex flex-col items-center animate-fade-in">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/20">
          <Sparkles className="w-3 h-3" /> Magic Box Deployment
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Publish your <span className="text-brand-500">Gemini App</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-lg">
           Securely deploy your AI Studio exports to the edge. We handle the API keys, proxying, and hosting.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl">
         {state.step === 1 && <SourceSelectionStep />}
         {state.step === 2 && <BuildProcessStep />}
         {state.step === 3 && <SuccessStep />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SourceSelectionStep: React.FC = () => {
    const presenter = usePresenter();
    const state = useDeploymentStore(); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeSource, setActiveSource] = useState<'github' | 'zip'>('github');
    const [githubUrl, setGithubUrl] = useState('');
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        presenter.deployment.handleFileDrop(e.target.files[0]);
        state.actions.setSourceType('zip');
        // Small delay for visual feedback
        setTimeout(() => state.actions.setStep(2), 500);
      }
    };
  
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        presenter.deployment.handleFileDrop(e.dataTransfer.files[0]);
        state.actions.setSourceType('zip');
        setActiveSource('zip');
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
            {/* ZIP UPLOAD CARD */}
            <div 
                className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col ${
                    activeSource === 'zip' 
                    ? 'bg-white dark:bg-white/5 border-brand-500 ring-4 ring-brand-500/10' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-brand-500/50'
                }`}
                onClick={() => { setActiveSource('zip'); fileInputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setActiveSource('zip'); }}
                onDrop={handleDrop}
            >
                 <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Box className="w-24 h-24 text-slate-100 dark:text-white/5 rotate-12 group-hover:rotate-[20deg] transition-transform" />
                 </div>
                 
                 <div className="p-8 flex-1 flex flex-col items-center justify-center text-center z-10">
                    <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <UploadCloud className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Zip</h3>
                    <p className="text-slate-500 dark:text-gray-400 max-w-xs mx-auto mb-8">
                        Export your project from Google AI Studio and drop the .zip file here.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 group-hover:underline">
                        Select File <ArrowRight className="w-4 h-4" />
                    </span>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={handleFileChange} />
                 </div>
            </div>

            {/* GITHUB IMPORT CARD */}
            <div 
                className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 flex flex-col ${
                    activeSource === 'github' 
                    ? 'bg-white dark:bg-white/5 border-brand-500 ring-4 ring-brand-500/10' 
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-brand-500/50'
                }`}
                onClick={() => setActiveSource('github')}
            >
                 <div className="absolute top-0 right-0 p-4 opacity-50">
                    <Github className="w-24 h-24 text-slate-100 dark:text-white/5 -rotate-12 group-hover:-rotate-[20deg] transition-transform" />
                 </div>

                 <div className="p-8 flex-1 flex flex-col justify-center z-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6">
                        <Github className="w-8 h-8 text-slate-900 dark:text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Import from GitHub</h3>
                    <p className="text-slate-500 dark:text-gray-400 mb-8">
                        Connect a public repository to deploy automatically.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <input 
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="github.com/username/repo"
                                className="w-full pl-4 pr-4 py-4 bg-slate-50 dark:bg-black/20 border-2 border-slate-200 dark:border-white/10 rounded-xl focus:border-brand-500 focus:outline-none transition-colors text-slate-900 dark:text-white font-mono text-sm"
                            />
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleGithubSubmit(); }}
                            disabled={!githubUrl}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            Import Repository <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                 </div>
            </div>

            {/* Recent Repos (Mock) */}
            <div className="lg:col-span-2 mt-4">
                 <h4 className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-4">Recent Projects</h4>
                 <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3].map((i) => (
                        <button key={i} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-brand-500/50 transition-colors min-w-[200px] text-left">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Code2 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">my-gemini-app-{i}</p>
                                <p className="text-xs text-slate-400">2 days ago</p>
                            </div>
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    )
}


const BuildProcessStep: React.FC = () => {
    const presenter = usePresenter();
    const state = useDeploymentStore();

    useEffect(() => {
        if (!state.isAnalyzing && state.deploymentStatus === DeploymentStatus.IDLE) {
             // Auto start analysis then build
             const run = async () => {
                 await presenter.deployment.handleAnalyzeCode();
                 presenter.deployment.startBuildSimulation(() => {
                    const identifier = state.sourceType === 'github' ? state.repoUrl : (state.zipFile?.name || 'archive.zip');
                    const url = URLS.getDeploymentUrl(state.projectName || 'my-awesome-app');
                    presenter.project.addProject(state.projectName || 'My App', url, state.sourceType, identifier);
                    state.actions.setStep(3);
                 });
             };
             run();
        }
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px] animate-fade-in">
            {/* Status Panel */}
            <div className="lg:w-1/3 flex flex-col gap-4">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex-1 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-brand-500" /> System Status
                    </h3>
                    
                    <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-white/5 z-0"></div>

                        {/* Step 1: Analysis */}
                        <div className="relative z-10 flex gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                state.isAnalyzing 
                                ? 'bg-brand-500 border-brand-500 text-white animate-pulse' 
                                : state.analyzedCode ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-800 border-slate-300 text-slate-300'
                            }`}>
                                {state.analyzedCode ? <Check className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${state.analyzedCode ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>Security Analysis</p>
                                <p className="text-xs text-slate-500">Scanning for API keys & vulnerabilities</p>
                            </div>
                        </div>

                        {/* Step 2: Building */}
                        <div className="relative z-10 flex gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                state.deploymentStatus === DeploymentStatus.BUILDING
                                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                                : state.deploymentStatus === DeploymentStatus.SUCCESS ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-800 border-slate-300 text-slate-300'
                            }`}>
                                {state.deploymentStatus === DeploymentStatus.SUCCESS ? <Check className="w-4 h-4"/> : <Box className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${state.deploymentStatus === DeploymentStatus.BUILDING ? 'text-blue-500' : 'text-slate-900 dark:text-white'}`}>Build & Package</p>
                                <p className="text-xs text-slate-500">Compiling assets and dependencies</p>
                            </div>
                        </div>

                        {/* Step 3: Edge Deploy */}
                        <div className="relative z-10 flex gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                state.deploymentStatus === DeploymentStatus.DEPLOYING
                                ? 'bg-purple-500 border-purple-500 text-white animate-pulse'
                                : state.deploymentStatus === DeploymentStatus.SUCCESS ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-800 border-slate-300 text-slate-300'
                            }`}>
                                {state.deploymentStatus === DeploymentStatus.SUCCESS ? <Check className="w-4 h-4"/> : <Globe className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">Edge Propagation</p>
                                <p className="text-xs text-slate-500">Distributing to global CDN nodes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-900/5 border border-brand-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-brand-500" />
                        <span className="font-bold text-brand-700 dark:text-brand-300 text-sm">Gemini AI Shield</span>
                    </div>
                    <p className="text-xs text-brand-800 dark:text-brand-400/80 leading-relaxed">
                        {state.explanation || "Initializing security agent..."}
                    </p>
                </div>
            </div>

            {/* Terminal Panel */}
            <div className="lg:w-2/3 flex flex-col bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="bg-slate-900/50 p-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                        <TerminalIcon className="w-3 h-3" /> build-server-01
                    </div>
                </div>
                <div className="relative flex-1 overflow-hidden">
                     <Terminal logs={state.logs} className="h-full pb-10" />
                     {/* Overlay Scan Line Effect */}
                     <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-brand-500/5 to-transparent h-20 w-full animate-scan opacity-30"></div>
                </div>
            </div>
        </div>
    );
};

const SuccessStep: React.FC = () => {
    const presenter = usePresenter();
    const state = useDeploymentStore();
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        const url = URLS.getDeploymentUrl(state.projectName || 'app');
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                
                <div className="bg-gradient-to-r from-brand-600 to-purple-700 p-1 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Deployment Successful</span>
                </div>

                <div className="grid md:grid-cols-2">
                    {/* Visual Side */}
                    <div className="bg-slate-100 dark:bg-black/20 p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5">
                        <div className="relative w-full aspect-[4/3] bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col group">
                            {/* Browser Mockup Header */}
                            <div className="h-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center px-2 gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            </div>
                            {/* Preview Content */}
                            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative">
                                <div className="text-center">
                                    <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs font-mono text-slate-400">Preview Mode</p>
                                </div>
                                <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                    <a href={URLS.getDeploymentUrl(state.projectName)} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1">
                                        Open App <ArrowRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Side */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">It's Live! 🚀</h2>
                        <p className="text-slate-500 dark:text-gray-400 mb-8">
                            Your app has been deployed to the edge. It is now accessible globally.
                        </p>

                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 mb-6 flex items-center justify-between gap-3 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Globe className="w-5 h-5 text-brand-500 flex-shrink-0" />
                                <span className="font-mono text-sm text-slate-600 dark:text-gray-300 truncate">
                                    {URLS.getDeploymentUrl(state.projectName || 'app')}
                                </span>
                            </div>
                            <button onClick={copyLink} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-brand-500 transition-colors">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <a 
                                href={URLS.getDeploymentUrl(state.projectName)} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-current" /> Visit
                            </a>
                            <button className="px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <QRCodeSVG value={URLS.getDeploymentUrl(state.projectName)} size={20} />
                            </button>
                            <button className="px-4 py-3 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a91da] transition-colors">
                                <Twitter className="w-5 h-5 fill-current" />
                            </button>
                        </div>

                        <button onClick={() => presenter.ui.navigateTo('dashboard')} className="mt-8 text-center text-sm font-bold text-slate-400 hover:text-brand-500 transition-colors">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
