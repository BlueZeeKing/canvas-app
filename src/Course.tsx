import { Layout, Breadcrumb } from "antd";
import { ReactElement, ReactNode, useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Link from "../components/Link";
import Wiki from "./routes/course/wiki";

const { Content } = Layout;

interface BreadcrumbItem {
  name: string;
  func: () => any
}

export default function Course(props: {course: number, courseName: string, setCourse: (a: number | undefined) => void}) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { name: "Dashboard", func: () => props.setCourse(undefined) }
  ]);

  const [child, setChild] = useState<ReactNode>(<Wiki />)

  return (
    <Layout className="h-full">
      <Sidebar />
      <Content className="h-full p-3 overflow-y-scroll">
        <Breadcrumb>
          {breadcrumb.map((item) => (
            <Breadcrumb.Item
              key={item.name}
              onClick={item.func}
            >
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div className="mt-3">{child}</div>
      </Content>
    </Layout>
  );
}
