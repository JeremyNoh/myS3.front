import React, { Component } from "react";
import {
  TextInput,
  Button,
  toaster,
  Paragraph,
  SideSheet,
  FormField,
  Table
} from "evergreen-ui";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="AppContent">
        <h1> Login</h1>
      </div>
    );
  }
}
