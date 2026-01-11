import { gql } from '@apollo/client';

export const WIPE_BATCHES_MUTATION = gql`
  mutation WipeBatchesMutation {
    wipeBatches
  }
`;
