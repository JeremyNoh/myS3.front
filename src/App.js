import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Bucket from "./pages/Bucket";

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <>
            <Route exact path="/" render={props => <Home {...props} />} />
            <Route
              path="/auth/register"
              render={props => <Register {...props} />}
            />
            <Route path="/auth/login" render={props => <Login {...props} />} />
            <Route path="/bucket" render={props => <Bucket {...props} />} />
          </>
        </Router>
      </>
    );
  }
}

export default App;
