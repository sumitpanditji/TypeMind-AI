# TypeMind AI — Test Coverage

Run all unit tests:

```bash
npm test
```

## Latest results: **18 pass / 0 fail**

| Suite | Tests | Status |
|-------|-------|--------|
| computeAccuracy | 3 | pass |
| computeWpm | 3 | pass |
| normalizeInputValue | 4 | pass |
| applyInputChange | 2 | pass |
| applySingleKeypress | 1 | pass |
| session helpers | 2 | pass |
| countMatchingChars | 1 | pass |
| hashContent | 2 | pass |

## Edge cases handled in app

| Scenario | Behavior |
|----------|----------|
| Timer ends, no keys pressed | Shows "No Typing Detected", WPM/accuracy 0, no API save |
| User finishes passage early | Test ends immediately (`finishReason: completed`) |
| Backspace after mistake | Mistake still counts toward accuracy |
| Paste multiple characters | Only first new character accepted |
| Extra chars past end of text | Counted as mistakes, capped at +30 chars |
| Text still loading | Input disabled, "Loading text..." shown |
| Empty text | Input blocked |
| API save fails | Error message shown, local results still visible |
| Guest user | Results shown, no session/coach save |
| Mode/timer change mid-test | Blocked while test started |
| Tab/Esc restart | Resets test cleanly |
| Double finish (timer + early) | `completedRef` prevents duplicate `onComplete` |
| Invalid daily URL encoding | `safeDecode` fallback |
