import { Suspense } from "react";
import { DiagnosticPageClient } from "./diagnostic-page-client";

export default function DiagnosticPage() {
  return (
    <Suspense fallback={null}>
      <DiagnosticPageClient />
    </Suspense>
  );
}
