import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { Play } from "./pages/Play";

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
          <Route path="/play">
            <Play />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
