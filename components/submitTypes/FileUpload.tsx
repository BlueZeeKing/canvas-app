import * as http from "@tauri-apps/api/http";
import { basename } from "@tauri-apps/api/path";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

import { Card, Empty, Button, Tabs, List, Result, Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

interface File {
  name: string;
  id: number;
}

export default function FileUpload(props: {
  item: string;
  list: File[];
  setList: (a: File[]) => void;
  setCurrent: (a: number) => void;
  setSuccess: (a: number) => void;
}) {
  const { course, assignment } = useParams();

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
          dataSource={props.list}
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
                        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                      },
                    }
                  );

                  const newList = props.list.filter(
                    (value) => value.id != item.id
                  );

                  props.setList(newList);

                  if (newList.length <= 0) {
                    props.setCurrent(-1);
                  }
                }}
              ></Button>
            </List.Item>
          )}
        />
        <Button
          icon={<FontAwesomeIcon className="mr-2" icon={faUpload} />}
          onClick={async () => {
            const path = await open();
            // @ts-expect-error
            const name = await basename(path);
            // @ts-expect-error
            const fileData = await readBinaryFile(path);
            const data: { data: any } = await http.fetch(
              `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions/self/files`,
              {
                method: "POST",
                body: http.Body.form({
                  name: name,
                  size: fileData.length.toString(),
                }),
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                },
              }
            );

            const formData = new FormData();

            for (const key in data.data.upload_params) {
              formData.append(key, data.data.upload_params[key]);
            }

            formData.append("file", new Blob([fileData]));

            const fileUpload = await fetch(data.data.upload_url, {
              method: "POST",
              body: formData,
            });

            const fileUploadData = await fileUpload.json();

            props.setList(
              props.list.concat({
                name: fileUploadData.display_name,
                id: fileUploadData.id,
              })
            );

            props.setCurrent(0);
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
                "submission[file_ids][]": props.list
                  .map((item) => item.id.toString())
                  .join(","),
              };
              const data = await http.fetch(
                `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions`,
                {
                  method: "POST",
                  query: query,
                  headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
                  },
                }
              );

              if (data.ok) {
                props.setList([]);
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
