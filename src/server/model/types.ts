/**
 * User from db
 */
export interface User {
  bundle: string[];
  createdAt: string;
  id: string;
  userskey: string;
  email: string;
  lastQuestion: string | null;
  gender?: string | void;
  age?: number | void;
  password: string;
  role: UserRole;
  slug: string;
  score: number;
  /**
   * ISO 8601 DateTime
   */
  updatedAt: string;
  country?: string;
  language?: string;
}

export interface UserSettings {
  email?: string;
  password?: string;
  gender?: string | void;
  age?: number | void;
  country?: string;
  language?: string;
}

export type QuestionSettings = {
  fact: string;
  question: string;
  image: string;
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
};

type TipSettings = {
  tip: number;
  correctAnswer: number;
  previousTips: number[];
  timeLimit?: number;
  msElapsed: number;
  createdBy: string;
  knewAnswer: boolean;
  answered: boolean;
  createdAt: string;
};

type QuestionStrategy = {
  initialTips: number[][];
  selectionPressure: number[];
  tipsPerGeneration: number[];
  numTipsToShow: number[];
};

/**
 * Question from db
 */
export interface DynamoQuestion {
  id: string;
  qsk: string;
  gsi_pk: string;
  gsi_sk: string;
  generation: number;
  run: number;
  settings: QuestionSettings;
  strategy: QuestionStrategy;
}

export interface DynamoTip {
  id: string;
  qsk: string;
  gsi_pk: string;
  gsi_sk: string;
  generation: number;
  run: number;
  data: TipSettings;
}

export type ProgressItem = {
  tipId: string;
  questionId: string;
};

export type RunStrategy = {
  selectionPressure: number;
  tipsPerGeneration: number;
  numTipsToShow: number;
};

export interface DynamoRun {
  id: string;
  qsk: string;
  gsi_pk: string;
  gsi_sk: string;
  generation: number;
  previousTips: number[];
  run: number;
  settings: QuestionSettings;
  strategy: RunStrategy;
}

/**
 * Question from IMPORT
 */
export type ImportedQuestionSettings = {
  qIdInSheet: string;
  question: string;
  image: string;
  correctAnswer: number;
  timeLimit?: number;
  fact: string;
  unit: string;
  isInit: boolean;
  selectionPressure: number[];
  tipsPerGeneration: number[];
  initialTips: number[][];
  numTipsToShow: number[];
};

export type ImportedTranslationSettings = {
  qIdInSheet: string;
  question: string;
  qT: string;
  factT?: string;
  unitT?: string;
};

export type QuestionTranslationRecord = {
  qT: string;
  factT?: string;
  unitT?: string;
};

/**
 * User roles
 */
export enum UserRole {
  admin = 'admin',
  player = 'player',
}


