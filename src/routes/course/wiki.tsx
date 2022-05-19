import { useParams } from "react-router"
import { useState, useEffect } from "react"

import Main from "../../../components/Main";
import HTML from "../../../components/HTML";
import setItem from "../../../utils/breadcrumb";
import { Layout, Skeleton } from "antd";
import useAPI from "../../../utils/useAPI";

export default function Wiki() {
  const { course } = useParams();
  const [data, setData] = useState();

  setItem(2, "Home", `/${course}/wiki`);

  useAPI(`https://apsva.instructure.com/api/v1/courses/${course}/front_page`, (body) => setData(body.body));

  return (
    <Main>
      {data ? (
        <HTML html={data} />
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}
