import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMPTY_CONFUSION,
  bucketOf,
  setChoiceBucket,
  toggleChoiceBucket,
  hasAnyConfusion,
} from "../components/confusion-capture";

describe("confusion-capture pure helpers", () => {
  it("starts empty", () => {
    assert.deepEqual(EMPTY_CONFUSION, { eliminated: [], decidingBetween: [] });
    assert.equal(hasAnyConfusion(EMPTY_CONFUSION), false);
    assert.equal(bucketOf(EMPTY_CONFUSION, "c1"), null);
  });

  it("setChoiceBucket places a choice and is immutable", () => {
    const next = setChoiceBucket(EMPTY_CONFUSION, "c1", "eliminated");
    assert.deepEqual(next, { eliminated: ["c1"], decidingBetween: [] });
    // original untouched
    assert.deepEqual(EMPTY_CONFUSION, { eliminated: [], decidingBetween: [] });
    assert.equal(bucketOf(next, "c1"), "eliminated");
  });

  it("enforces disjointness — moving a choice leaves it in only one bucket", () => {
    const a = setChoiceBucket(EMPTY_CONFUSION, "c1", "eliminated");
    const b = setChoiceBucket(a, "c1", "deciding_between");
    assert.deepEqual(b, { eliminated: [], decidingBetween: ["c1"] });
    assert.equal(bucketOf(b, "c1"), "deciding_between");
  });

  it("toggleChoiceBucket clears when re-clicking the active bucket", () => {
    const a = toggleChoiceBucket(EMPTY_CONFUSION, "c1", "eliminated");
    assert.equal(bucketOf(a, "c1"), "eliminated");
    const b = toggleChoiceBucket(a, "c1", "eliminated");
    assert.equal(bucketOf(b, "c1"), null);
    assert.equal(hasAnyConfusion(b), false);
  });

  it("toggleChoiceBucket switches when clicking the other bucket", () => {
    const a = toggleChoiceBucket(EMPTY_CONFUSION, "c1", "eliminated");
    const b = toggleChoiceBucket(a, "c1", "deciding_between");
    assert.deepEqual(b, { eliminated: [], decidingBetween: ["c1"] });
  });

  it("setChoiceBucket(null) removes a choice from all buckets", () => {
    const a = setChoiceBucket(EMPTY_CONFUSION, "c1", "deciding_between");
    const b = setChoiceBucket(a, "c1", null);
    assert.deepEqual(b, { eliminated: [], decidingBetween: [] });
  });
});
