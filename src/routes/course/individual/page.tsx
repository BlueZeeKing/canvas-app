import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import { Skeleton, Menu, Divider, Empty, Typography } from "antd";
import DOMPurify from "isomorphic-dompurify";

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

  console.log(useParams());

  useEffect(() => {
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
      console.log(body.data);
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
              __html: DOMPurify.sanitize(data.body, {
                USE_PROFILES: { html: true },
              }),
            }}
          ></div>
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
