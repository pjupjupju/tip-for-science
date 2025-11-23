import { RunConfig } from '../model';

const getGenerationSize = (): number => {
  const r = Math.random();

  const p8 = (6 / 13) * 0.95;
  const p12 = (4 / 13) * 0.95;
  const p16 = (3 / 13) * 0.95;

  if (r < p8) {
    return 8;
  } else if (r < p8 + p12) {
    return 12;
  } else if (r < p8 + p12 + p16) {
    return 16;
  } else {
    return 1;
  }
};

const getSelectionPressure = (generationSize: number): number => {
  if (generationSize === 1) {
    return 1;
  }

  const options = [0, 0.25, 0.5];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
};

const getSurvivorsSize = (generationSize: number): number => {
  if (generationSize === 1) {
    return 0;
  }

  const r = Math.random();
  const p0 = 0.05;
  const normalizationOffset = 1 - p0;
  const p1 = 0.1 / normalizationOffset;
  const p2 = 0.35 / normalizationOffset;
  const p3 = 0.35 / normalizationOffset;

  if (r < p1) {
    return 1;
  } else if (r < p1 + p2) {
    return 2;
  } else if (r < p1 + p2 + p3) {
    return 3;
  } else {
    return 4;
  }
};

export const getRunConfig = (): RunConfig => {
  const tipsPerGeneration = getGenerationSize();
  const selectionPressure = getSelectionPressure(tipsPerGeneration);
  const numTipsToShow = getSurvivorsSize(tipsPerGeneration);

  return {
    tipsPerGeneration,
    selectionPressure,
    numTipsToShow,
  };
};

/**
 * Population standard deviation (not "sample" – without n-1).
 * If the input is empty or has zero variability, returns 0.
 */
const populationStd = (v: number[]): number => {
  const n = v.length;
  if (n === 0) return 0;
  const m = v.reduce((a, b) => a + b, 0) / n;
  const variance = v.reduce((acc, x) => acc + (x - m) ** 2, 0) / n;
  return Math.sqrt(variance);
};

/** One N(0,1) – Box-Muller */
const randn = (): number => {
  let u = 0,
    v = 0;
  // u,v v (0,1), not 0
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const randomPick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const applySelection = (
  values: number[],
  correctAnswer: number,
  selectionCoef: number
): number[] => {
  if (values.length === 0) return [];

  const n = values.length;
  const removeCount = Math.round(n * selectionCoef);
  const keepCount = n - removeCount;

  if (keepCount <= 0) return [];

  // sort by absolute distance from correct answer
  const sorted = [...values].sort((a, b) => {
    const da = Math.abs(a - correctAnswer);
    const db = Math.abs(b - correctAnswer);
    return da - db;
  });

  // remove and sort again to scramble
  return sorted.slice(0, keepCount).sort((a, b) => a - b);
};

/**
 * Generates initial tips (zero generation)
 *
 * @param nPopSize   N – population size (8 / 12 / 16)
 * @param sCoeficient s – selection coeficient
 * @param start - relative start 1/3 or 3 with probability 50:50
 * @param startSd - standard deviation: c(0.05,0.1,0.2)
 * @param correct - correct answer
 * @returns array of numbers
 */
export const generateInitialGeneration = (
  nPopSize: number,
  sCoeficient: number,
  start: number,
  startSd: number,
  correct: number
): number[] => {
  // validation and trimming
  const N = Math.max(0, Math.floor(nPopSize));
  const s = Math.min(1, Math.max(0, sCoeficient));
  const sigma = Math.max(0, startSd);
  if (N === 0) return [];

  // target on logarithmic scale: mu = log(start * correct)
  if (start <= 0 || correct <= 0) {
    // log would not work - return fallback filled with 1
    return Array(N).fill(1);
  }

  const mu = Math.log(start * correct);

  // number of reproducing ~ (1 - s) * N
  const nRepro = Math.max(0, Math.min(N, Math.round((1 - s) * N)));

  // noise ~ N(0,1)
  const conf: number[] = Array.from({ length: nRepro }, randn);

  // standardization to mean=0, sd=1 (population sd)
  let confs: number[];
  if (conf.length === 0) {
    confs = [];
  } else {
    const m = conf.reduce((a, b) => a + b, 0) / conf.length;
    const sd = populationStd(conf);
    // if sd == 0 (for example nRepro=1), use zero deviations
    confs = sd === 0 ? conf.map(() => 0) : conf.map((x) => (x - m) / sd);
  }

  // log-values with midpoint mu and sd = startSd
  const repLog = confs.map((z) => mu + z * sigma);

  // back to original scale and integers
  const repExp = repLog.map((x) => Math.round(Math.exp(x)));

  // fill in to N: extremes, which should be eliminated by selection
  // in R script: if start == 3 ⇒ filler = correct * 1e6, otherwise 0
  const EPS = 1e-9;
  const isHighStart = Math.abs(start - 3) < EPS;
  const fillerValue = isHighStart ? Math.round(correct * 1000000) : 0;
  const nFill = N - nRepro;

  // DEBUG_CODE
  if (process.env.TESTING) {
    console.log('------------- N je ', N);
    console.log('------------- nRepro je', nRepro);
    console.log('------------- sCoeficient je ', sCoeficient);
    console.log('------------- start je ', start);
    console.log('------------- startSd je ', startSd);
    console.log('#############');
    console.log('------------- repExp je ', repExp.join(','));
    console.log('_________________________________');
  }

  const fillers = nFill > 0 ? Array(nFill).fill(fillerValue) : [];

  return [...repExp, ...fillers];
};

export const getInitialTips = (
  correctAnswer: number,
  strategy: RunConfig
): number[] => {
  if (strategy.tipsPerGeneration === 1) {
    // DEBUG_CODE
    if (process.env.TESTING) {
      console.log('___________ 3. KROK __________');
      console.log('$$$ resulting generation: ', []);
      console.log('$$$ resulting size: ', 0);
    }
    return [];
  }

  const populationSize = strategy.tipsPerGeneration;
  const selectionCoeficient = strategy.selectionPressure;
  const start = randomPick([1 / 3, 3]); // 1/2 probability for each
  const startSd = randomPick([0.05, 0.1, 0.2]); // 1/3 probability for each

  const zeroGeneration = generateInitialGeneration(
    populationSize,
    selectionCoeficient,
    start,
    startSd,
    correctAnswer
  );

  // DEBUG_CODE
  if (process.env.TESTING) {
    console.log('___________ 3. KROK __________');
    console.log('$$$ resulting generation: ', zeroGeneration.join(','));
    console.log('$$$ resulting size: ', zeroGeneration.length);
  }

  return applySelection(zeroGeneration, correctAnswer, selectionCoeficient);
};
