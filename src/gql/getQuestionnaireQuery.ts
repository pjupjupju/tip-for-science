import { gql } from '@apollo/client';

export const QuestionnaireQueryName = 'QuestionnaireQuery';

export const QUESTIONNAIRE_QUERY = gql`
  query ${QuestionnaireQueryName} {
    getQuestionnaire {
      id
      item
      value
    }
  }
`;
