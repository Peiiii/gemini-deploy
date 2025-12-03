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
    
    // Magical log sequence - "Magic Toy" Vibe
    const magicLogs = [
        { msg: '🪄 Sprinkling magic dust...', delay: 500 },
        { msg: '📦 Opening your magic package...', delay: 1500 },
        { msg: '✨ Converting text to pure energy...', delay: 2500 },
        { msg: '⚡ Charging the crystals...', delay: 3000 },
        { msg: '🛡️ Casting protection spells...', delay: 4000, type: 'info' },
        { msg: '🔮 Summoning the internet spirits...', delay: 5000 },
        { msg: '🧪 Mixing the final potion...', delay: 6000 },
        { msg: '🚀 Almost there...', delay: 7000 },
        { msg: '💥 BOOM! Your app is LIVE!', delay: 8000, type: 'success' },
    ];

    let currentDelay = 0;
    for (const item of magicLogs) {
        const delay = item.delay - currentDelay;
        currentDelay = item.delay;
        
        await new Promise(r => setTimeout(r, delay));
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        onLog({ timestamp: now, message: item.msg, type: item.type as any });
    }

    onStatusChange(DeploymentStatus.SUCCESS);
  }
}