import { gql } from '@apollo/client';

export const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ... on SignInSuccess {
        viewer {
          user {
            email
          }
        }
      }
      ... on ValidationError {
        errors {
          error
          path
        }
      }
    }
  }
`;
