import { create } from 'zustand';
import { Project } from '../types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'travel-planner-ai',
    repoUrl: 'https://github.com/johndoe/travel-planner-ai',
    sourceType: 'github',
    lastDeployed: '2 hours ago',
    status: 'Live',
    url: 'https://travel-planner.gemini-deploy.com',
    framework: 'React'
  },
  {
    id: '2',
    name: 'gemini-chatbot-v2',
    repoUrl: 'https://github.com/johndoe/gemini-chatbot',
    sourceType: 'github',
    lastDeployed: '1 day ago',
    status: 'Failed',
    framework: 'Next.js'
  }
];

interface ProjectState {
  projects: Project[];
  actions: {
    addProject: (project: Project) => void;
    setProjects: (projects: Project[]) => void;
  };
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: INITIAL_PROJECTS,
  actions: {
    addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
    setProjects: (projects) => set({ projects }),
  },
}));