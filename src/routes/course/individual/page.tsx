import { useParams } from "react-router";
import { useState, useEffect } from "react";

import Main from "../../../../components/Main";
import { Skeleton, Menu, Divider, Empty, Typography } from "antd";
import HTML from "../../../../components/HTML";
import setItem from "../../../../utils/breadcrumb";
import useAPI from "../../../../utils/useAPI";

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
  
  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/pages/${page}`,
    (body) => {
      setData(body);
      setItem(3, body.title, `/${course}/page/${page}`);
    }
  );

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
          <HTML html={data.body} />
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
