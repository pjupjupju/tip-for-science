import { gql } from '@apollo/client';

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestResetPasswordMutation($email: String!) {
    requestPasswordReset(email: $email) {
      ... on ValidationError {
        errors {
          error
          path
        }
      }
    }
  }
`;
