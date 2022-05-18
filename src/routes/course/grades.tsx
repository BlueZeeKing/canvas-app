import { useParams } from "react-router"
import { useState, useEffect } from "react"

import Main from "../../../components/MainInfinite";
import setItem from "../../../utils/breadcrumb";
import { Skeleton, Menu } from "antd";
import { Link } from "react-router-dom";
import useAPI, {fetchData} from "../../../utils/useInfiniteAPI";

interface GradeItem {
  id: number;
  assignment_name: string;
  assignment_id: string;
  current_grade: string;
  score: string;
}

export default function Grades() {
  const { course } = useParams();
  const [data, setData] = useState<GradeItem[]>([]);

  setItem(2, "Grades", `/${course}/grades`);

  function handleAPI(inData: GradeItem[]) {
    console.log(inData)
    setData(data.concat(inData));
  }

  const { next, setNext, complete, setComplete } = useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/grading_periods`,
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
          <Menu.ItemGroup title="Grades">
            {data.map((discussion) => (
              <Menu.Item key={discussion.id}>
                <Link to={`/${course}/announcement/${discussion.id}`}>
                  {discussion.assignment_name} {discussion.score} {discussion.current_grade}
                </Link>
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </Menu>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}