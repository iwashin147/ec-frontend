import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  defaultLocale: 'ja',
  locales: ['en', 'ja'],
});

export const config = {
  matcher: ['/', '/(ja|en)/:path*'],
};
