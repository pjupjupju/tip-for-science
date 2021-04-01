import { gql } from 'apollo-server-express';
import { saveTip } from './mutation';

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
  }

  type Mutation {
    saveTip(id: String!, tip: Int!): Question
  }
`;

type Question = {
  id: string,
  question: string,
  image?: string,
  previousTips: number[],
  correctAnswer: number,
  timeLimit?: number,
  unit: string,
};

const questions :Question[] = [
  {
    id: '40b86d42-84aa-4ba7-9aa9-80b9c8f80cfa',
    question: "What is flop?",
    previousTips: [],
    correctAnswer: 10,
    unit: "m",
  }
];

export const resolvers = {
  Mutation: {
    saveTip,
  },
  Query: {
    getNextQuestion: () => questions[0], // databaze.vytahniMiNextQuestion(130) => Question
  },
};
