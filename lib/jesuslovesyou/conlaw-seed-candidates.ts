import rawConLawSeedCandidates from "./conlaw-seed-candidates.json";

export type ConLawSeedCandidate = {
  question_id: string;
  selector_code: string;
  selector_match: "exact" | "child_code";
  outline_code: string;
  source_outline_code: string;
  coverage_group: string;
  seed_bucket: string;
  correct_percent: string | null;
  key: string | null;
  has_finished_transform: boolean;
  review_status: string;
};

export const conLawSeedCandidates =
  rawConLawSeedCandidates as ConLawSeedCandidate[];

export const conLawSeedQuestionParams = conLawSeedCandidates.map(
  ({ question_id: questionId }) => ({ questionId }),
);

export function getConLawSeedCandidate(questionId: string) {
  return (
    conLawSeedCandidates.find(
      (candidate) => candidate.question_id === questionId,
    ) ?? null
  );
}
