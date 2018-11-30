import React, { Component } from "react";
import { TextInput, Button, Paragraph, Pane, minorScale } from "evergreen-ui";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="AppContent">
        <h1> Home</h1>
        <h2> Bienvenu sur ce site </h2>
        <Paragraph>
          Vous retrouvez votre espace privée sécurisé .... Ou pas
        </Paragraph>
        <Pane marginTop={22}>
          <Link to="/auth/login" color="neutral">
            <Button
              appearance="primary"
              intent="success"
              marginRight={minorScale(3)}
            >
              SignIn
            </Button>
          </Link>
          <Link to="/auth/register" color="neutral">
            <Button appearance="primary">SIgnUp</Button>
          </Link>
        </Pane>
      </div>
    );
  }
}
