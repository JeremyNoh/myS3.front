import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import jwt from "jsonwebtoken";

import { Popover, Menu, Button } from "evergreen-ui";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Bucket from "./pages/Bucket";
import Dashboard from "./pages/Dashboard";
import Blob from "./pages/Blob";

const APP_NAME = "myS3.app";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isConnected: false,
      user: null
    };

    this.checkUser();
  }

  checkUser = () => {
    const meta = JSON.parse(localStorage.getItem(APP_NAME));
    if (meta) {
      const decoded = jwt.decode(meta.token);
      // JSON = CHECK WITH SERVER IF NO EXPIRATION
      // this.handleUser(json.data.user, json.data.meta);
    }
  };

  logout = () => {
    localStorage.removeItem(APP_NAME);
    this.setState(
      {
        isConnected: false,
        user: null
      },
      () => {
        // window.location.href = "/";
      }
    );

    // REDIRECT
  };

  handleUser = (user, meta) => {
    localStorage.setItem(APP_NAME, JSON.stringify(meta));

    this.setState({
      isConnected: true,
      user
    });
  };

  render() {
    const { user, isConnected } = this.state;

    return (
      <Router>
        <>
          <div className="Menu">
            <Popover
              content={
                <Menu>
                  <Menu.Group title="Home">
                    <Menu.Item icon="home">
                      <Link to="/" color="neutral">
                        Home
                      </Link>
                    </Menu.Item>
                    {isConnected && (
                      <Menu.Item icon="folder-close">
                        <Link to="/bucket" color="neutral">
                          Bucket
                        </Link>
                      </Menu.Item>
                    )}
                    {isConnected && (
                      <Menu.Item icon="people">
                        <Link to="/dashboard" color="neutral">
                          Dashboard
                        </Link>
                      </Menu.Item>
                    )}
                    {!isConnected && (
                      <Menu.Item icon="edit">
                        <Link to="/auth/login" color="neutral">
                          SignIn
                        </Link>
                      </Menu.Item>
                    )}
                    {!isConnected && (
                      <Menu.Item icon="mugshot">
                        <Link to="/auth/register" color="neutral">
                          SignUp
                        </Link>
                      </Menu.Item>
                    )}
                  </Menu.Group>
                  <Menu.Divider />
                  {isConnected && (
                    <Menu.Group title="Connection">
                      <Menu.Item icon="power" intent="danger">
                        <a href="/" onClick={this.logout}>
                          SignOut
                        </a>
                      </Menu.Item>
                    </Menu.Group>
                  )}
                </Menu>
              }
            >
              <Button appearance="primary">Menu</Button>
            </Popover>
          </div>
          <Route exact path="/" component={Home} />
          <Route
            path="/auth/login"
            render={props => {
              return <Login {...props} handleUser={this.handleUser} />;
            }}
          />
          <Route
            path="/auth/register"
            render={props => {
              return <Register {...props} handleUser={this.handleUser} />;
            }}
          />
          {isConnected && (
            <Route
              path="/dashboard"
              render={props => {
                return <Dashboard {...props} nickname={user.nickname} />;
              }}
            />
          )}
          {isConnected && (
            <Route path="/bucket" render={props => <Bucket {...props} />} />
          )}
          {isConnected && (
            <Route path="/blob" render={props => <Blob {...props} />} />
          )}
        </>
      </Router>
    );
  }
}

export default App;
