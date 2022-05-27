import { useParams } from "react-router";
import { useState } from "react";
import { save } from "@tauri-apps/api/dialog"
import { open } from "@tauri-apps/api/shell";
import { writeBinaryFile } from "@tauri-apps/api/fs";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import { Skeleton, Divider, Typography } from "antd";
import setItem from "../../../../utils/breadcrumb";
import useAPI from "../../../../utils/useAPI";

import FileViewer from "../../../../components/fileViewers/pdf";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const { Text, Title } = Typography

interface File {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  id: string;
  created_at: string;
  display_name: string;
  body: string;
  due_at: string;
  url: string;
  mime_class: string;
}

export default function File() {
  const { course, file } = useParams();
  const [data, setData] = useState<File>();
  const [url, setUrl] = useState("");

  useAPI(`https://apsva.instructure.com/api/v1/files/${file}`, (body) => {
    setData(body);
    setItem(3, body.display_name, `/${course}/file/${file}`);
  });

  useAPI(`https://apsva.instructure.com/api/v1/files/${file}/public_url`, (body) => {
    setUrl(body.public_url);
  });

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
                  fetch(url)
                    .then((res) => res.arrayBuffer())
                    .then((file) =>
                      writeBinaryFile({
                        path: path,
                        contents: new Uint8Array(file),
                      })
                    )
                    .then(() => open(path));
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
          {data.mime_class == "pdf" ? <FileViewer url={url} /> : data.mime_class == "image" ? <img src={url} /> : ""}
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
