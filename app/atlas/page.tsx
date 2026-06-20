import type { Metadata } from "next";
import { AtlasClient } from "./atlas-client";

export const metadata: Metadata = {
  title: "Outline Atlas",
  description: "Drill into approved BarMatrix questions by MBE outline code.",
  robots: { index: false, follow: false },
};

export default function AtlasPage() {
  return <AtlasClient />;
}
