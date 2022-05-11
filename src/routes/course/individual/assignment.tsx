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
  name: string;
  description: string;
  due_at: string;
}

export default function Assignment() {
  const { course, assignment } = useParams();
  const [data, setData] = useState<Assignment>();

  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}`,
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
          <div style={{ display: "flex", verticalAlign: "middle" }}>
            <Title style={{ margin: 0 }}>{data.name}</Title>
            <div style={{ flexGrow: 1 }}></div>
            <Center height="46.73px">
              <Text style={{ marginRight: "10px" }}>
                <span style={{ color: "gray" }}>Due on:</span>&nbsp;
                {new Date(Date.parse(data.due_at)).toLocaleString(
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
          {data.description != "" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data.description, {
                  USE_PROFILES: { html: true },
                }),
              }}
            ></div>
          ) : (
            <Empty />
          )}
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
