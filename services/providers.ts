import { IProjectProvider, IDeploymentProvider } from './interfaces';
import { Project, BuildLog, DeploymentStatus } from '../types';
import { secureCodeForDeployment } from './geminiService';
import { db } from './db';
import { URLS } from '../constants';

// --- Seed Data for First Run ---
const SEED_PROJECTS: Project[] = [
  {
    id: 'seed-1',
    name: 'travel-planner-ai',
    repoUrl: `${URLS.GITHUB_BASE}johndoe/travel-planner-ai`,
    sourceType: 'github',
    lastDeployed: '2 hours ago',
    status: 'Live',
    url: URLS.getDeploymentUrl('travel-planner'),
    framework: 'React'
  },
  {
    id: 'seed-2',
    name: 'gemini-chatbot-v2',
    repoUrl: `${URLS.GITHUB_BASE}johndoe/gemini-chatbot`,
    sourceType: 'github',
    lastDeployed: '1 day ago',
    status: 'Failed',
    framework: 'Next.js'
  }
];

export class IndexedDBProjectProvider implements IProjectProvider {
  
  async getProjects(): Promise<Project[]> {
    // Check if empty, if so, seed data
    const count = await db.count('projects');
    if (count === 0) {
        for (const p of SEED_PROJECTS) {
            await db.add('projects', p);
        }
    }
    return db.getAll<Project>('projects');
  }

  async createProject(name: string, url: string, sourceType: 'github' | 'zip', identifier: string): Promise<Project> {
    const newProject: Project = {
      id: crypto.randomUUID(), // Use native browser UUID
      name: name,
      repoUrl: identifier,
      sourceType: sourceType,
      lastDeployed: 'Just now',
      status: 'Live',
      url: url,
      framework: 'React', // In a real app, this is detected during build
    };
    
    await db.add('projects', newProject);
    return newProject;
  }
}

export class LocalDeploymentProvider implements IDeploymentProvider {
  async analyzeCode(apiKey: string, sourceCode: string): Promise<{ refactoredCode: string; explanation: string }> {
    // Generate a fake proxy URL to simulate the backend infrastructure
    const proxyUrl = URLS.getProxyUrl(Math.random().toString(36).substring(7));
    return secureCodeForDeployment(apiKey, sourceCode, proxyUrl);
  }

  async startDeployment(
    project: Project,
    onLog: (log: BuildLog) => void,
    onStatusChange: (status: DeploymentStatus) => void
  ): Promise<void> {
    onStatusChange(DeploymentStatus.BUILDING);
    
    // Simulate complex build process
    const jsHash = Math.random().toString(36).substring(2, 10);
    const cssHash = Math.random().toString(36).substring(2, 10);
    
    const detailedLogs = [
        { msg: 'Provisioning build container (img: node-18-alpine)...', delay: 500 },
        { msg: 'Booting worker instance i-0f9a8b7c...', delay: 1200 },
        { msg: `Cloning source from ${project.repoUrl}...`, delay: 1800 },
        { msg: 'Analysing project structure...', delay: 3000 },
        { msg: 'Detected package.json: Framework React (Vite)', delay: 3500, type: 'success' },
        { msg: 'Running "npm install"...', delay: 4000 },
        { msg: 'npm WARN deprecated inflight@1.0.6: This module is not supported', delay: 4500, type: 'warning' },
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
        onLog({ timestamp: now, message: item.msg, type: item.type as any });
    }

    onStatusChange(DeploymentStatus.SUCCESS);
  }
}