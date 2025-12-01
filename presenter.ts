import { DeploymentManager } from "./managers/DeploymentManager";
import { ProjectManager } from "./managers/ProjectManager";
import { UIManager } from "./managers/UIManager";
import { IndexedDBProjectProvider, LocalDeploymentProvider } from "./services/providers";

// The Presenter now composes specific Providers.
// This makes it easy to swap 'IndexedDBProjectProvider' with 'HttpProjectProvider' later.

export class Presenter {
  ui: UIManager;
  project: ProjectManager;
  deployment: DeploymentManager;

  constructor() {
    // 1. Initialize Providers
    // We use IndexedDB for persistence and Local logic for simulation
    const projectProvider = new IndexedDBProjectProvider();
    const deploymentProvider = new LocalDeploymentProvider();

    // 2. Initialize Managers with dependencies
    this.ui = new UIManager();
    this.project = new ProjectManager(projectProvider);
    this.deployment = new DeploymentManager(deploymentProvider, this.project);
  }
}

// Global instance
export const presenter = new Presenter();