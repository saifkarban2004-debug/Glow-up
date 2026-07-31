import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === '/admin/login';
  
  if (!isLoggedIn && !isOnLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }
  
  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
