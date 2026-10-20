import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/adapters/auth/session";

const protectedRoutes = ["/dashboard", "/projects", "/roadmap", "/shop", "/quiz"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("firebase-session");
  const valid = session?.value
    ? verifySessionToken(session.value)
    : Promise.resolve(null);

  if (!(await valid)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
