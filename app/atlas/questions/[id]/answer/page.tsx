import type { Metadata } from "next";
import { AtlasAnswerClient } from "./answer-client";

export const metadata: Metadata = {
  title: "Atlas Answer",
  robots: { index: false, follow: false },
};

export default function AtlasAnswerPage() {
  return <AtlasAnswerClient />;
}
