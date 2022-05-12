import { useParams } from "react-router"
import { useState, useEffect } from "react"

import Main from "../../../components/Main";
import setItem from "../../../utils/breadcrumb";
import { Skeleton, Menu } from "antd";
import { Link } from "react-router-dom";
import useAPI from "../../../utils/useAPI";

interface Discussion {
  id: number,
  title: string
}

export default function Discussions() {
  const { course } = useParams();
  const [data, setData] = useState<Discussion[]>();

  setItem(2, "Discussions", `/${course}/discussions`);

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics?per_page=50`,
    (body) => setData(body)
  );

  return (
    <Main>
      {data ? (
          <Menu mode="inline">
            <Menu.ItemGroup title="Discussions">
              {data.map((discussion) => (
                <Menu.Item key={discussion.id}>
                  <Link
                    to={`/${course}/discussion/${discussion.id}`}
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