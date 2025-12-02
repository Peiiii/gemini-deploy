import { IDeploymentProvider } from '../interfaces';
import { Project, BuildLog, DeploymentStatus } from '../../types';
import { secureCodeForDeployment } from '../geminiService';
import { URLS } from '../../constants';

export class LocalDeploymentProvider implements IDeploymentProvider {
  async analyzeCode(apiKey: string, sourceCode: string): Promise<{ refactoredCode: string; explanation: string }> {
    // Generate a fake proxy URL to simulate the backend infrastructure
    const proxyUrl = URLS.getProxyUrl(Math.random().toString(36).substring(7));
    
    // Simulate a slight delay for the "Magic" feel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return secureCodeForDeployment(apiKey, sourceCode, proxyUrl);
  }

  async startDeployment(
    project: Project,
    onLog: (log: BuildLog) => void,
    onStatusChange: (status: DeploymentStatus) => void
  ): Promise<void> {
    onStatusChange(DeploymentStatus.BUILDING);
    
    // Simulate complex build process but faster for better UX
    const jsHash = Math.random().toString(36).substring(2, 10);
    const cssHash = Math.random().toString(36).substring(2, 10);
    
    const detailedLogs = [
        { msg: 'Initiating launch sequence...', delay: 200 },
        { msg: 'Connecting to cloud engines...', delay: 800 },
        { msg: `Fetching source from ${project.repoUrl}...`, delay: 1500 },
        { msg: 'Analyzing project structure...', delay: 2000 },
        { msg: 'Found React application', delay: 2200, type: 'success' },
        { msg: 'Installing dependencies (this might take a moment)...', delay: 2500 },
        { msg: 'Packages installed successfully', delay: 3500, type: 'success' },
        { msg: 'Securing environment variables...', delay: 3800 },
        { msg: 'Applying AI Security Patch', delay: 4200, type: 'info' },
        { msg: 'Building optimized assets...', delay: 4800 },
        { msg: 'Optimizing images and fonts...', delay: 5500 },
        { msg: `Generated index-${jsHash}.js`, delay: 5800 },
        { msg: '✓ Build successful', delay: 6200, type: 'success' },
        { msg: 'Propagating to global edge network...', delay: 7000 },
        { msg: 'Verifying SSL certificates...', delay: 7500 },
        { msg: 'Deployment complete! You are live.', delay: 8000, type: 'success' },
    ];

    let currentDelay = 0;
    for (const item of detailedLogs) {
        const delay = item.delay - currentDelay;
        currentDelay = item.delay;
        
        await new Promise(r => setTimeout(r, delay));
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        onLog({ timestamp: now, message: item.msg, type: item.type as any });
    }

    onStatusChange(DeploymentStatus.SUCCESS);
  }
}