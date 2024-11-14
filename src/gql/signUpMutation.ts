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
            age
            gender
            role
            score
            createdAt
            updatedAt
            language
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
