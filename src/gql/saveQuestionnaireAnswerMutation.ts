import { gql } from '@apollo/client';

export const SAVE_QUESTIONNAIRE_MUTATION = gql`
  mutation SaveQuesionnaireAnswerMutation($questionId: Int!, $value: Int!) {
    saveQuestionnaireAnswer(questionId: $questionId, value: $value)
  }
`;
