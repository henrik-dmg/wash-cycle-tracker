import type { Metadata } from 'next'
import { deploymentMode } from '../lib/deployment-mode'
import LandingPage from '../components/landing/LandingPage'
import TrackerHome from '../components/tracker/TrackerHome'

// The same built image runs in either deployment mode, selected by an env variable at container
// start. Force per-request rendering so a build-time default is never baked into a static page.
export const dynamic = 'force-dynamic'

const MARKETING_TITLE = 'Wash Cycle Tracker · Self-hosted washing machine log'
const MARKETING_DESCRIPTION =
  'Log every wash and cleaning on your washing machines, and see the washes since the latest cleaning. Free, self-hosted, and deployable in one click.'

// The tracker home page (deployment mode) has no metadata of its own, so it inherits the
// noindex default from the root layout. Only the marketing home page opts in to indexing.
export function generateMetadata(): Metadata {
  if (deploymentMode !== 'marketing') {
    return {}
  }
  return {
    title: MARKETING_TITLE,
    description: MARKETING_DESCRIPTION,
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
    openGraph: {
      title: MARKETING_TITLE,
      description: MARKETING_DESCRIPTION,
      url: '/',
      siteName: 'Wash Cycle Tracker',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: MARKETING_TITLE,
      description: MARKETING_DESCRIPTION,
    },
  }
}

export default function HomePage() {
  if (deploymentMode === 'marketing') {
    return <LandingPage />
  }
  return <TrackerHome />
}
