export type DeploymentMode = 'deployment' | 'marketing'

function resolveDeploymentMode(): DeploymentMode {
  const raw = process.env.DEPLOYMENT_MODE
  if (raw === undefined) {
    return 'deployment'
  }
  if (raw === 'deployment' || raw === 'marketing') {
    return raw
  }
  throw new Error(`DEPLOYMENT_MODE must be "deployment" or "marketing", but got "${raw}"`)
}

// Reads DEPLOYMENT_MODE once, when this module first loads. Pages and route handlers import this
// constant and never read the env variable directly.
export const deploymentMode: DeploymentMode = resolveDeploymentMode()
