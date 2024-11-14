import { gql } from '@apollo/client';

export const IMPORT_TRANSLATIONS_MUTATION = gql`
  mutation ImportTranslationsMutation {
    importTranslations
  }
`;
