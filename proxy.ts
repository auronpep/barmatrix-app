import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk is only active once a publishable key is provisioned. Without it,
// invoking Clerk throws "Missing publishableKey" on EVERY request and 500s the
// whole site. Until keys exist we fall back to a pass-through middleware so the
// public funnel (home / diagnostic / pricing) renders. Auth turns on
// automatically the moment NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in the env.
const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/atlas-v1(.*)",
  "/boot-camps(.*)",
  "/certification/(.*)",
  "/dashboard(.*)",
  "/drills(.*)",
  "/flashcards(.*)",
  "/forensics(.*)",
  "/matrix(.*)",
  "/misconceptions(.*)",
  "/practice(.*)",
  "/question-history(.*)",
  "/questions(.*)",
  "/study(.*)",
  "/timed-sets(.*)",
  // /red-zones is a public marketing page (nav-linked) that renders a logged-out
  // empty-state CTA — must NOT be auth-gated, or it 404s without a sign-in page.
]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    // Explicit redirect: auth.protect() returns a 404 (not a redirect) when it
    // can't resolve the sign-in URL in this setup, so send signed-out users to
    // /sign-in ourselves and preserve where they were headed.
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export default hasClerk ? withClerk : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
