import { useState, useEffect } from "react"
import mammoth from "mammoth";
import process from "../../utils/htmlProcessor";

export default function DocxViewer(props: {url: string}) {
  const [data, setData] = useState("")
  useEffect(() => {
    mammoth
      .convertToHtml({ path: props.url })
      .then(function (result) {
        setData(result.value)
      })
  })

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: process(data),
        }}
      ></div>
    </div>
  );
}