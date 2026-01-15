import { gql } from '@apollo/client';

export const SAVE_QUESTIONNAIRE_BATCH_MUTATION = gql`
  mutation SaveQuesionnaireBatchMutation($items: [QuestionnaireItemInput!]!) {
    saveQuestionnaireBatch(items: $items)
  }
`;
