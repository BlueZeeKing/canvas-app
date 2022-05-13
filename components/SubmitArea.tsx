import * as http from "@tauri-apps/api/http";
import { basename } from "@tauri-apps/api/path";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { useState } from "react"

import { Card, Empty, Button, Tabs, List } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUpload, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const { TabPane } = Tabs;

interface File {
  name: string;
  id: number;
}

export default function SubmitArea(props: { type: string[] }) {
  const { course, assignment } = useParams()
  const [list, setList] = useState<File[]>([]);
  if (props.type.length > 0 && props.type[0] != "not_graded") {
    return (
      <Tabs>
        {props.type.map((item) => {
          if (item == "online_upload") {
            return (
              <TabPane tab="File Upload" className="flex flex-col">
                <Card key={item}>
                  <List
                    dataSource={list}
                    renderItem={(item: File) => (
                      <List.Item>
                        <List.Item.Meta title={item.name} />
                        <Button
                          icon={
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="cursor-pointer"
                            />
                          }
                          onClick={async () => {
                            const res = await http.fetch(
                              `https://apsva.instructure.com/api/v1/files/${item.id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${
                                    import.meta.env.VITE_API_KEY
                                  }`,
                                },
                              }
                            );

                            setList(list.filter((value) => value.id != item.id))

                            console.log(res)
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
                            parent_folder_path: "Uploaded Media",
                            size: fileData.length.toString(),
                          }),
                          headers: {
                            Authorization: `Bearer ${
                              import.meta.env.VITE_API_KEY
                            }`,
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

                      setList(
                        list.concat({
                          name: fileUploadData.display_name,
                          id: fileUploadData.id,
                        })
                      );
                    }}
                  >
                    Select File
                  </Button>
                </Card>
                <div className="flex flex-row">
                  <Button type="primary" size="large" className="mt-4" icon={<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />} onClick={async () => {
                    let query = {
                      "submission[submission_type]": "online_upload",
                    };
                    // @ts-expect-error
                    list.forEach((item, index) => query[`submission[file_ids][${index}]`] = item.id.toString());
                    const data = await http.fetch(
                      `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions`,
                      {
                        method: "POST",
                        query: {
                          "submission[submission_type]": "online_upload",
                          "submission[file_ids][]": list
                            .map((item) => item.id)
                            .join(","),
                        },
                        headers: {
                          Authorization: `Bearer ${
                            import.meta.env.VITE_API_KEY
                          }`,
                        },
                      }
                    );

                    console.log(data)
                  }}>Submit Assignment</Button>
                </div>
              </TabPane>
            );
          } else if (item == "text_entry") {
            return (
              <TabPane tab="Text Entry">
                <Card key={item}>
                  <TextArea />
                </Card>
              </TabPane>
            );
          }
        })}
      </Tabs>
    );
  } else {
    return <Empty />;
  }
}
