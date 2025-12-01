import { DeploymentManager } from "./managers/DeploymentManager";
import { ProjectManager } from "./managers/ProjectManager";
import { UIManager } from "./managers/UIManager";

export class Presenter {
  ui: UIManager;
  project: ProjectManager;
  deployment: DeploymentManager;

  constructor() {
    this.ui = new UIManager();
    this.project = new ProjectManager();
    this.deployment = new DeploymentManager();
  }
}

// Global instance for usage outside of React context if needed, though Context is preferred.
export const presenter = new Presenter();