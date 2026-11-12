# Run generation and randomization verification plan

Created: 2026-11-12 03:23:03 CET

Status: proposed

## Goal

Verify the scientific assumptions behind run configuration, initial tips, random sampling, and generation rollover. Fix only behavior that is demonstrably incorrect or conflicts with the agreed experiment design.

No existing run or tip data should be rewritten as part of this work.

## Scope

The implementation work can reach these existing areas:

- `src/server/io/utils.ts`: randomized run configuration and initial-tip generation.
- `src/server/model/question.ts`: survivor selection and generation rollover.
- `src/helpers/selectPreviousTipsToDisplay.ts`: sampling the parents shown to a player.
- `src/helpers/generateQuestionBundle.ts`: question and questionnaire shuffling.
- `src/server/io/googleSheets.ts`: validation of imported correct answers.
- `src/server/schema/mutation/saveTip.ts`: caller of generation rollover logic.
- `src/server/io/RunLock.ts` and GraphQL context setup only if the database lock makes their generation-related use obsolete.
- Focused tests and helper exports required by the changes above.

The score-message random choice is not in scope. It is a uniform single-item choice and does not affect experimental data.

## Behavior already verified

Preserve these properties unless the experiment specification says otherwise:

- Run size is 1 in 5% of runs. Otherwise 8, 12, and 16 occur in a 6:4:3 ratio.
- Selection pressure is independently chosen from 0%, 25%, and 50% for non-control runs.
- The overall numbers of displayed tips 0, 1, 2, 3, and 4 occur with probabilities 5%, 10%, 35%, 35%, and 15%.
- The first run uses 2, 3, 6, or 10 generations with probabilities 10%, 30%, 40%, and 20%. Later runs use 10.
- Initial populations choose a log-scale centre of `correct / 3` or `correct * 3` with equal probability.
- Next-generation fitness is multiplicative: half and double the answer are equally distant.
- Displayed tips are sampled uniformly without replacement by the existing partial Fisher-Yates implementation.
- Control runs show no previous tips and remove their single submitted tip before the next generation.

## Decisions to confirm before changing the initial-tip formula

Record the answers in this document or the implementing pull request:

1. Is `correct / 3` or `correct * 3` intended to be the geometric centre on the log scale, or the arithmetic mean on the original scale?
2. Should every artificial population have an almost exact log mean and population standard deviation, as it does now, or should tips be independent log-normal draws whose sample statistics vary?
3. Are the intended log standard deviations `0.1`, `0.2`, and `0.4`? The current comment still lists the older `0.05`, `0.1`, and `0.2` values.
4. Are positive decimal correct answers supported? The GraphQL schema and UI allow them, while the initial generator rounds tips to integers.
5. Does `tipsPerGeneration` mean the first N eligible completed answers influence evolution, or must it include every player who was shown that generation before it advanced?

Default to the current formula when an answer cannot be established. Do not replace the statistical model based only on naming or preference.

## Implementation plan

### 1. Add deterministic regression tests first

Add small tests that mock `Math.random`; do not use tolerance-heavy Monte Carlo tests in CI.

- Assert boundary values for run size, selection pressure, displayed-tip count, and first-run generation count.
- Assert that initial survivor count is exactly `N * (1 - selectionPressure)` for every supported N and pressure.
- Assert the selected initial tips have the agreed log centre and spread before integer rounding.
- Assert that logarithmic selection treats `correct / 2` and `correct * 2` equally and removes the least fit tips.
- Assert control-run behavior: no initial parents and no survivors.
- Assert displayed-tip sampling does not mutate its input and follows deterministic Fisher-Yates swaps.
- Keep one test for each scientific invariant; avoid testing debug output or implementation-only intermediate arrays.

Likely test files:

- `src/server/io/utils.test.ts`
- `src/helpers/selectPreviousTipsToDisplay.test.ts`
- `src/helpers/generateQuestionBundle.test.ts`
- A focused model or database test for generation rollover.

### 2. Replace the biased question shuffle

In `generateQuestionBundle`, replace `.sort(() => Math.random() - 0.5)` with a Fisher-Yates shuffle over copies of the two input arrays.

Checks:

- Initial questions remain before regular questions.
- Order inside each group is randomized.
- Caller-owned arrays are not mutated.
- Empty and one-item groups work unchanged.
- A deterministic test covers every swap boundary, including selecting the current position.

Do not add a dependency. A local generic shuffle is sufficient. Export it only if another production caller immediately needs it.

### 3. Make generation rollover transactional

The database, not `RunLock`, must be the source of truth.

Inside the existing SQL transaction:

1. Insert the submitted tip.
2. Lock the enabled run row with `SELECT ... FOR UPDATE`.
3. Re-read and verify the run is still on the submitted generation.
4. Query eligible tips for that run and generation through the transaction connection, not Supabase outside the transaction.
5. Order the eligible tips deterministically, for example by creation time and ID.
6. Advance only when the eligible count reaches the configured threshold.
7. Compute survivors from the agreed N tips and update the run with a generation guard in the `WHERE` clause.
8. Insert one generation snapshot in the same transaction.
9. Disable the run at the configured maximum generation in that same locked transaction.

Remove `RunLock` checks from correctness decisions. Keep the class elsewhere only if another caller still needs it; otherwise delete its now-dead wiring as part of the same change.

Concurrency acceptance cases:

- Two simultaneous submissions at `N - 2` cannot leave the run stuck after N eligible committed answers exist.
- Two simultaneous submissions at `N - 1` produce one next generation and one snapshot.
- A submission carrying an old generation ID is stored but cannot overwrite the current run or create another snapshot.
- Two server processes behave the same as two requests in one process.
- Survivor count remains exactly `N * (1 - selectionPressure)`.

Use the smallest database-backed concurrency test available in the repository. If CI has no disposable PostgreSQL database, add a separately runnable integration test and keep pure selection/count tests in the normal suite.

### 4. Define how late answers belong to generations

The smallest safe default is:

- The first N eligible completed answers, in deterministic commit order, influence the next generation.
- Later answers submitted with the old generation ID remain raw observations from what the player saw, but do not alter an already-created generation.

Confirm that data analysis accepts this rule. If every player who was shown a generation must be included, stop here: that requires reserving generation slots when questions are issued, which is a separate schema and workflow change rather than a rollover patch.

Document the chosen rule beside the rollover code because it cannot be inferred from the threshold alone.

### 5. Validate the numeric domain at import

The logarithmic model requires a finite, positive correct answer.

- Reject missing, non-numeric, zero, negative, and infinite correct answers during spreadsheet parsing/import.
- Return an actionable import error identifying the row.
- Remove the silent `Array(N).fill(1)` fallback once all creation paths enforce the invariant, or replace it with an explicit error as defense in depth.
- If decimal answers are valid, preserve generated decimals rather than rounding them. If the study requires whole-number tips, enforce an integer correct answer at import and document it.
- Test the agreed lower bound with values such as `0.1`, `1`, and a normal production-scale answer.

Do not alter previously imported questions automatically. Run a read-only query first to find existing non-positive or small decimal answers and handle any discovered data separately.

### 6. Remove misleading or unnecessary randomization

- Delete the final `.sort(() => Math.random() - 0.5)` from next-generation survivor computation unless a caller is found that consumes stored survivor order directly. The display helper already performs an unbiased shuffle.
- If stored order is part of an export contract, replace the random sort with Fisher-Yates instead of deleting it.
- Update the initial-generation comment to the confirmed standard-deviation values and name the centre as geometric or arithmetic accurately.

### 7. Verify end to end

Run:

```sh
yarn types
CI=true yarn test --runInBand --watchAll=false --watchman=false
```

Then run the database concurrency check against a disposable PostgreSQL database.

For a fixed correct answer, inspect a generated matrix covering every supported combination of:

- population size: 1, 8, 12, 16;
- selection pressure: 0, 0.25, 0.5, and the control value 1;
- start multiplier: 1/3 and 3;
- log spread: 0.1, 0.2, 0.4;
- displayed-tip count: 0 through 4.

Verify array sizes, finite positive values where required, survivor membership, and no input mutation. Statistical sampling may be used as a local diagnostic, but deterministic tests remain the release gate.

## Pre-release data checks

Use read-only SQL to report, per run and generation:

- eligible tip count versus `tipsPerGeneration`;
- more than one snapshot for the same run and generation;
- missing snapshots after a run advanced;
- non-positive or non-finite tips and correct answers;
- survivor-array length versus the expected selected population size.

Do not delete or rewrite anomalies in this task. Preserve them for analysis and create a separate, approved repair plan if historical cleanup is needed.

## Acceptance criteria

- All confirmed probability mappings are covered by deterministic tests.
- Question and questionnaire shuffles use Fisher-Yates and do not mutate caller arrays.
- Generation rollover has one database-serialized winner under concurrency.
- A stale answer cannot overwrite a newer generation.
- Survivor selection uses multiplicative/logarithmic distance and returns the expected count.
- Invalid correct answers fail at import instead of silently generating fallback tips.
- Initial-tip rounding and standardization match the explicitly recorded scientific decisions.
- Type checking, the existing test suite, and the new focused tests pass.
- No production data is modified by verification or deployment.

## Explicitly skipped

- Changing score calculation or UI presentation.
- Cryptographic randomness; these choices are experimental allocation, not security tokens.
- Retrofitting deterministic seeds or reproducible pseudo-random streams unless the study protocol requires them.
- Historical data cleanup.
- Reserving player slots before answers are submitted unless the study requires assignment-based generations.
