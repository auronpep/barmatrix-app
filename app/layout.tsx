import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import { AnalyticsEvents } from "./analytics-events";
import { DISCLAIMER } from "@/lib/copy";

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
  title: "BarMatrix — Diagnose. Repair. Pass the MBE.",
  description:
    "Multiple-choice-only MBE repair system. Diagnose recurring trap patterns. Repair what the test keeps reusing.",
  metadataBase: new URL("https://barmatrix.app"),
  openGraph: {
    title: "BarMatrix · Diagnose. Repair. Pass the MBE.",
    description:
      "Multiple-choice-only MBE repair system. Diagnose recurring trap patterns. Repair what the test keeps reusing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buildYear = new Date().getFullYear();
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <div className="tape-strip" aria-hidden="true" />
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="brand" aria-label="BarMatrix home">
              <span className="mark">B</span>
              <span>
                BarMatrix<span className="dot" />
              </span>
            </Link>
            <div className="nav-links">
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/diagnostic">Diagnostic</Link>
              <Link href="/red-zones">Red Zones</Link>
              <Link href="/faq">FAQ</Link>
            </div>
            <div className="nav-cta">
              <Link href="/app" className="btn btn-sm ghost hide-md">
                Open App
              </Link>
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
                <h5>Product</h5>
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
                <h5>Audience</h5>
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
                <h5>Platforms</h5>
                <ul>
                  <li>
                    <Link href="/app">Web App</Link>
                  </li>
                  <li>iOS — TestFlight</li>
                  <li>Android — Play</li>
                  <li>
                    <Link href="/partners">Partner Program</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5>Company</h5>
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
              <span>BAR-MTX-V1 · BUILD {buildYear.toString().slice(-2)}.07</span>
            </div>
            <p className="disclaimer">{DISCLAIMER}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
