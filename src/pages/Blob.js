import React, { Component } from "react";
import {
  TextInput,
  Button,
  toaster,
  Pane,
  Text,
  Paragraph,
  Icon,
  FormField,
  Tooltip,
  Popover,
  FilePicker
} from "evergreen-ui";

import jwt from "jsonwebtoken";

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
        `http://localhost:5000/api/users/${uuid}/buckets/${
          this.props.idBucket
        }/blobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const json = await response.json();
      this.setState({
        blobs: json.data.blobs,
        uuid,
        nickname,
        email,
        token
      });
    }
  }

  post = async file => {
    const { uuid, token, blobs } = this.state;

    console.log(file);
    const { name: originalname, size } = file[0];
    let data = new FormData();
    data.append("file", file);
    data.append("originalname", originalname);

    console.log(data);

    const response = await fetch(
      `http://localhost:5000/api/users/${uuid}/buckets/${
        this.props.idBucket
      }/blobs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/form-data`
        },
        method: "POST"
      }
    );

    const blob = await response;
    // const blob = await response.json();
    console.log(blob);
    //
    if (blob.id) {
      blobs.push(blob);
      toaster.success("Blobs crée", {
        duration: 3
      });
      this.setState({ blobs, name: "" });
    } else {
      toaster.danger(`Error, Somethings wong `, {
        duration: 5
      });
    }
  };

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
          Vous n'avez pas de blob, Je vous invite à en ajouter un
        </Paragraph>
      );
    }
  };

  render() {
    return (
      <div className="AppContent">
        <h1> blob</h1>
        <FilePicker
          multiple
          width={250}
          marginBottom={32}
          onChange={files => this.post(files)}
        />
        {this.content()}
      </div>
    );
  }
}
