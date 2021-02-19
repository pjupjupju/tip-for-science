import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import theme from '@rebass/preset';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

export const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  colors: { background: 'black', primary: '#FF0070', secondary: '#5CC9FA' },
  fonts: {
    body: 'Tahoma',
    ...(theme as any).fonts,
  },
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={tipForScienceTheme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
