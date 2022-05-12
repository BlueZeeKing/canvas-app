import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../components/Main";
import setItem from "../../../utils/breadcrumb";
import { Skeleton, Menu } from "antd";
import { Link } from "react-router-dom";

interface Assignment {
  id: number,
  description: string,
  name: string
}

interface AssignmentGroup {
  id: number;
  name: string;
  assignments: Assignment[]
}

export default function Assignments() {
  const { course } = useParams();
  const [data, setData] = useState<AssignmentGroup[]>();

  setItem(2, "Assignments", `/${course}/assignments`);

  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/assignment_groups?include=assignments&per_page=80`,
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
          <Menu.ItemGroup title="Assignments">
            {data.map((group) => (
              <Menu.SubMenu key={group.id} title={group.name}>
                {group.assignments.map((assignment) => (
                  <Menu.Item key={assignment.id}>
                    <Link to={`/${course}/assignment/${assignment.id}`}>
                      {assignment.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu.ItemGroup>
        </Menu>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}