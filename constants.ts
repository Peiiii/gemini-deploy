export const APP_CONFIG = {
  NAME: 'GeminiDeploy',
  DEPLOYMENT_DOMAIN: 'gemini-deploy.com',
  DEFAULT_AI_MODEL: 'gemini-2.5-flash',
  // Feature flag to switch between Local Mock Data and Real Backend
  USE_MOCK_ADAPTER: true,
  // Base URL for the future real backend
  API_BASE_URL: '/api/v1',
};

export const API_ROUTES = {
  PROJECTS: '/projects',
  DEPLOY: '/deploy',
  ANALYZE: '/analyze',
  STATUS: '/status',
};

export const SECURITY_CONSTANTS = {
  PROXY_KEY_PLACEHOLDER: "PROXY_SECURED_KEY",
  SYSTEM_PROMPT_ROLE: "You are a Senior DevOps Engineer and Security Expert.",
};

export const URLS = {
  GITHUB_BASE: 'https://github.com/',
  getDeploymentUrl: (subdomain: string) => `https://${subdomain.toLowerCase()}.${APP_CONFIG.DEPLOYMENT_DOMAIN}`,
  getProxyUrl: (id: string) => `https://proxy-${id}.${APP_CONFIG.DEPLOYMENT_DOMAIN}/v1`,
};