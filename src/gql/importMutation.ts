import { gql } from '@apollo/client';

export const IMPORT_MUTATION = gql`
  mutation ImportQuestionsMutation {
    importQuestions
  }
`;
