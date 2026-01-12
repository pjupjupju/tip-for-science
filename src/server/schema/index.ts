import { gql, makeExecutableSchema } from 'apollo-server-express';
import {
  batchSlugify,
  exportData,
  importQuestions,
  importTranslations,
  saveQuestionnaireAnswer,
  saveQuestionnaireBatch,
  saveTip,
  signIn,
  signOut,
  signUp,
  updateUser,
  wipeBatches,
} from './mutation';
import {
  getHighScore,
  getMyScore,
  getOnlineStats,
  getNextQuestion,
  getUserStats,
  viewer,
  getQuestionnaire,
} from './query';
import * as types from './types';

export * from './context';

export const typeDefs = /* GraphQL */ gql`
  scalar DateTime

  type Question {
    id: String!
    rId: Int!
    gId: Int!
    fact: String!
    question: String!
    image: String
    previousTips: [Float]
    correctAnswer: Float!
    timeLimit: Int
    unit: String!
  }

  type QuestionnaireItem {
    id: Int!
    item: String!
    value: Int
  }

  input QuestionnaireItemInput {
    questionId: Int!
    value: Int!
  }

  type Tip {
    id: String!
    question: String!
    previousTips: [Float]
    correctAnswer: Float!
    tip: Float!
    msElapsed: Int!
  }

  type TimeSeriesStats {
    day: DateTime!
    score: Float!
  }

  type Stats {
    days: [TimeSeriesStats]
  }

  type OnlineStats {
    online: Int!
  }

  type HighScore {
    slug: String!
    score: Float
  }

  type Query {
    getHighScore: [HighScore!]!
    getMyScore: Float!
    getNextQuestion: Question
    getOnlineStats: OnlineStats!
    getQuestionnaire: [QuestionnaireItem!]!
    getUserStats: Stats!
    viewer: Viewer!
  }

  type Mutation {
    batchSlugify: String
    exportData: String
    importQuestions: Boolean
    importTranslations: Boolean
    saveQuestionnaireAnswer(
      questionId: Int!
      value: Int!
    ): String
    saveQuestionnaireBatch(
      items: [QuestionnaireItemInput!]!
    ): String
    saveTip(
      id: String!
      tip: Float!
      rId: Int!
      gId: Int!
      previousTips: [Float!]!
      knewAnswer: Boolean
      answered: Boolean
      msElapsed: Int!
    ): String
    signIn(email: String!, password: String!): SignInResult!
    signOut: SignOutResult!
    signUp(email: String!, password: String!): SignUpResult!
    updateUser(
      email: String
      newPassword: String
      oldPassword: String
      age: Int
      gender: String
    ): Boolean!
    wipeBatches: Boolean
  }

  union SignUpResult = SignInSuccess | ValidationError
  union SignInResult = SignInSuccess | ValidationError

  type SignInSuccess {
    viewer: Viewer!
  }

  type SignOutResult {
    viewer: Viewer!
  }

  type User {
    email: String!
    id: ID!
    slug: String!
    age: Int
    gender: String
    role: UserRole!
    score: Float
    createdAt: DateTime!
    updatedAt: DateTime!
    language: String
    nextQuestionnaireAfterQuestion: String
    ipipBundle: [Int!]!
  }

  enum UserRole {
    admin
    player
  }

  type ValidationError {
    errors: [ValidationErrorDetail!]!
  }

  type ValidationErrorDetail {
    error: String!
    path: String!
  }

  type Viewer {
    id: ID!
    user: User
  }
`;

export const resolvers = {
  Mutation: {
    batchSlugify,
    exportData,
    importQuestions,
    importTranslations,
    saveQuestionnaireAnswer,
    saveQuestionnaireBatch,
    saveTip,
    signIn,
    signOut,
    signUp,
    updateUser,
    wipeBatches,
  },
  Query: {
    getHighScore,
    getNextQuestion,
    getMyScore,
    getOnlineStats,
    getQuestionnaire,
    getUserStats,
    viewer,
  },
  ...types,
};

export const schema = makeExecutableSchema({
  resolvers: resolvers as any, // todo: fix types later (why it tries to satisfy number as return type?)
  typeDefs,
});
