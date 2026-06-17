"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/foundations", label: "The Method" },
  { href: "/mastery", label: "Mastery" },
  { href: "/coach", label: "Coach" },
  { href: "/certification", label: "Certification" },
  { href: "/pricing", label: "Pricing" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/red-zones", label: "Red Zones" },
  { href: "/faq", label: "FAQ" },
];

export function MobileNavToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mobile-nav-toggle"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="mobile-nav-drawer" role="navigation" aria-label="Site navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnostic"
            className="mobile-nav-link mobile-nav-cta"
            onClick={() => setOpen(false)}
          >
            Free Diagnostic →
          </Link>
        </div>
      )}
    </>
  );
}
