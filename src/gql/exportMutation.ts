import { gql } from '@apollo/client';

export const EXPORT_MUTATION = gql`
  mutation ExportDataMutation {
    exportData
  }
`;
