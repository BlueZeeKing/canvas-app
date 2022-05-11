import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { fetch } from "@tauri-apps/api/http"

const { Sider } = Layout;

export default function Sidebar() {
  const [data, setData] = useState<Array<any>>();
  const { course } = useParams();

  useEffect(() => {
    if (course && window.localStorage.getItem(course)) {
      // @ts-expect-error
      const old = JSON.parse(window.localStorage.getItem(course));
      if (Date.now() - old.time > 10000) {
        fetch(`https://apsva.instructure.com/api/v1/courses/${course}/tabs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        }).then((body) => {
          // @ts-expect-error
          setData(body.data);
          window.localStorage.setItem(course, JSON.stringify({data: body.data, time: Date.now().toString()}));
        });
      } else {
        setData(old.data);
      }
    } else if (course) {
      fetch(`https://apsva.instructure.com/api/v1/courses/${course}/tabs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }).then((body) => {
        // @ts-expect-error
        setData(body.data);
        window.localStorage.setItem(course, JSON.stringify({data: body.data, time: Date.now().toString()}));
      });
    }
  }, []);

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
    return item.full_url;
  }
}