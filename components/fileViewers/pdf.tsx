import { useState } from "react";
import { Document, Page } from "react-pdf";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

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

export default function File(props: {url: string}) {
  const [numPages, setNumPages] = useState(0);

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(
      ".react-pdf__Page__textContent"
    );
    textLayers.forEach((layer) => {
      // @ts-expect-error
      const { style } = layer;
      style.top = "0";
      style.left = "0";
      style.transform = "";
    });
  }
  // @ts-expect-error
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document file={props.url} onLoadSuccess={onDocumentLoadSuccess}>
      {// @ts-expect-error
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
        )
      }
    </Document>
  );
}
