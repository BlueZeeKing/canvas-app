import { Layout, Menu, Affix } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import useAPI from "../utils/useAPI";

const { Sider } = Layout;

export default function Sidebar() {
  const { course } = useParams();
  
  // @ts-expect-error
  const [data, setData] = useState<Array<any>>(course && window.localStorage.getItem(course) ? JSON.parse(window.localStorage.getItem(course)).data : []);

  useAPI(`https://apsva.instructure.com/api/v1/courses/${course}/tabs`, (data) => {
    setData(data);
    // @ts-expect-error
    window.localStorage.setItem(course, JSON.stringify({ data: data }));
  });

  return (
    <Sider>
      <Menu mode="inline" style={{ minHeight: "100%" }}>
        {data
          ? data
              .filter((item) => item.type == "internal")
              .map((item) => (
                <Menu.Item key={item.id}>
                  <Link to={url(course, item)}>{item.label}</Link>
                </Menu.Item>
              ))
          : ""}
      </Menu>
    </Sider>
  );
}

function url(course: any, item: { id: string, full_url: string}) {
  if (item.id == "home") {
    return `/${course}/wiki`;
  } else if (item.id == "announcements") {
    return `/${course}/announcements`;
  } else if (item.id == "modules") {
    return `/${course}/modules`;
  } else if (item.id == "assignments") {
    return `/${course}/assignments`;
  } else if (item.id == "discussions") {
    return `/${course}/discussions`;
  } else {
    return "/404";
  }
}