import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { Layout, Breadcrumb, Affix } from "antd";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Content } = Layout;

interface BreakcrumbItem {
  name: string,
  url: string
}

export default function Main(props: { children: any }) {
  const [state, setState] = useState<BreakcrumbItem[]>([{ name: "Dashboard", url: "/" }])
  useEffect(() => {
    if (window.localStorage.getItem("breadcrumb")) {
      // @ts-expect-error
      setState(JSON.parse(window.localStorage.getItem("breadcrumb")));
    } else {
      window.localStorage.setItem("breadcrumb", JSON.stringify([{ name: "Dashboard", url: "/" }]));
    }
  }, [window.localStorage.getItem("breadcrumb")])
  return (
    <Layout className="h-screen">
      <TopBar title="Canvas" />
      <Layout className="h-full">
        <Sidebar />
        <Content className="h-full p-3 overflow-scroll">
          <Breadcrumb>
            {state.map((item) => <Breadcrumb.Item key={item.name}><Link to={item.url}>{item.name}</Link></Breadcrumb.Item>)}
          </Breadcrumb>
          <div className="mt-3">{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
