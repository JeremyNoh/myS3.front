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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="AppContent">
        <h1> Home</h1>
      </div>
    );
  }
}
