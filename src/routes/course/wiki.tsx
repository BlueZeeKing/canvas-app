import { useParams } from "react-router"
import { useState, useEffect } from "react"

import Main from "../../../components/Main";
import process from "../../../utils/htmlProcessor";
import setItem from "../../../utils/breadcrumb";
import { Layout, Skeleton } from "antd";
import useAPI from "../../../utils/useAPI";

export default function Wiki(props: {course: number, setItem: (i: number, name: string, action: () => any) => void}) {
  const [data, setData] = useState();

  setItem(2, "Home", `/${props.course}/wiki`);

  useAPI(`https://apsva.instructure.com/api/v1/courses/${props.course}/front_page`, (body) => setData(body.body));

  return (
    <Main>
      {data ? (
        <div
          dangerouslySetInnerHTML={{
            __html: process(data),
          }}
        ></div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
