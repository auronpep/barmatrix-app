import type { Metadata } from "next";
import { PracticeClient } from "./practice-client";

export const metadata: Metadata = {
  title: "Practice",
  description:
    "Practice MBE questions filtered by subject, tension point, or trap, with full Wrong Answer Forensics on every miss.",
};

// Server shell: read the deep-link filter (?subject / ?tension / ?trap, set by the
// Tension Map and Trap Taxonomy detail pages) and hand it to the client runner.
export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    tension?: string;
    trap?: string;
  }>;
}) {
  const { subject, tension, trap } = await searchParams;

  return (
    <PracticeClient
      initialSubject={typeof subject === "string" ? subject : undefined}
      initialTension={typeof tension === "string" ? tension : undefined}
      initialTrap={typeof trap === "string" ? trap : undefined}
    />
  );
}
