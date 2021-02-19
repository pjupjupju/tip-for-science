import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  # Q
  type Question {
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
`;

type Question = {
  question: string,
  image?: string,
  previousTips: number[],
  correctAnswer: number,
  timeLimit?: number,
  unit: string,
};

const questions :Question[] = [
  {
    question: "What is flop?",
    previousTips: [],
    correctAnswer: 10,
    unit: "m",
  }
];

const resolvers = {
  Query: {
    getNextQuestion: () => questions[0], // databaze.vytahniMiNextQuestion(130) => Question
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  GraphQL server ready at ${url}`);
});
