import React from 'react';
import { Global } from '@emotion/react';

const GlobalStyles = () => (
  <Global styles={(theme) => {
      console.log('theme: ', theme);
      return ({ fontFamily: 'Jost' });
  }} />
);

export { GlobalStyles };
