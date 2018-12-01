import React, { Component } from "react";
import { TextInput, Button, toaster, Pane, Text } from "evergreen-ui";

import jwt from "jsonwebtoken";

const APP_NAME = "myS3.app";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: undefined,
      token: undefined,
      nickname: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  }

  async componentDidMount() {
    const meta = JSON.parse(localStorage.getItem(APP_NAME));
    if (meta) {
      const token = meta.token;
      const decoded = jwt.decode(meta.token);
      const { uuid, nickname, email } = decoded;

      const response = await fetch(`http://localhost:5000/api/users/${uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await response.json();
      console.log(json);

      this.setState({
        uuid,
        nickname,
        email,
        token,
        created_at: json.data.created_at,
        updated_at: json.data.updated_at
      });
    }
  }

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  async putData(user) {
    const { token, uuid } = this.state;
    const response = await fetch(`http://localhost:5000/api/users/${uuid}`, {
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`
      },
      method: "PUT",
      body: JSON.stringify({ user })
    });
    const json = await response;
    console.log(json);
    if (json.ok) {
      // this.props.handleUser(json.data.user, json.meta);
      toaster.success("User Modifié", {
        duration: 3
      });
    } else {
      this.setState({ password: "", passwordConfirmation: "" });
      toaster.danger(`${(json.err.description, json.err.fields)}`, {
        duration: 5
      });
    }
  }

  changeInfo = () => {
    let { nickname, email, password, passwordConfirmation } = this.state;
    if (password.length < 5) {
      toaster.danger("The password is too small", {
        duration: 3
      });
      this.setState({ password: "", passwordConfirmation: "" });
      return;
    } else if (password === passwordConfirmation) {
      let user = {};
      user.nickname = nickname;
      user.email = email;
      user.password = password;
      user.password_confirmation = passwordConfirmation;
      this.putData(user);
    } else {
      toaster.danger("The password is not the same", {
        duration: 3
      });
      this.setState({ password: "", passwordConfirmation: "" });
    }
  };

  render() {
    const { nickname, email, password, passwordConfirmation } = this.state;

    return (
      <div className="AppContent">
        <h1> Dashboard </h1>
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
          <Text>Username : </Text>
          <TextInput
            label="A controlled text input field"
            required
            placeholder="Nickname"
            marginBottom={25}
            value={nickname}
            name="nickname"
            onChange={this.handleChange}
          />
          <Text>Email : </Text>
          <TextInput
            label="A controlled text input field"
            required
            type="email"
            placeholder="Email"
            marginBottom={25}
            value={email}
            name="email"
            onChange={this.handleChange}
          />
          <Text>Password :</Text>
          <TextInput
            label="A controlled text input field"
            required
            placeholder="Password"
            marginBottom={25}
            value={password}
            type="password"
            name="password"
            onChange={this.handleChange}
          />
          <Text>Password Confirmation :</Text>
          <TextInput
            label="A controlled text input field"
            required
            marginBottom={25}
            placeholder="PasswordConfirmation"
            value={passwordConfirmation}
            type="password"
            name="passwordConfirmation"
            onChange={this.handleChange}
          />

          <Button
            disabled={!nickname || !email || !password || !passwordConfirmation}
            marginRight={16}
            appearance="primary"
            intent="success"
            onClick={this.changeInfo}
          >
            Change
          </Button>
        </Pane>
      </div>
    );
  }
}
