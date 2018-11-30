import React, { Component } from "react";
import { TextInput, Button, toaster, Pane, Text } from "evergreen-ui";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      password: ""
    };
  }

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
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
            onClick={this.join}
          >
            Submit
          </Button>
        </Pane>
      </div>
    );
  }
}
