import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt, createSession } from '@/app/lib/session';
import defaultUser from '@/utils/default-user';

const isProtectedRoute = (path) => path.startsWith('/pages');

async function _DEMO_logIn() {
  await createSession(defaultUser.id);

  return NextResponse.next();
}

async function redirectUnauthorized(req) {
  return await _DEMO_logIn();

  // In production, you will need to redirect unauthorized users
  // return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
}

export default async function proxy(req) {
  const path = req.nextUrl.pathname;

  if (!isProtectedRoute(path)) {
    return NextResponse.next();
  }

  const cookie = (await cookies()).get('session')?.value;

  if (!cookie) {
    return await redirectUnauthorized(req);
  }

  const session = await decrypt(cookie);

  if (!session?.userId) {
    return await redirectUnauthorized(req);
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
