import { gql } from '@apollo/client';

export const QUESTION_QUERY = gql`
  query NextQuestionQuery {
    getNextQuestion {
      question
      previousTips
    }
  }
`;
