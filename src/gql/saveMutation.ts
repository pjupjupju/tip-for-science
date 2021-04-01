import { gql } from '@apollo/client';

export const SAVE_MUTATION = gql`
  mutation SaveTipMutation($id: String!, $tip: Int!) {
    saveTip(id: $id, tip: $tip) {
      id
      image
      question
      correctAnswer
      previousTips
      unit
    }
  }
`;
