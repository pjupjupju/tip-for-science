import { gql } from '@apollo/client';

export const QUESTIONNAIRE_QUERY = gql`
  query QuestionnaireQuery {
    getQuestionnaire {
      id
      item
      value
    }
  }
`;
