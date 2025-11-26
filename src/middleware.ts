// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RESERVED_SLUGS = new Set([
    // Static pages
    'about', 'browse', 'contribute', 'creators', 'docs', 'explore',
    'privacy', 'license', 'contact', 'creator',
    // Future pages
    'new', 'latest', 'popular', 'trending', 'blog', 'roadmap',
    'team', 'faq', 'help', 'support', 'legal', 'terms',
    'search', 'tags', 'categories', 'play',
    // Technical
    'api', 'sitemap', 'robots', 'favicon.ico', 'opengraph-image',
    'manifest', 'icon', 'apple-icon',
    // Single characters (a-z, 0-9)
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
])

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    if (pathname === '/') {
        return NextResponse.next()
    }
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]

    // Handle /@username -> rewrite to /creators/[user]
    if (firstSegment.startsWith('@')) {
        const username = firstSegment.slice(1)
        if (username) {
            const url = request.nextUrl.clone()
            url.pathname = `/creators/${username}`
            return NextResponse.rewrite(url)
        }
    }

    // Redirect /creator/[user] to /@[user] for canonical URLs (legacy support)
    if (firstSegment === 'creator' && segments[1]) {
        const url = request.nextUrl.clone()
        url.pathname = `/@${segments[1]}`
        return NextResponse.redirect(url, 301)
    }

    if (firstSegment === 'content') {
        return NextResponse.next()
    }
    if (firstSegment.startsWith('_')) {
        return NextResponse.next()
    }
    if (RESERVED_SLUGS.has(firstSegment)) {
        return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = `/content${pathname}`
    return NextResponse.rewrite(url)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except static files and internal Next.js paths
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).+)',
    ],
}