export const APP_CONFIG = {
  NAME: 'GeminiDeploy',
  DEPLOYMENT_DOMAIN: 'gemini-deploy.com',
  DEFAULT_AI_MODEL: 'gemini-2.5-flash',
};

export const URLS = {
  GITHUB_BASE: 'https://github.com/',
  getDeploymentUrl: (subdomain: string) => `https://${subdomain.toLowerCase()}.${APP_CONFIG.DEPLOYMENT_DOMAIN}`,
  getProxyUrl: (id: string) => `https://proxy-${id}.${APP_CONFIG.DEPLOYMENT_DOMAIN}/v1`,
};