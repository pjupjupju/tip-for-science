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
  name?: string | void;
  password: string;
  role: UserRole;
  slug: string;
  score: number;
  /**
   * ISO 8601 DateTime
   */
  updatedAt: string;
}

type QuestionSettings = {
  question: string;
  image: string;
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
};

type QuestionStrategy = {
  initialTips: number[][];
  selectionPressure: number[];
  tipsPerGeneration: number[];
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

/**
 * User roles
 */
export enum UserRole {
  admin = 'admin',
  player = 'player',
}
