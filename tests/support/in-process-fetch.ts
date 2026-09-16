import { NextRequest, NextResponse } from 'next/server'

// A `fetch`-compatible function that dispatches to the app's route handlers directly, in-process,
// instead of opening a network port. Stub it onto `globalThis.fetch` so the unmodified API store
// is exercised exactly as it runs in the browser.

type RouteHandler = (request: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<Response> | Response

interface RouteEntry {
  pattern: RegExp
  paramNames: string[]
  load: () => Promise<Record<string, unknown>>
}

const routes: RouteEntry[] = [
  {
    pattern: /^\/api\/machines\/([^/]+)\/entries\/([^/]+)$/,
    paramNames: ['id', 'entryId'],
    load: () => import('../../app/api/machines/[id]/entries/[entryId]/route'),
  },
  {
    pattern: /^\/api\/machines\/([^/]+)\/entries$/,
    paramNames: ['id'],
    load: () => import('../../app/api/machines/[id]/entries/route'),
  },
  {
    pattern: /^\/api\/machines\/([^/]+)\/cleaning-interval$/,
    paramNames: ['id'],
    load: () => import('../../app/api/machines/[id]/cleaning-interval/route'),
  },
  {
    pattern: /^\/api\/machines\/([^/]+)$/,
    paramNames: ['id'],
    load: () => import('../../app/api/machines/[id]/route'),
  },
  {
    pattern: /^\/api\/machines$/,
    paramNames: [],
    load: () => import('../../app/api/machines/route'),
  },
]

export function createInProcessFetch(): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const rawUrl = typeof input === 'string' ? input : input.toString()
    const url = new URL(rawUrl, 'http://localhost')
    const method = (init?.method ?? 'GET').toUpperCase()

    const route = routes.find((candidate) => candidate.pattern.test(url.pathname))
    if (!route) {
      throw new Error(`No route registered for ${method} ${url.pathname}`)
    }

    const match = url.pathname.match(route.pattern) as RegExpMatchArray
    const params = Object.fromEntries(route.paramNames.map((name, index) => [name, match[index + 1]]))

    const handlers = await route.load()
    const handler = handlers[method] as RouteHandler | undefined
    if (!handler) {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }

    const request = new NextRequest(url, { method, headers: init?.headers, body: init?.body as BodyInit | null | undefined })
    return handler(request, { params: Promise.resolve(params) })
  }) as typeof fetch
}
