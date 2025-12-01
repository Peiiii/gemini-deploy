import { useProjectStore } from '../stores/projectStore';
import { Project } from '../types';

export class ProjectManager {
  addProject = (
    name: string,
    url: string,
    sourceType: 'github' | 'zip',
    sourceIdentifier: string
  ) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      repoUrl: sourceIdentifier,
      sourceType: sourceType,
      lastDeployed: 'Just now',
      status: 'Live',
      url: url,
      framework: 'React',
    };
    useProjectStore.getState().actions.addProject(newProject);
  };
}