import React from 'react';
import { css, keyframes } from '@emotion/css';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = () => (
  <div
    className={css`
      display: block;
      width: 50px;
      height: 50px;
      border: 7px solid #ff23693b;
      border-radius: 50%;
      border-top-color: #ff2369;
      animation: ${spin} 1s linear infinite;
    `}
  />
);

export { Spinner };
