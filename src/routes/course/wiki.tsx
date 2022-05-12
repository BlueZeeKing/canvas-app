import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../components/Main";
import process from "../../../utils/htmlProcessor";
import setItem from "../../../utils/breadcrumb";
import { Layout, Skeleton } from "antd";

export default function Wiki() {
  const { course } = useParams();
  const [data, setData] = useState();

  setItem(2, "Home", `/${course}/wiki`);

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
            __html: process(data),
          }}
        ></div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
