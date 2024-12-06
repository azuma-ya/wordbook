import NextAuth from "next-auth";

import authConfig from "../auth.config";
import { DEFAULT_LOGIN_REDIRECT } from "./route";
import { publicRoutes, authRoutes } from "./route";
import { apiAuthPrefix } from "./route";
import { apiHonoPrefix } from "./route";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiHonoRoute = nextUrl.pathname.startsWith(apiHonoPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute || isApiHonoRoute) {
    return;
  }
  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }
  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/api(.*)"],
};
