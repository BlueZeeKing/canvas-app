import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../../components/Main";
import { Skeleton, Menu, Divider, Empty, Typography } from "antd";
import process from "../../../../utils/htmlProcessor";
import setItem from "../../../../utils/breadcrumb";

const { Text, Title } = Typography

interface Assignment {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  id: number;
  created_at: string;
  title: string;
  body: string;
  due_at: string;
}

export default function Page() {
  const { course, page } = useParams();
  const [data, setData] = useState<Assignment>();

  useEffect(() => {
    setItem(3, "Page", `/${course}/page/${page}`);
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/pages/${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data);
      // @ts-expect-error
      setItem(3, body.data.title, `/${course}/page/${page}`);
    });
  }, []);

  return (
    <Main>
      {data ? (
        <div style={{ padding: "10px" }}>
          <Title>{data.title}</Title>
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
          <div
            dangerouslySetInnerHTML={{
              __html: process(data.body),
            }}
          ></div>
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
