import { gql, makeExecutableSchema } from 'apollo-server-express';
import {
  exportData,
  importQuestions,
  saveTip,
  signIn,
  signOut,
  signUp,
  updateUser,
} from './mutation';
import {
  getHighScore,
  getMyScore,
  getOnlineStats,
  getNextQuestion,
  getUserStats,
  viewer,
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
    getUserStats: Stats!
    viewer: Viewer!
  }

  type Mutation {
    exportData: String
    importQuestions: Boolean
    saveTip(
      id: String!
      tip: Float!
      rId: Int!
      gId: Int!
      previousTips: [Float!]!
      knewAnswer: Boolean
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

type Tip = {
  id: string;
  question: string;
  previousTips: number[];
  correctAnswer: number;
  tip: number;
  msElapsed: number;
};

export const resolvers = {
  Mutation: {
    exportData,
    importQuestions,
    saveTip,
    signIn,
    signOut,
    signUp,
    updateUser,
  },
  Query: {
    getHighScore,
    getNextQuestion,
    getMyScore,
    getOnlineStats,
    getUserStats,
    viewer,
  },
  ...types,
};

export const schema = makeExecutableSchema({
  resolvers: resolvers as any, // todo: fix types later (why it tries to satisfy number as return type?)
  typeDefs,
});
