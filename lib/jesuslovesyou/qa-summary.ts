export type QaDetail = {
  outlineCode: string;
  sourceOutlineCode: string;
  coverageGroup: string;
  seedBucket: string;
  reviewStatus: string;
  answerFlow: string[];
  keys: { kind: string }[];
  leadMeSteps: string[];
  drillSeeds: unknown[];
};

export function label(value: string) {
  return value.replaceAll("_", " ");
}

export function countRows(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function summarizeQa(details: QaDetail[]) {
  const keys = details.flatMap((detail) => detail.keys);

  return {
    caseStudies: details.length,
    reusableKeys: keys.length,
    trapKeys: keys.filter((key) => key.kind === "Trap Key").length,
    leadMeSteps: details.reduce(
      (sum, detail) => sum + detail.leadMeSteps.length,
      0,
    ),
    drillSeeds: details.reduce(
      (sum, detail) => sum + detail.drillSeeds.length,
      0,
    ),
    answerFlowSteps: details.reduce(
      (sum, detail) => sum + detail.answerFlow.length,
      0,
    ),
    recodeRows: details.filter(
      (detail) => detail.outlineCode !== detail.sourceOutlineCode,
    ).length,
    reviewStatusCounts: countRows(details.map((detail) => detail.reviewStatus)),
    coverageCounts: countRows(details.map((detail) => detail.coverageGroup)),
    seedBucketCounts: countRows(details.map((detail) => detail.seedBucket)),
    keyKindCounts: countRows(keys.map((key) => key.kind)),
  };
}
