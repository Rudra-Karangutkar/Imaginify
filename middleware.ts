import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the protected routes
const isProtectedRoute = createRouteMatcher(['/']);

// Export the Clerk middleware with proper handling of public routes
export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ['/api/webhooks/clerk'];

  // Check if the current request is for a public route
  if (publicRoutes.some(route => req.url?.startsWith(route))) {
    return; // Skip authentication for public routes
  }

  // Apply authentication for protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Configure the matcher for the middleware
export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
