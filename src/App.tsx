import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { About } from "./pages/About";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
