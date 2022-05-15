import { Tabs, Card, Input, Segmented, Button, Select } from "antd";
import { useState, useMemo } from "react";
import { Converter } from "showdown"
import DOMPurify from "isomorphic-dompurify";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { fetch } from "@tauri-apps/api/http";
import getAPIKey from "../../utils/getAPIKey";

const { TabPane } = Tabs;
const { Option } = Select;

export default function TextInput(props: {
  item: string;
  setCurrent: (a: number) => void;
  setSuccess: (a: number) => void;
}) {
  const { course, assignment } = useParams();
  const [value, setValue] = useState("https://")
  const [text, setText] = useState("");

  return (
    <>
      <Card key={props.item}>
        <div className="flex flex-row">
          <FontAwesomeIcon className="p-2" icon={faLink} />
          <Input
            addonBefore={
              <Select
                onChange={(e) => setValue(e)}
                defaultValue="https://"
                className="select-before"
              >
                <Option value="http://">http://</Option>
                <Option value="https://">https://</Option>
              </Select>
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="submission url"
            status={validator(value + text)}
          />
        </div>
      </Card>
      <Button
        type="primary"
        size="large"
        className="mt-4"
        icon={<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />}
        onClick={async () => {
          try {
            let query = {
              "submission[submission_type]": "online_url",
              "submission[url]": text,
            };
            const data = await fetch(
              `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}/submissions`,
              {
                method: "POST",
                query: query,
                headers: {
                  Authorization: `Bearer ${await getAPIKey()}`,
                },
              }
            );

            console.log(data);

            if (data.ok) {
              setText("");
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
    </>
  );
}

const pattern = new RegExp(
  "^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$",
  "i"
);

function validator(url: string): "" | "error" | "warning" {
  return !!pattern.test(url) ? "" : "error";
}