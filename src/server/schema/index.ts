import { gql } from 'apollo-server-express';
import { saveTip, signIn, signOut, signUp } from './mutation';
import { getMyScore, viewer } from './query';
import * as types from './types';

export * from './context';

export const typeDefs = /* GraphQL */ gql`
  scalar DateTime

  type Question {
    id: String!
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

  type Query {
    getNextQuestion: Question
    getMyScore: Float!
    viewer: Viewer!
  }

  type Mutation {
    saveTip(id: String!, tip: Int!): Question
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

type Question = {
  id: string;
  question: string;
  image?: string;
  previousTips: number[];
  correctAnswer: number;
  timeLimit?: number;
  unit: string;
};

type Tip = {
  id: string;
  question: string;
  previousTips: number[];
  correctAnswer: number;
  tip: number;
  msElapsed: number;
};

const questions: Question[] = [
  {
    id: '40b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: 'What is flop?',
    previousTips: [],
    correctAnswer: 10,
    unit: 'm',
  },
];

// const viewer = () => {};

export const resolvers = {
  Mutation: {
    saveTip,
    signIn,
    signOut,
    signUp,
  },
  Query: {
    getNextQuestion: () => questions[0], // databaze.vytahniMiNextQuestion(130) => Question
    getMyScore,
    viewer,
  },
  ...types,
};
