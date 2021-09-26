import { gql } from 'apollo-server-express';
import { saveTip, signIn, signUp } from './mutation';
import { getMyScore } from './query';
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

  type Query {
    getNextQuestion: Question
    getMyScore: Float!
  }

  type Mutation {
    saveTip(id: String!, tip: Int!): Question
    signIn(email: String!, password: String!): SignInResult!
    signUp(email: String!, password: String!): SignUpResult!
  }

  union SignUpResult = SignInSuccess | ValidationError
  union SignInResult = SignInSuccess | ValidationError

  type SignInSuccess {
    viewer: Viewer!
  }

  type User {
    description: String
    email: String!
    id: ID!
    name: String
    role: UserRole!
    score: Float
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

const questions: Question[] = [
  {
    id: '40b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: 'What is flop?',
    previousTips: [],
    correctAnswer: 10,
    unit: 'm',
  },
];

export const resolvers = {
  Mutation: {
    saveTip,
    signIn,
    signUp,
  },
  Query: {
    getNextQuestion: () => questions[0], // databaze.vytahniMiNextQuestion(130) => Question
    getMyScore,
  },
  ...types
};
