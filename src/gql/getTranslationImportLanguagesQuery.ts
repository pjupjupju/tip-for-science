import { gql } from '@apollo/client';

export const GET_TRANSLATION_IMPORT_LANGUAGES_QUERY = gql`
  query GetTranslationImportLanguages {
    getTranslationImportLanguages {
      languages
      errors
    }
  }
`;
