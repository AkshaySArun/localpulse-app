
import { clerkMiddleware, createRouteMatcher } from "@/lib/clerk-server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',
  '/manifest.json',
  '/sw.js',
  '/icons/(.*)',
  '/favicon.ico',
]);

export default clerkMiddleware((auth: any, req: any) => {
  if (isPublicRoute(req)) {
    return;
  }

  auth().protect();

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
