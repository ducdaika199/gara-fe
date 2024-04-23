import { NextRequest, NextResponse } from 'next/server';
import paths, { checkPathIsProtected } from './routes/path';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon|sw.js|silent-check-sso.html|images).*)',
  ],
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // Direction for root path
  console.log(pathname, '------pathname---------');
  if (pathname === paths.root) {
    if (req.cookies.get('access_token')?.value) {
      return NextResponse.redirect(new URL(`${paths.orders}`, req.url));
    }
    return NextResponse.redirect(new URL(paths.login, req.url));
  }

  if (
    checkPathIsProtected(pathname) &&
    !req.cookies.get('access_token')?.value
  ) {
    return NextResponse.redirect(new URL(paths.login, req.url));
  }
  return NextResponse.next();
}
