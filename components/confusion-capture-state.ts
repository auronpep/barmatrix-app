export type ConfusionBucket = "eliminated" | "deciding_between";

export interface ConfusionValue {
  eliminated: string[];
  decidingBetween: string[];
}

export const EMPTY_CONFUSION: ConfusionValue = {
  eliminated: [],
  decidingBetween: [],
};

export function bucketOf(
  value: ConfusionValue,
  choiceId: string,
): ConfusionBucket | null {
  if (value.eliminated.includes(choiceId)) return "eliminated";
  if (value.decidingBetween.includes(choiceId)) return "deciding_between";
  return null;
}

export function setChoiceBucket(
  value: ConfusionValue,
  choiceId: string,
  bucket: ConfusionBucket | null,
): ConfusionValue {
  const eliminated = value.eliminated.filter((id) => id !== choiceId);
  const decidingBetween = value.decidingBetween.filter((id) => id !== choiceId);
  if (bucket === "eliminated") eliminated.push(choiceId);
  else if (bucket === "deciding_between") decidingBetween.push(choiceId);
  return { eliminated, decidingBetween };
}

export function toggleChoiceBucket(
  value: ConfusionValue,
  choiceId: string,
  bucket: ConfusionBucket,
): ConfusionValue {
  const current = bucketOf(value, choiceId);
  return setChoiceBucket(value, choiceId, current === bucket ? null : bucket);
}

export function hasAnyConfusion(value: ConfusionValue): boolean {
  return value.eliminated.length > 0 || value.decidingBetween.length > 0;
}
