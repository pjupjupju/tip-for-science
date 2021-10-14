import { gql } from '@apollo/client';

export const AuthQueryName = 'AuthQuery';

export const AUTH_QUERY = gql`
  query ${AuthQueryName} {
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
`;
