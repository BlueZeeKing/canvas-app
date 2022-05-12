import * as http from "@tauri-apps/api/http";
import { basename } from "@tauri-apps/api/path";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";

import { Card, Empty, Button, Tabs } from "antd";
import TextArea from "antd/lib/input/TextArea";

const { TabPane } = Tabs;

export default function SubmitArea(props: { type: string[] }) {
  if (props.type.length > 0 && props.type[0] != "not_graded") {
    return (
      <Tabs>
        {props.type.map((item) => {
          if (item == "online_upload") {
            return (
              <TabPane tab="File Upload">
                <Card key={item}>
                  <Button
                    type="primary"
                    onClick={() => {
                      const run = async () => {
                        const path = await open();
                        // @ts-expect-error
                        const name = await basename(path);
                        // @ts-expect-error
                        const fileData = await readBinaryFile(path);
                        const data: { data: any } = await http.fetch(
                          "https://apsva.instructure.com/api/v1/users/self/files",
                          {
                            method: "POST",
                            body: http.Body.form({
                              name: name,
                              parent_folder_path: "Uploaded Media",
                              size: fileData.length.toString()
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
                          formData.append(key, data.data.upload_params[key])
                        }

                        formData.append("file", new Blob([fileData]))

                        const fileUpload = await fetch(
                          data.data.upload_url,
                          {
                            method: "POST",
                            body: formData
                          }
                        );

                        console.log(fileUpload);
                      };

                      run();
                    }}
                  >
                    Select File
                  </Button>
                </Card>
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
