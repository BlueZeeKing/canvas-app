import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../components/Main";
import setItem from "../../../utils/breadcrumb";
import { Skeleton, Menu } from "antd";
import { Link } from "react-router-dom";

interface Discussion {
  id: number,
  title: string
}

export default function Announcements() {
  const { course } = useParams();
  const [data, setData] = useState<Discussion[]>();

  setItem(2, "Announcements", `/${course}/announcements`);

  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics?per_page=50&only_announcements=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data);
    });
  }, []);

  return (
    <Main>
      {data ? (
          <Menu mode="inline">
            <Menu.ItemGroup title="Announcements">
              {data.map((discussion) => (
                <Menu.Item key={discussion.id}>
                  <Link
                    to={`/${course}/announcement/${discussion.id}`}
                  >
                    {discussion.title}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
          </Menu>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}