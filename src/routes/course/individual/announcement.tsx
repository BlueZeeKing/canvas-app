import { useParams } from "react-router";
import { useState, useEffect } from "react";

import Main from "../../../../components/Main";
import ItemHeader from "../../../../components/itemHeader";
import { Skeleton, Menu, Divider, Avatar, Typography } from "antd";
import setItem from "../../../../utils/breadcrumb";
import useAPI from "../../../../utils/useAPI";
import HTML from "../../../../components/HTML";

const { Text, Title } = Typography

interface Announcement {
  author: {
    display_name: string;
    avatar_image_url: string;
    id: string;
  };
  posted_at: string;
  title: string;
  message: string;
}

export default function Announcements() {
  const { course, announcement } = useParams();
  const [data, setData] = useState<Announcement>();

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics/${announcement}`,
    (body) => {
      setData(body);
      setItem(3, body.title, `/${course}/announcement/${announcement}`);
    }
  );

  return (
    <Main>
      {data ? (
        <div style={{ padding: "10px" }}>
          <ItemHeader title={data.title} authorId={data.author.id} authorImage={data.author.avatar_image_url} date={data.posted_at} authorName={data.author.display_name} />
          <HTML html={data.message} />
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
