import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "emotion-theming";
import theme from "@rebass/preset";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const tipForScienceTheme = {
  ...theme,
  radii: { default: 0 },
  colors: { background: "black", primary: "#FF0070" },
  fonts: {
    body: "Tahoma",
    ...(theme as any).fonts,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={tipForScienceTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
