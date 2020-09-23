import React from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
