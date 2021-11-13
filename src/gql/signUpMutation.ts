import { gql } from '@apollo/client';

export const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      ... on SignInSuccess {
        viewer {
          user {
            email
            id
            slug
            name
            role
            score
            createdAt
            updatedAt
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
