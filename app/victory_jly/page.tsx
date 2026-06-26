import type { Metadata } from "next";
import VictoryHome from "../victory/page";

export const metadata: Metadata = {
  title: "Homepage Archive - BarMatrix",
  description:
    "Archived BarMatrix homepage variant kept available by direct link.",
  robots: { index: false, follow: false },
};

export default VictoryHome;
