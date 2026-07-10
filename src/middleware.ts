import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function addSecurityHeaders(res: NextResponse) {
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  return res;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  let pathname = request.nextUrl.pathname;

  // 0. Trailing-slash normalization (skip for file extensions)
  if (
    !pathname.endsWith("/") &&
    !pathname.includes(".") &&
    !pathname.startsWith("/api/")
  ) {
    pathname = pathname + "/";
    const url = new URL(pathname, request.url);
    return addSecurityHeaders(NextResponse.redirect(url, 301));
  }

  // 1. Block all vercel.app domain access except API routes
  if (host.includes("vercel.app") && !pathname.startsWith("/api/")) {
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Admin routes bypass i18n entirely
  if (pathname.startsWith("/admin")) {
    return addSecurityHeaders(NextResponse.next());
  }

  // If someone accesses /fr/admin/*, rewrite to /admin/*
  if (pathname.startsWith("/fr/admin") || pathname.startsWith("/en/admin")) {
    const newPath = pathname.replace(/^\/(fr|en)\/admin/, "/admin");
    return addSecurityHeaders(NextResponse.rewrite(new URL(newPath, request.url)));
  }

  // 3. i18n routing
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    return addSecurityHeaders(
      NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
    );
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logos|logo|videos|images|guide-images).*)"],
};
