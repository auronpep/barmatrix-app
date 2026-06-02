import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/copy";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND,
    short_name: BRAND,
    description:
      "Multiple-choice-only MBE repair system with diagnostics, forensics, and targeted drills.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#c8102e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
