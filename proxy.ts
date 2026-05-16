import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  const localeMatch = pathname.match(localePattern);
  const pathWithoutLocale = pathname.replace(localePattern, "") || "/";
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const base = siteUrl ?? request.url;

  if (!localeMatch) {
    const target = token?.value ? `${base}/${locale}/books` : `${base}/${locale}/login`;
    return NextResponse.redirect(target);
  }

  if (!token?.value && pathWithoutLocale !== "/login") {
    return NextResponse.redirect(new URL(`/${locale}/login`, base));
  }

  if (token?.value && pathWithoutLocale === "/login") {
    return NextResponse.redirect(new URL(`/${locale}/books`, base));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|favicon.ico|icon.svg|robots.txt|sitemap.xml|onboarding).*)"],
};
