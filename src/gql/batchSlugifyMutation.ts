import { gql } from '@apollo/client';

export const BATCH_SLUGIFY_MUTATION = gql`
  mutation BatchSlugifyMutation {
    batchSlugify
  }
`;
