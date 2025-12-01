import { useDeploymentStore } from '../stores/deploymentStore';
import { secureCodeForDeployment } from '../services/geminiService';
import { DeploymentStatus, BuildLog } from '../types';
import { ProjectManager } from './ProjectManager';
import { UIManager } from './UIManager';

export class DeploymentManager {
  // Dependencies injected or accessed via global stores
  private projectManager: ProjectManager;
  private uiManager: UIManager;

  // We assign these in the Presenter, or pass them in. 
  // For simplicity in this architecture, we can pass them to the init or set them.
  // But to stick to the "no constructor" rule and Arrow functions, we'll just refer to them if needed,
  // or let the Presenter orchestrate the final "Save" step.
  
  // Actually, let's keep managers stateless and just accept dependencies in the methods if strictly needed,
  // or use the Presenter to coordinate. However, for "finishDeployment", we need to call ProjectManager.
  // We will assume the Presenter passes the projectManager instance or we can just instantiate it since it's stateless logic wrapper
  // around a singleton store.
  
  // To avoid circular deps or complex DI, we will just use the actions from the stores or other managers directly here 
  // if they are truly global singletons.

  handleAnalyzeCode = async () => {
    const store = useDeploymentStore.getState();
    const actions = store.actions;

    if (!store.apiKey) {
      alert("Please provide a valid Gemini API Key to enable the security analysis.");
      return;
    }

    actions.setIsAnalyzing(true);
    actions.setExplanation('');

    try {
      const proxyUrl = `https://proxy-${Math.random().toString(36).substring(7)}.gemini-deploy.com/v1`;
      const result = await secureCodeForDeployment(store.apiKey, store.sourceCode, proxyUrl);
      actions.setAnalyzedCode(result.refactoredCode);
      actions.setExplanation(result.explanation);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Check console or API key.");
    } finally {
      actions.setIsAnalyzing(false);
    }
  };

  startBuildSimulation = async (onComplete: () => void) => {
    const store = useDeploymentStore.getState();
    const actions = store.actions;

    actions.setStep(3);
    actions.setDeploymentStatus(DeploymentStatus.BUILDING);
    actions.clearLogs();

    const jsHash = Math.random().toString(36).substring(2, 10);
    const cssHash = Math.random().toString(36).substring(2, 10);
    const repoUrl = store.repoUrl;
    const zipFile = store.zipFile;
    const sourceType = store.sourceType;

    const detailedLogs = [
        { msg: 'Provisioning build container (img: node-18-alpine)...', delay: 500 },
        { msg: 'Booting worker instance i-0f9a8b7c...', delay: 1200 },
        ...(sourceType === 'github' 
            ? [{ msg: `git clone ${repoUrl} .`, delay: 1800 }, { msg: 'HEAD is now at a1b2c3d (feat: initial commit)', delay: 2500 }]
            : [{ msg: `Unpacking ${zipFile?.name || 'archive.zip'} (1.4MB)...`, delay: 1000 }, { msg: 'Verified archive integrity.', delay: 1500 }]
        ),
        { msg: 'Analysing project structure...', delay: 3000 },
        { msg: 'Detected package.json: Framework React (Vite)', delay: 3500, type: 'success' },
        { msg: 'Running "npm install"...', delay: 4000 },
        { msg: 'npm WARN deprecated inflight@1.0.6: This module is not supported', delay: 4500, type: 'warning' },
        { msg: 'npm WARN deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported', delay: 4600, type: 'warning' },
        { msg: 'reify:fsevents: timing reifyNode:node_modules/fsevents Completed in 304ms', delay: 5500 },
        { msg: 'added 842 packages, and audited 843 packages in 4s', delay: 6500, type: 'success' },
        { msg: 'Injecting environment variables...', delay: 7000 },
        { msg: 'Applying AI Security Patch (src/api/client.ts)...', delay: 7500, type: 'info' },
        { msg: 'Running "npm run build"...', delay: 8500 },
        { msg: '> vite build', delay: 9000 },
        { msg: 'vite v5.2.0 building for production...', delay: 9500 },
        { msg: 'transforming...', delay: 10500 },
        { msg: '✓ 342 modules transformed.', delay: 12000, type: 'success' },
        { msg: 'rendering chunks...', delay: 12500 },
        { msg: 'computing gzip size...', delay: 13000 },
        { msg: 'dist/index.html                   0.46 kB │ gzip:  0.30 kB', delay: 13500 },
        { msg: `dist/assets/index-${cssHash}.css    1.24 kB │ gzip:  0.62 kB`, delay: 13600 },
        { msg: `dist/assets/index-${jsHash}.js      142.32 kB │ gzip: 46.12 kB`, delay: 13700 },
        { msg: '✓ built in 4.45s', delay: 14000, type: 'success' },
        { msg: 'Verifying DNS propagation...', delay: 15500 },
        { msg: 'Deployment complete!', delay: 16500, type: 'success' },
    ];

    let currentDelay = 0;
    for (const item of detailedLogs) {
        const delay = item.delay - currentDelay;
        currentDelay = item.delay;
        
        await new Promise(r => setTimeout(r, delay));
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        actions.addLog({ timestamp: now, message: item.msg, type: item.type as any });
    }

    actions.setDeploymentStatus(DeploymentStatus.SUCCESS);
    onComplete();
  };

  resetWizard = () => {
    useDeploymentStore.getState().actions.reset();
  }

  handleSourceChange = (type: 'github' | 'zip') => {
    useDeploymentStore.getState().actions.setSourceType(type);
  }

  handleFileDrop = (file: File) => {
    if (file.name.endsWith('.zip')) {
      useDeploymentStore.getState().actions.setZipFile(file);
    } else {
      alert('Please upload a .zip file');
    }
  }

  autoProjectName = (val: string, type: 'github' | 'zip') => {
     if (type === 'github') {
        const parts = val.split('/');
        const name = parts[parts.length - 1]?.replace('.git', '') || '';
        if(name) useDeploymentStore.getState().actions.setProjectName(name);
     }
  }
}