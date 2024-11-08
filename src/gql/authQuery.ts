import { gql } from '@apollo/client';

export const AuthQueryName = 'AuthQuery';

export const AUTH_QUERY = gql`
  query ${AuthQueryName} {
    viewer {
      user {
        email
        id
        slug
        role
        score
        createdAt
        updatedAt
        age
        gender
        language
      }
    }
  }
`;
