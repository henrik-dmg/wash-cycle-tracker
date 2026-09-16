import type { MetadataRoute } from 'next'
import { deploymentMode } from '../lib/deployment-mode'
import { SITE_URL } from '../lib/site-url'

// A deployment is one person's own tracker, so every crawler must stay out of it. Only the
// marketing site is public and lists a sitemap.
export default function robots(): MetadataRoute.Robots {
  if (deploymentMode !== 'marketing') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
