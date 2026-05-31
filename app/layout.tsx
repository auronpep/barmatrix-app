import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { AnalyticsEvents } from "./analytics-events";
import { NavAuth } from "./nav-auth";
import { BRAND, DISCLAIMER, DOMAIN } from "@/lib/copy";

const SITE_DESCRIPTION =
  "Multiple-choice-only MBE repair system. Diagnose recurring trap patterns. Repair what the test keeps reusing.";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${DOMAIN}`),
  title: {
    default: `${BRAND} - Diagnose. Repair. Pass the MBE.`,
    template: `%s | ${BRAND}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND,
  keywords: [
    "MBE diagnostic",
    "bar exam MBE",
    "wrong answer forensics",
    "MBE practice",
    "bar exam repeat takers",
    "California bar exam",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${BRAND} - Diagnose. Repair. Pass the MBE.`,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: BRAND,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${BRAND}: Diagnose. Repair. Pass the MBE.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} - Diagnose. Repair. Pass the MBE.`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buildYear = new Date().getFullYear();
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const tree = (
      <html
        lang="en"
        className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        <body>
          <div className="tape-strip" aria-hidden="true" />
          <nav className="nav">
            <div className="nav-inner">
              <Link href="/" className="brand">
                <span className="mark">B</span>
                <span>
                  BarMatrix<span className="dot" />
                </span>
              </Link>
              <div className="nav-links">
                <Link href="/how-it-works">How It Works</Link>
                <Link href="/foundations">The Method</Link>
                <Link href="/mastery">Mastery</Link>
                <Link href="/coach">Coach</Link>
                <Link href="/certification">Certification</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/diagnostic">Diagnostic</Link>
                <Link href="/red-zones">Red Zones</Link>
                <Link href="/faq">FAQ</Link>
              </div>
              <div className="nav-cta">
                {hasClerk ? (
                  <NavAuth />
                ) : (
                  <Link href="/sign-in" className="btn btn-sm ghost">
                    Sign in
                  </Link>
                )}
                <Link href="/diagnostic" className="btn btn-sm red">
                  Free Diagnostic <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </nav>

          <Suspense fallback={null}>
            <AnalyticsEvents />
          </Suspense>

          <main>{children}</main>

          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div>
                  <div
                    className="brand"
                    style={{ color: "white", marginBottom: 16 }}
                  >
                    <span
                      className="mark"
                      style={{ background: "white", color: "#0a0a0a" }}
                    >
                      B
                    </span>
                    <span>
                      BarMatrix<span className="dot" />
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#a39e93",
                      maxWidth: "40ch",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    A multiple-choice-only MBE repair system. Diagnose recurring
                    trap patterns. Repair what the test keeps reusing.
                  </p>
                </div>
                <div>
                  <h2>Product</h2>
                  <ul>
                    <li>
                      <Link href="/how-it-works">How It Works</Link>
                    </li>
                    <li>
                      <Link href="/pricing">Pricing</Link>
                    </li>
                    <li>
                      <Link href="/diagnostic">Free Diagnostic</Link>
                    </li>
                    <li>
                      <Link href="/red-zones">Red-Zone Map</Link>
                    </li>
                    <li>
                      <Link href="/app">Open App</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2>Audience</h2>
                  <ul>
                    <li>California · July 2026</li>
                    <li>Repeat Takers</li>
                    <li>Full-Course Companion</li>
                    <li>
                      <Link href="/partners">Partners &amp; Tutors</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2>Platforms</h2>
                  <ul>
                    <li>
                      <Link href="/app">Web App</Link>
                    </li>
                    <li>
                      <Link href="/partners">Partner Program</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2>Company</h2>
                  <ul>
                    <li>
                      <Link href="/faq">FAQ</Link>
                    </li>
                    <li>
                      <Link href="/terms">Terms</Link>
                    </li>
                    <li>
                      <Link href="/privacy">Privacy</Link>
                    </li>
                    <li>
                      <Link href="/account">Account</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <span>© {buildYear} BarMatrix LLC</span>
                <span>
                  BAR-MTX-V1 · BUILD {buildYear.toString().slice(-2)}.07
                </span>
              </div>
              <p className="disclaimer">{DISCLAIMER}</p>
            </div>
          </footer>
        </body>
      </html>
  );
  return hasClerk ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
