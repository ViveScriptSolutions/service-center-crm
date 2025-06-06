/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/unauthorized",
  "/about",
  "/contact",
  // Add any other public static pages like /blog, /projects, etc.
  // Public API routes if any (e.g., for webhooks, public data)
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged-in users to /dashboard.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/login",
  "/signup",
  // Add error pages related to auth if any, e.g., /auth/error
];

/**
 * An array of routes that are only accessible to admin users.
 * @type {string[]}
 */
export const adminRoutesPrefix: string = "/admin";

export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
