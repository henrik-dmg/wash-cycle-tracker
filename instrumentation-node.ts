export async function registerNode() {
  try {
    // Loading this module validates DEPLOYMENT_MODE. An invalid value throws here, before the
    // server accepts any request, instead of surfacing on the first page or API call.
    await import('./lib/deployment-mode')
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    // Next.js logs a failed instrumentation hook but otherwise keeps serving requests (as 500s).
    // Exit instead, so an invalid config stops the container rather than running broken.
    process.exit(1)
  }
}

await registerNode()
