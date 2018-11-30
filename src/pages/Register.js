import React, { Component } from "react";
import { TextInput, Button, toaster, Text, Pane } from "evergreen-ui";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  }

  // async componentDidMount() {
  //   const token = "dedededed";
  //
  //   const response = await fetch("http://localhost", {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   const json = await response.json();
  //   this.setState({ user: [json.data] });
  // }

  async post(user) {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      headers: {
        "Content-Type": `application/json`
      },
      method: "POST",
      body: JSON.stringify(user)
    });
    const json = await response.json();
    if (json.data) {
      this.props.handleUser(json.data.user, json.meta);
      toaster.success("User crée", {
        duration: 3
      });
    } else {
      this.setState({ password: "", passwordConfirmation: "" });
      toaster.danger(`${(json.err.description, json.err.fields)}`, {
        duration: 5
      });
    }
  }

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  register = () => {
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
      user.passwordConfirmation = passwordConfirmation;
      this.post(user);
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
          <h1> Register</h1>

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
            onClick={this.register}
          >
            Submit
          </Button>
        </Pane>
      </div>
    );
  }
}
