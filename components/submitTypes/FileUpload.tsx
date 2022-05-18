import * as http from "@tauri-apps/api/http";
import { basename } from "@tauri-apps/api/path";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";

import { Card, Empty, Button, Tabs, List, notification, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";

import { useParams } from "react-router-dom";
import getAPIKey from "../../utils/getAPIKey";

import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from "firebase/auth";

const { TabPane } = Tabs;

interface File {
  name: string;
  id: number;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "canvas-app-cd3aa.firebaseapp.com",
  projectId: "canvas-app-cd3aa",
  storageBucket: "canvas-app-cd3aa.appspot.com",
  messagingSenderId: "174050746253",
  appId: "1:174050746253:web:af0c8c15f6ebd773ae27c4",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

export default function FileUpload(props: {
  item: string;
  setCurrent: (a: number) => void;
  setSuccess: (a: number) => void;
}) {
  const { course, assignment } = useParams();
  const [list, setList] = useState<File[]>([]);
  const [authToken, setAuthToken] = useState <string>();

  useEffect(() => {
    getRedirectResult(auth).then((user) => {
      if (user) {
        setAuthToken(GoogleAuthProvider.credentialFromResult(user)?.accessToken);
      }
    });

    window.gapi.load("picker", () => {});
  }, [])

  return (
    <>
      <Alert
        showIcon
        style={{ marginBottom: "0.75rem" }}
        type="warning"
        closable
        message="Only one file can be uploaded at a time even if it may appear that you can upload multiple"
      />
      <Card key={props.item}>
        <List
          dataSource={list}
          renderItem={(item: File) => (
            <List.Item>
              <List.Item.Meta title={item.name} />
              <Button
                icon={
                  <FontAwesomeIcon icon={faXmark} className="cursor-pointer" />
                }
                onClick={async () => {
                  const res = await http.fetch(
                    `https://apsva.instructure.com/api/v1/files/${item.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${await getAPIKey()}`,
                      },
                    }
                  );

                  if (res.ok) {
                    const newList = list.filter((value) => value.id != item.id);

                    setList(newList);

                    if (newList.length <= 0) {
                      props.setCurrent(-1);
                    }
                  } else {
                    notification.error({
                      message: "An error occurred",
                    });
                  }
                }}
              ></Button>
            </List.Item>
          )}
        />
        <Button
          icon={<FontAwesomeIcon className="mr-2" icon={faGoogleDrive} />}
          className="mr-3"
          onClick={() => {
            // @ts-expect-error
            console.log(window.google.picker)
            if (authToken) {
              // @ts-expect-error
              const picker = new window.google.picker.PickerBuilder()
                .setDeveloperKey(import.meta.env.VITE_FIREBASE_KEY)
                .setAppId("1:174050746253:web:af0c8c15f6ebd773ae27c4")
                .setOAuthToken(authToken)
                // @ts-expect-error
                .addView(google.picker.ViewId.FOLDERS)
                .setCallback((item: any) => console.log(item))
                .build();
              picker.setVisible(true);
            } else {
              signInWithRedirect(auth, provider)
            };
          }}
        >
          Select from Google
        </Button>
        <Button
          icon={<FontAwesomeIcon className="mr-2" icon={faUpload} />}
          onClick={async () => {
            try {
              const path = await open();
              // @ts-expect-error
              const name = await basename(path);
              // @ts-expect-error
              const fileData = await readBinaryFile(path);
              const data: { data: any; ok: boolean } = await http.fetch(
                `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions/self/files`,
                {
                  method: "POST",
                  body: http.Body.form({
                    name: name,
                    size: fileData.length.toString(),
                  }),
                  headers: {
                    Authorization: `Bearer ${await getAPIKey()}`,
                  },
                }
              );

              if (data.ok) {
                const formData = new FormData();

                for (const key in data.data.upload_params) {
                  formData.append(key, data.data.upload_params[key]);
                }

                formData.append("file", new Blob([fileData]));

                const fileUpload = await fetch(data.data.upload_url, {
                  method: "POST",
                  body: formData,
                });

                if (fileUpload.ok) {
                  const fileUploadData = await fileUpload.json();

                  setList(
                    list.concat({
                      name: fileUploadData.display_name,
                      id: fileUploadData.id,
                    })
                  );

                  props.setCurrent(0);
                } else {
                  notification.error({
                    message: "A upload error occurred",
                  });
                }
              } else {
                notification.error({
                  message: "A upload error occurred",
                });
              }
            } catch (err) {
              notification.error({
                message: "An error occurred",
                description: `${err}`,
              });
            }
          }}
        >
          Select File
        </Button>
      </Card>
      <div className="flex flex-row">
        <Button
          type="primary"
          size="large"
          className="mt-4"
          icon={<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />}
          onClick={async () => {
            try {
              let query = {
                "submission[submission_type]": "online_upload",
                "submission[file_ids][]": list
                  .map((item) => item.id.toString())
                  .join(","),
              };
              const data = await http.fetch(
                `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions`,
                {
                  method: "POST",
                  query: query,
                  headers: {
                    Authorization: `Bearer ${await getAPIKey()}`,
                  },
                }
              );

              if (data.ok) {
                setList([]);
                props.setSuccess(1);
                props.setCurrent(1);
              } else {
                props.setSuccess(0);
              }
            } catch (err) {
              console.log(err);
              props.setSuccess(0);
            }
          }}
        >
          Submit Assignment
        </Button>
      </div>
    </>
  );
}
