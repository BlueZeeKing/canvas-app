import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { save } from "@tauri-apps/api/dialog"
import { writeBinaryFile } from "@tauri-apps/api/fs";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import { Skeleton, Menu, Divider, Empty, Typography } from "antd";
import { Document, Page } from "react-pdf";
import setItem from "../../../../utils/breadcrumb";
import useAPI from "../../../../utils/useAPI";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const { Text, Title } = Typography

interface File {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  id: number;
  created_at: string;
  display_name: string;
  body: string;
  due_at: string;
  url: string;
}

export default function File() {
  const { course, file } = useParams();
  const [data, setData] = useState<File>();
  const [url, setUrl] = useState("");
  const [numPages, setNumPages] = useState(0);

  setItem(3, "File", `/${course}/file/${file}`);

  useAPI(`https://apsva.instructure.com/api/v1/files/${file}`, (body) => {
    setData(body);
    setItem(3, body.display_name, `/${course}/file/${file}`);
  });

  useAPI(`https://apsva.instructure.com/api/v1/files/${file}/public_url`, (body) => {
    setUrl(body.public_url);
  });

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      textLayers.forEach(layer => {
        // @ts-expect-error
        const { style } = layer;
        style.top = "0";
        style.left = "0";
        style.transform = "";
    });
  }

  // @ts-expect-error
  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
  }

  return (
    <Main>
      {data ? (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", verticalAlign: "middle" }}>
            <Title style={{ margin: 0 }}>{data.display_name}</Title>
            <div style={{ flexGrow: 1 }}></div>
            <Center height="46.73px">
              <a onClick={() => {
                save({defaultPath: data.display_name}).then((path) => {
                  fetch(url).then(res => res.arrayBuffer()).then(file => writeBinaryFile({path: path, contents: new Uint8Array(file)}))
                })
              }}>Click to download</a>
            </Center>
          </div>
          <Text style={{ color: "gray" }}>
            {new Date(Date.parse(data.created_at)).toLocaleString(
              "en-US",
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }
            )}
          </Text>
          <Divider />
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {
            // @ts-expect-error
            Array.apply(null, { length: numPages })
              .map(Number.call, Number)
              .map((item, index) =>
                item == null ? (
                  ""
                ) : (
                  <Page
                    onLoadSuccess={removeTextLayerOffset}
                    pageNumber={index + 1}
                    className="m-1"
                  />
                )
              )}
          </Document>
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
