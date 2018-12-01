import React, { Component } from "react";
import {
  TextInput,
  Button,
  toaster,
  Pane,
  Text,
  Paragraph,
  Icon,
  Dialog,
  FormField,
  Tooltip,
  Popover
} from "evergreen-ui";

import jwt from "jsonwebtoken";
import { Redirect } from "react-router-dom";

const APP_NAME = "myS3.app";

export default class Blob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: undefined,
      nickname: undefined,
      email: undefined,
      token: undefined,
      blobs: [],
      isShown: false,
      isShowPut: false,
      name: "",
      success: false
    };
  }

  // async componentDidMount() {
  //   const meta = JSON.parse(localStorage.getItem(APP_NAME));
  //   if (meta) {
  //     const token = meta.token;
  //     const decoded = jwt.decode(meta.token);
  //     const { uuid, nickname, email } = decoded;
  //
  //     const response = await fetch(
  //       `http://localhost:5000/api/users/${uuid}/blobs`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     const json = await response.json();
  //     this.setState({
  //       blobs: json.data.blobs,
  //       uuid,
  //       nickname,
  //       email,
  //       token
  //     });
  //   }
  // }

  content = () => {
    const { blobs } = this.state;
    if (blobs.length > 0) {
      return (
        <Pane clearfix>
          {blobs.map((blob, index) => (
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
              onDoubleClick={() => this.doAClick(blob.id)}
            >
              <Text>{blob.name}</Text>
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
                      flexDirection="column"
                    >
                      <Text>Change the Name : </Text>

                      <FormField label="">
                        <TextInput
                          label="name"
                          required
                          name="name"
                          placeholder={`${blob.name}`}
                          description="name of the blob"
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
                          onClick={() => this.putblob(index, blob.id)}
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
                  onClick={() => this.delete(index, blob.id)}
                >
                  <Icon icon="ban-circle" color="danger" marginRight={16} />
                </Button>
                <Tooltip content={`created at :  ${blob.created_at}`}>
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
          Vous n'avez pas de blob, Je t'invite à en ajouté un
        </Paragraph>
      );
    }
  };

  render() {
    return (
      <div className="AppContent">
        <h1> blob</h1>
        <Button
          marginRight={16}
          iconBefore="folder-new"
          intent="success"
          marginBottom={16}
          onClick={() => this.setState({ isShown: true })}
        >
          Add a blob
        </Button>
        <Dialog
          isShown={this.state.isShown}
          title="Add a blob"
          onCloseComplete={() => this.setState({ isShown: false })}
          hasFooter={false}
        >
          <FormField label="">
            <Text>Username : </Text>
            <TextInput
              label="name"
              required
              name="name"
              description="name of the blob"
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
