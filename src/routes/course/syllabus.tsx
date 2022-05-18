import { useParams } from "react-router";
import { useState } from "react";

import Main from "../../../components/Main";
import Center from "../../../components/Center";
import process from "../../../utils/htmlProcessor";
import { Skeleton, Avatar, Divider, Tooltip, Typography, Comment } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import setItem from "../../../utils/breadcrumb";
import useAPI from "../../../utils/useAPI";

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
          <div
            dangerouslySetInnerHTML={{
              __html: process(data.syllabus_body),
            }}
          ></div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
