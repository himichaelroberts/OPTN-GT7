import { NextRequest, NextResponse } from 'next/server'
import { authGuard } from './utils/passage';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('psg_auth_token');

  if (['/', '/settings', '/wishlist'].includes(request.nextUrl.pathname)) {
     if (!authGuard(authToken)) return NextResponse.redirect(new URL('/login', request.url));
  }
};


