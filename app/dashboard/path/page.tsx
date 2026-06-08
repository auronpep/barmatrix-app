"use client";

import { usePath } from "@/lib/use-path";
import PathSurface from "@/components/path/path-surface";

// The dedicated guided-path surface ("My Path" tab + post-checkout landing).
export default function DashboardPathPage() {
  const state = usePath();
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <PathSurface state={state} />
    </section>
  );
}
