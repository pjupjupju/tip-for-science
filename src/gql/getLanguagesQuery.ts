import { gql } from '@apollo/client';

export const GetLanguagesQueryName = 'GetLanguagesQuery';

export const GET_LANGUAGES_QUERY = gql`
  query ${GetLanguagesQueryName} {
    getLanguages {
      id
      lang
      label
    }
  }
`;
