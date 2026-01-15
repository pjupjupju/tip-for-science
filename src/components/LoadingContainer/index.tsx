import Stack from '@mui/material/Stack';

import { Container, ContainerProps } from '../Container';
import { Spinner } from '../Spinner';

const LoadingContainer = (props: Omit<ContainerProps, 'children'>) => (
  <Container {...props}>
    <Stack
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner />
    </Stack>
  </Container>
);

export { LoadingContainer };
