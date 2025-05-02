import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// For local development without env vars
const devSecret = "THIS_IS_A_DEV_SECRET_DO_NOT_USE_IN_PRODUCTION";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  // Add a fixed secret for development
  secret: process.env.AUTH_SECRET || devSecret,
});
