import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BarMatrix — Master the finite universe of MBE traps",
  description:
    "Premium MBE wrong-answer intelligence. Diagnose the recurring trap patterns behind your missed multiple-choice questions and assign targeted repair drills.",
  metadataBase: new URL("https://barmatrix.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
        <header className="border-b border-zinc-200">
          <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
              BarMatrix
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/diagnostic" className="hover:text-zinc-600">Diagnostic</Link>
              <Link href="/how-it-works" className="hover:text-zinc-600">How it works</Link>
              <Link href="/pricing" className="hover:text-zinc-600">Pricing</Link>
              <Link href="/app" className="hover:text-zinc-600">Apps</Link>
              <Link
                href="/checkout"
                className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
              >
                Enroll
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-8 mt-auto">
          <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>&copy; {new Date().getFullYear()} BarMatrix. All rights reserved.</p>
            <nav className="flex gap-6">
              <Link href="/privacy" className="hover:text-zinc-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-zinc-900">Terms of Service</Link>
              <Link href="/partners" className="hover:text-zinc-900">Partners</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}

