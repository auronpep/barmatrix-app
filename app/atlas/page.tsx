import type { Metadata } from "next";
import { AtlasClient } from "./atlas-client";

export const metadata: Metadata = {
  title: "Outline Atlas V2",
  description: "Walk the MBE outline by code and open approved BarMatrix study components.",
  robots: { index: false, follow: false },
};

export default function AtlasPage() {
  return <AtlasClient />;
}
