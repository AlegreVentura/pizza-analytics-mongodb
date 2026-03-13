import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rutas de autenticación y recursos estáticos: siempre pasan
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Endpoints API protegidos: devolver 401 JSON (no redirigir)
  if (!isAuthenticated && pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'No autorizado. Inicia sesión para continuar.' },
      { status: 401 }
    );
  }

  // Páginas protegidas: redirigir al login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
