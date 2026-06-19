"use client";

// Redesign V2 preview — the Outline Atlas (the old "All Drills" → an outline reviewer).
//
// PHASE 2 (presentation only): a static demo of OutlineAtlas so the founder can
// review the master-detail outline reviewer (tree → lesson → drill → per-item
// performance, search by name or 8-digit code) before it's wired to real attempt
// data + the drill runner. Outline content is the real 7/36/457 codes sheet;
// per-item performance is a deterministic stand-in.
//
// The flip into production: render OutlineAtlas in the live app where the old
// "All Drills" page lives, wiring onStartDrill to the drill runner and replacing
// the deterministic itemPerf with real per-outline-code attempt data from the API.

import { OutlineAtlas } from "@/components/redesign/outline-atlas";
import { SectionLabel } from "@/components/redesign/redesign-chrome";
import { BM_OUTLINE } from "./outline-data";

export default function OutlineAtlasPreviewPage() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <SectionLabel>Preview · BarMatrix Blueprint</SectionLabel>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-zinc-950">
          BarMatrix Blueprint
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          The canonical MBE outline as a study reviewer — browse all{" "}
          {BM_OUTLINE.meta.leafCount} items across {BM_OUTLINE.meta.subjectCount} subjects, open a
          lesson, drill an item, and see your performance on that exact outline code. Search by name
          or 8-digit code. Per-item performance below is illustrative.
        </p>
      </div>

      <div className="mt-6">
        <OutlineAtlas data={BM_OUTLINE} onStartDrill={() => undefined} />
      </div>
    </section>
  );
}
