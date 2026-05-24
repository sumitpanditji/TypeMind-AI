import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createCounters,
  computeAccuracy,
  computeWpm,
  computeRawWpm,
  countMatchingChars,
  hashContent,
} from "./typing-stats";
import {
  normalizeInputValue,
  applyInputChange,
  applySingleKeypress,
  isInactiveSession,
  getDisplayAccuracy,
  shouldSaveSession,
} from "./typing-engine";

describe("computeAccuracy", () => {
  it("returns 0 when no keypresses", () => {
    assert.equal(computeAccuracy(createCounters()), 0);
  });

  it("counts mistakes after backspace fix", () => {
    let c = createCounters();
    const target = "abc";
    let typed = "";
    let events: { key: string; timestamp: number; correct: boolean }[] = [];

    let r = applyInputChange(target, typed, "x", c, events, 1);
    typed = r.typed;
    c = r.counters;
    events = r.events;

    r = applyInputChange(target, typed, "", c, events, 2);
    typed = r.typed;
    c = r.counters;
    events = r.events;

    r = applyInputChange(target, typed, "a", c, events, 3);
    c = r.counters;

    assert.equal(c.mistakes, 1);
    assert.equal(computeAccuracy(c), 50);
  });

  it("returns 100 for perfect typing", () => {
    let c = createCounters();
    let typed = "";
    let events: { key: string; timestamp: number; correct: boolean }[] = [];
    const target = "hi";

    for (const ch of ["h", "i"]) {
      const r = applyInputChange(target, typed, typed + ch, c, events, Date.now());
      typed = r.typed;
      c = r.counters;
      events = r.events;
    }

    assert.equal(computeAccuracy(c), 100);
  });
});

describe("computeWpm", () => {
  it("returns 0 for zero elapsed", () => {
    assert.equal(computeWpm(50, 0), 0);
  });

  it("returns 0 for zero chars", () => {
    assert.equal(computeWpm(0, 60), 0);
  });

  it("calculates standard wpm", () => {
    assert.equal(computeWpm(50, 60), 10);
  });
});

describe("normalizeInputValue", () => {
  it("allows single char add", () => {
    assert.equal(normalizeInputValue("ab", "abc", 100), "abc");
  });

  it("blocks paste of multiple chars", () => {
    assert.equal(normalizeInputValue("", "hello", 100), "h");
  });

  it("allows backspace", () => {
    assert.equal(normalizeInputValue("abc", "ab", 100), "ab");
  });

  it("caps extra chars beyond target", () => {
    const long = "a".repeat(150);
    const result = normalizeInputValue("", long, 10);
    assert.ok(result.length <= 40);
  });
});

describe("applyInputChange", () => {
  it("detects early completion", () => {
    const target = "hi";
    let c = createCounters();
    let typed = "";
    let events: { key: string; timestamp: number; correct: boolean }[] = [];

    let r = applyInputChange(target, typed, "h", c, events, 1);
    assert.equal(r.finishedEarly, false);

    r = applyInputChange(target, r.typed, "hi", r.counters, r.events, 2);
    assert.equal(r.finishedEarly, true);
  });

  it("tracks extra characters past target", () => {
    const target = "a";
    const r = applyInputChange("", "", "ab", createCounters(), [], 1);
    assert.equal(r.counters.extraKeypresses, 1);
    assert.equal(r.counters.mistakes, 1);
  });
});

describe("applySingleKeypress", () => {
  it("marks incorrect key", () => {
    const { event, counters } = applySingleKeypress(
      createCounters(),
      "a",
      0,
      "b",
      1
    );
    assert.equal(event.correct, false);
    assert.equal(counters.mistakes, 1);
  });
});

describe("session helpers", () => {
  it("inactive session", () => {
    assert.equal(isInactiveSession(createCounters()), true);
    assert.equal(getDisplayAccuracy(createCounters()), 0);
    assert.equal(shouldSaveSession(createCounters(), 0), false);
  });

  it("active session can save", () => {
    const c = createCounters();
    c.totalKeypresses = 5;
    c.correctKeypresses = 4;
    assert.equal(shouldSaveSession(c, 42), true);
  });
});

describe("countMatchingChars", () => {
  it("counts only matching positions", () => {
    assert.equal(countMatchingChars("hello", "hxllo"), 4);
  });
});

describe("hashContent", () => {
  it("empty text gets stable hash", () => {
    assert.equal(hashContent(""), "c_empty");
  });

  it("same text same hash", () => {
    assert.equal(hashContent("test"), hashContent("test"));
  });
});
