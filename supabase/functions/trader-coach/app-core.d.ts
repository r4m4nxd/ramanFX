// Types for the generated app-core.js (tsc / vitest only; Deno runs the .js). Same exports as scripts/build-coach-core.mjs.
export { enrich, computeStats, groupStats, normTag, balanceSeries } from '../../../src/core/stats';
export { riskStatus } from '../../../src/core/risk';
export { scoreRules, autoMarks, resolveMarks, fmtR, RULES } from '../../../src/core/ruleScore';
export { matchPlan, blankPlan } from '../../../src/core/strategy';
export { specFor } from '../../../src/core/instruments';
export { dayKey, parseTs } from '../../../src/core/time';
