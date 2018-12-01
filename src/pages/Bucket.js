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
  FormField,
  Tooltip,
  Position,
  IconButton,
  Popover
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
      isShowPut: false,
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
      this.setState({ buckets, name: "" });
    } else {
      toaster.danger(`${(bucket.err.description, bucket.err.fields)}`, {
        duration: 5
      });
    }
  };

  delete = async (index, id) => {
    const { buckets, uuid, token } = this.state;
    const response = await fetch(
      `http://localhost:5000/api/users/${uuid}/buckets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `application/json`
        },
        method: "DELETE"
      }
    );
    const result = await response;
    if (result.ok) {
      toaster.success("Bucket Delete", {
        duration: 3
      });

      delete buckets[index];
      this.setState({ buckets });
    } else {
      toaster.danger(`${(result.err.description, result.err.fields)}`, {
        duration: 5
      });
    }
  };

  putBucket = async (index, id) => {
    console.log(index, id);
    const { uuid, name, token, buckets } = this.state;
    const response = await fetch(
      `http://localhost:5000/api/users/${uuid}/buckets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `application/json`
        },
        method: "PUT",
        body: JSON.stringify({ name })
      }
    );
    const bucket = await response;
    console.log(bucket);
    if (bucket.ok) {
      buckets[index].name = name;
      toaster.success("Bucket Modifié", {
        duration: 3
      });
      this.setState({ buckets, name: "" });
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
          {buckets.map((bucket, index) => (
            <Pane
              key={index}
              elevation={index}
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
              <Text>{bucket.name}</Text>
              <Icon icon="folder-close" size={40} />
              <Pane>
                <Popover
                  bringFocusInside
                  content={
                    <Pane
                      width={320}
                      height={320}
                      paddingX={40}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      <Text>Change the Name : </Text>

                      <FormField label="">
                        <TextInput
                          label="name"
                          required
                          name="name"
                          placeholder={`${bucket.name}`}
                          description="name of the bucket"
                          autoFocus
                          width="100%"
                          value={this.state.name}
                          onChange={this.handleChange}
                        />
                        <Button
                          disabled={!this.state.name}
                          marginRight={16}
                          appearance="primary"
                          intent="success"
                          onClick={() => this.putBucket(index, bucket.id)}
                        >
                          Submit
                        </Button>
                      </FormField>
                    </Pane>
                  }
                >
                  <Icon icon="edit" color="teal" />
                </Popover>
                <Button
                  appearance="minimal"
                  onClick={() => this.delete(index, bucket.id)}
                >
                  <Icon icon="ban-circle" color="danger" marginRight={16} />
                </Button>
                <Tooltip content={`created at :  ${bucket.created_at}`}>
                  <Icon icon="info-sign" color="info" />
                </Tooltip>
              </Pane>
            </Pane>
          ))}
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
