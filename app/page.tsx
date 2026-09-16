import { deploymentMode } from '../lib/deployment-mode'
import LandingPage from '../components/landing/LandingPage'
import TrackerHome from '../components/tracker/TrackerHome'

// The same built image runs in either deployment mode, selected by an env variable at container
// start. Force per-request rendering so a build-time default is never baked into a static page.
export const dynamic = 'force-dynamic'

export default function HomePage() {
  if (deploymentMode === 'marketing') {
    return <LandingPage />
  }
  return <TrackerHome />
}
