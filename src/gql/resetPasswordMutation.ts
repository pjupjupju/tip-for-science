import { gql } from '@apollo/client';

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($id: String!, $token: String!, $newPassword: String!) {
    signUp(id: $id, token: $token, newPassword: $newPassword) {
      ... on ValidationError {
        errors {
          error
          path
        }
      }
    }
  }
`;
