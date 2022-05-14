import { fetch } from "@tauri-apps/api/http";
import { useState } from "react"

import { Card, Empty, Button, Tabs, Result } from "antd";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import FileUpload from "./submitTypes/FileUpload"
import TextInput from "./submitTypes/TextInput";

const { TabPane } = Tabs;

interface File {
  name: string;
  id: number;
}

export default function SubmitArea(props: { type: string[], setCurrent: (a: number) => void }) {
  const { course, assignment } = useParams()
  const [success, setSuccess] = useState(-1);

  if (props.type.length > 0 && props.type[0] != "not_graded") {
    console.log("continue")
    return (
      <Tabs activeKey={success >= 0 ? "result" : undefined}>
        {props.type.map((item) => {
          if (item == "online_upload") {
            return (
              <TabPane tab="File Upload" className="flex flex-col">
                <FileUpload
                  item={item}
                  setCurrent={props.setCurrent}
                  setSuccess={setSuccess}
                />
              </TabPane>
            );
          } else if (item == "online_text_entry") {
            return (
              <TabPane tab="Text Entry">
                <TextInput
                  item={item}
                  setCurrent={props.setCurrent}
                  setSuccess={setSuccess}
                />
              </TabPane>
            );
          }
        })}
        {success >= 0 ? (
          <TabPane tab="Result" key="result">
            <Result
              status={success == 1 ? "success" : "error"}
              title={
                success == 1
                  ? "Assignment successfully submitted"
                  : "An error occurred during the submission of your assignment"
              }
              extra={<Button icon={<FontAwesomeIcon icon={faXmark} className="mr-3" />} onClick={() => setSuccess(-1)}>Back Home</Button>}
            />
          </TabPane>
        ) : (
          ""
        )}
      </Tabs>
    );
  } else {
    return <Empty />;
  }
}
