import { gql } from '@apollo/client';

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($id: String!, $token: String!, $newPassword: String!) {
    resetPassword(id: $id, token: $token, newPassword: $newPassword) {
      ... on ValidationError {
        errors {
          error
          path
        }
      }
    }
  }
`;
