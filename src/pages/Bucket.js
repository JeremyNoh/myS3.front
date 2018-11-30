import React, { Component } from "react";
import {
  TextInput,
  Button,
  toaster,
  Table,
  Pane,
  Text,
  Paragraph,
  Icon,
  Dialog,
  FormField
} from "evergreen-ui";

import jwt from "jsonwebtoken";

const APP_NAME = "myS3.app";

export default class Bucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: undefined,
      nickname: undefined,
      email: undefined,
      token: undefined,
      buckets: [],
      isShown: false,
      name: ""
    };
  }

  async componentDidMount() {
    const meta = JSON.parse(localStorage.getItem(APP_NAME));
    if (meta) {
      const token = meta.token;
      const decoded = jwt.decode(meta.token);
      const { uuid, nickname, email } = decoded;

      const response = await fetch(
        `http://localhost:5000/api/users/${uuid}/buckets`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const json = await response.json();
      console.log(json.data.buckets);
      this.setState({
        buckets: json.data.buckets,
        uuid,
        nickname,
        email,
        token
      });
    }
  }

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  post = async () => {
    const { uuid, name, token, buckets } = this.state;
    const response = await fetch(
      `http://localhost:5000/api/users/${uuid}/buckets/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `application/json`
        },
        method: "POST",
        body: JSON.stringify({ name })
      }
    );
    const bucket = await response.json();
    if (bucket.id) {
      buckets.push(bucket);
      toaster.success("Bucket crée", {
        duration: 3
      });
      this.setState({ buckets });
    } else {
      toaster.danger(`${(bucket.err.description, bucket.err.fields)}`, {
        duration: 5
      });
    }
  };

  content = () => {
    const { buckets } = this.state;
    if (buckets.length > 0) {
      return (
        <Pane clearfix>
          <Pane
            elevation={4}
            float="left"
            width={200}
            height={120}
            margin={24}
            display="flex"
            backgroundColor="white"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text>Folder Two</Text>
            <Icon icon="folder-close" size={40} />
          </Pane>
        </Pane>
      );
    } else {
      return (
        <Paragraph>
          Vous n'avez pas de Bucket, Je t'invite à en crée un
        </Paragraph>
      );
    }
  };

  render() {
    return (
      <div className="AppContent">
        <h1> Bucket</h1>
        <Button
          marginRight={16}
          iconBefore="folder-new"
          intent="success"
          marginBottom={16}
          onClick={() => this.setState({ isShown: true })}
        >
          Add a Bucket
        </Button>
        <Dialog
          isShown={this.state.isShown}
          title="Add a Bucket"
          onCloseComplete={() => this.setState({ isShown: false })}
          hasFooter={false}
        >
          <FormField label="">
            <Text>Username : </Text>
            <TextInput
              label="name"
              required
              name="name"
              description="name of the bucket"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <Button
              disabled={!this.state.name}
              marginRight={16}
              appearance="primary"
              intent="success"
              onClick={this.post}
            >
              Submit
            </Button>
          </FormField>
        </Dialog>
        {this.content()}
      </div>
    );
  }
}
