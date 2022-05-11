import { useParams } from "react-router"
import { useState, useEffect } from "react"
import DOMPurify from "isomorphic-dompurify";
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../components/Main";
import { Layout, Skeleton } from "antd";

export default function Wiki() {
  const { course } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/front_page`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data.body);
    });
  }, []);

  return (
    <Main>
      {data ? (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data, {
              USE_PROFILES: { html: true },
            }),
          }}
        ></div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
