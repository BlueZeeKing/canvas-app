import { Tabs, Card, Input, Segmented, Button } from "antd";
import { useState, useMemo } from "react";
import { Converter } from "showdown"
import DOMPurify from "isomorphic-dompurify";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { fetch } from "@tauri-apps/api/http";
import getAPIKey from "../../utils/getAPIKey";

const { TabPane } = Tabs;

const converter = new Converter();

export default function TextInput(props: {
  item: string;
  setCurrent: (a: number) => void;
  setSuccess: (a: number) => void;
}) {
  const { course, assignment } = useParams();
  const [value, setValue] = useState("Source");
  const [text, setText] = useState("");

  return (
    <>
      <Card key={props.item}>
        <Segmented
          value={value}
          onChange={(value) => setValue(value.valueOf().toString())}
          style={{ marginBottom: "0.5rem" }}
          options={["Source", "Preview"]}
        />
        {value == "Source" ? (
          <Input.TextArea
            className="code"
            style={{ height: "10rem" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(converter.makeHtml(text)),
            }}
          ></div>
        )}
      </Card>
      <Button
        type="primary"
        size="large"
        className="mt-4"
        icon={<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />}
        onClick={async () => {
          try {
            let query = {
              "submission[submission_type]": "online_text_entry",
              "submission[body]": converter.makeHtml(text),
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

            if (data.ok) {
              setText("")
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
