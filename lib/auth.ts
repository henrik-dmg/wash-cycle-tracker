import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { genericOAuth } from 'better-auth/plugins'
import prisma from './prisma'

// Every self-hosted deployment points this at its own OpenID Connect provider
// (Keycloak, Authentik, Auth0, ...) through these three environment variables.
const oidcIssuer = process.env.OIDC_ISSUER
const oidcClientId = process.env.OIDC_CLIENT_ID
const oidcClientSecret = process.env.OIDC_CLIENT_SECRET

export const oidcConfigured = Boolean(oidcIssuer && oidcClientId && oidcClientSecret)

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'sqlite' }),
  plugins: oidcConfigured
    ? [
        genericOAuth({
          config: [
            {
              providerId: 'oidc',
              clientId: oidcClientId!,
              clientSecret: oidcClientSecret!,
              discoveryUrl: `${oidcIssuer}/.well-known/openid-configuration`,
            },
          ],
        }),
      ]
    : [],
})
