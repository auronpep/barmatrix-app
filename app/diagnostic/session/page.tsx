import { Suspense } from "react";
import { PlacementEntryClient } from "./placement-entry-client";

export default function PlacementSessionEntryPage() {
  return (
    <Suspense fallback={null}>
      <PlacementEntryClient />
    </Suspense>
  );
}
