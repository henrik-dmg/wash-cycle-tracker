import type { MetadataRoute } from 'next'
import { deploymentMode } from '../lib/deployment-mode'
import { SITE_URL } from '../lib/site-url'

// Only the marketing site has public pages to list. A deployment is private, and robots.ts
// already disallows crawling it entirely.
export default function sitemap(): MetadataRoute.Sitemap {
  if (deploymentMode !== 'marketing') {
    return []
  }
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/demo`, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
