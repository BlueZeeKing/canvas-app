import { useParams } from "react-router"
import { useState, useEffect } from "react"

import Main from "../../../components/MainInfinite";
import setItem from "../../../utils/breadcrumb";
import { Skeleton, Menu } from "antd";
import { Link } from "react-router-dom";
import useAPI, {fetchData} from "../../../utils/useInfiniteAPI";

interface Assignment {
  id: string,
  description: string,
  name: string
}

interface AssignmentGroup {
  id: string;
  name: string;
  assignments: Assignment[]
}

export default function Assignments() {
  const { course } = useParams();
  const [data, setData] = useState<AssignmentGroup[]>([]);

  setItem(2, "Assignments", `/${course}/assignments`);

  function handleAPI(inData: AssignmentGroup[]) {
    setData(data.concat(inData));
  }

  const { next, setNext, complete, setComplete } = useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/assignment_groups?include=assignments`,
    handleAPI
  );

  return (
    <Main
      length={data.length}
      handleNext={() => fetchData(next, handleAPI, setNext, setComplete)}
      complete={complete}
    >
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
        <Skeleton active />
      )}
    </Main>
  );
}