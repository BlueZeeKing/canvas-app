import { useParams } from "react-router";
import { useState } from "react";

import Main from "../../../components/Main";
import { Skeleton, Divider, Typography } from "antd";
import setItem from "../../../utils/breadcrumb";
import useAPI from "../../../utils/useAPI";
import HTML from "../../../components/HTML";

const { Title } = Typography;

interface Course {
  id: string;
  syllabus_body: string;
}

export default function Discussion() {
  const { course } = useParams()
  const [data, setData] = useState<Course>();

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}?include=syllabus_body`,
    (body) => {
      setData(body);
      setItem(2, "Syllabus", `/${course}/syllabus`);
    }
  );

  return (
    <Main>
      {data ? (
        <div>
          <Title>Syllabus</Title>
          <Divider />
          <HTML html={data.syllabus_body} />
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
