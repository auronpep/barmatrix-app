"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

// Header auth control. Renders a "Sign in" link for signed-out visitors and a
// "Dashboard" link + account menu for signed-in users. Uses the client-side
// useUser() hook (this Clerk build does not export <SignedIn>/<SignedOut>).
export function NavAuth() {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <>
        <Link href="/dashboard" className="btn btn-sm ghost">
          Dashboard
        </Link>
        <UserButton />
      </>
    );
  }

  // Default (including the brief pre-load window): show Sign in.
  return (
    <Link href="/sign-in" className="btn btn-sm ghost">
      Sign in
    </Link>
  );
}

export function NavPrimaryCta({
  className,
  onClick,
}: {
  className: string;
  onClick?: () => void;
}) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link href="/dashboard/path" className={className} onClick={onClick}>
        My Path <span className="arrow">→</span>
      </Link>
    );
  }

  return (
    <Link href="/diagnostic" className={className} onClick={onClick}>
      Free Diagnostic <span className="arrow">→</span>
    </Link>
  );
}
