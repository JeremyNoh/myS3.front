import React, { Component } from "react";
import { TextInput, Button, toaster, Pane, Text } from "evergreen-ui";

import { Redirect } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      password: "",
      success: false
    };
  }

  login = async () => {
    let { nickname, password } = this.state;
    let user = {};
    user.nickname = nickname;
    user.password = password;

    const response = await fetch("http://localhost:5000/api/auth/login", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(user)
    });

    const json = await response.json();

    if (json.data) {
      toaster.success(" You are connected", {
        duration: 3
      });
      this.props.handleUser(json.data.user, json.meta);
      this.setState({ success: true });
    } else {
      this.setState({ password: "" });
      toaster.danger(`${(json.err.description, json.err.fields)}`, {
        duration: 5
      });
    }
  };

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };
  goToDashboard = () => {
    if (this.state.success) {
      return <Redirect to="/bucket" />;
    }
  };

  render() {
    const { nickname, password } = this.state;

    return (
      <div className="AppContent">
        <Pane
          elevation={0}
          width={400}
          height={500}
          background="tint2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <h1> Login</h1>

          <Text>Username : </Text>
          <TextInput
            label="A controlled text input field"
            required
            name="nickname"
            description="This is a description."
            value={nickname}
            onChange={this.handleChange}
          />
          <br />

          <Text>Password :</Text>
          <TextInput
            label="A controlled text input field"
            required
            description="This is a description."
            value={password}
            type="password"
            name="password"
            onChange={this.handleChange}
          />
          <br />
          <Button
            disabled={!nickname || !password}
            marginRight={16}
            appearance="primary"
            intent="success"
            onClick={this.login}
          >
            Submit
          </Button>
          {this.goToDashboard()}
        </Pane>
      </div>
    );
  }
}
