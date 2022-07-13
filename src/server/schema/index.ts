import { gql, makeExecutableSchema } from 'apollo-server-express';
import { saveTip, signIn, signOut, signUp } from './mutation';
import {
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
    onlineUsers: Int!
  }

  type Query {
    getNextQuestion: Question
    getMyScore: Float!
    getOnlineStats: OnlineStats!
    getUserStats: Stats!
    viewer: Viewer!
  }

  type Mutation {
    saveTip(
      id: String!
      tip: Int!
      rId: Int!
      gId: Int!
      previousTips: [Int!]!
      knewAnswer: Boolean
      msElapsed: Int!
    ): String
    signIn(email: String!, password: String!): SignInResult!
    signOut: SignOutResult!
    signUp(email: String!, password: String!): SignUpResult!
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
    slug: String
    name: String
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
    saveTip,
    signIn,
    signOut,
    signUp,
  },
  Query: {
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
