import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import process from "../../../../utils/htmlProcessor";
import { Skeleton, Menu, Divider, Avatar, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text, Title } = Typography

interface Announcement {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  posted_at: string;
  title: string;
  message: string;
}

export default function Assignments() {
  const { course, announcement } = useParams();
  const [data, setData] = useState<Announcement>();

  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics/${announcement}`,
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
            <Title style={{ margin: 0 }}>{data.title}</Title>
            <div style={{ flexGrow: 1 }}></div>
            <Center height="46.73px">
              <Text style={{ marginRight: "10px" }}>
                {data.author.display_name}
              </Text>
            </Center>
            <Center height="46.73px">
              <Avatar src={data.author.avatar_image_url} />
            </Center>
          </div>
          <Text style={{ color: "gray" }}>
            {new Date(Date.parse(data.posted_at)).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
          <Divider />
          <div
            dangerouslySetInnerHTML={{
              __html: process(data.message),
            }}
          ></div>
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
