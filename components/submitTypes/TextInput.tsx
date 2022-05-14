import { Tabs, Card, Input, Segmented } from "antd";
import { useState, useMemo } from "react";
import { Converter } from "showdown"
import DOMPurify from "isomorphic-dompurify";

const { TabPane } = Tabs;

const converter = new Converter();

export default function TextInput(props: {item: string}) {
  const [value, setValue] = useState("Source")
  const [text, setText] = useState("")

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
            style={{height: "10rem"}}
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
    </>
  );
}
