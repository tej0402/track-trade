import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization')
    const url = req.nextUrl

    let user = 'undefined'
    let pwd = 'undefined'
    let validUser = process.env.AUTH_USER
    let validPass = process.env.AUTH_PASS

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        const [u, p] = atob(authValue).split(':')
        user = u
        pwd = p

        if (user === validUser && pwd === validPass) {
            return NextResponse.next()
        }
    }

    url.pathname = '/api/auth'

    return new NextResponse('Auth Required.', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    })
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
