import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { Layout, Breadcrumb, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const { Content } = Layout;

interface BreadcrumbItem {
  name: string,
  url: string
}

export default function Main(props: { children: any, length: number, handleNext: () => void, complete: boolean }) {
  const [state, setState] = useState<BreadcrumbItem[]>([{ name: "Dashboard", url: "/" }])
  useEffect(() => {
    if (window.localStorage.getItem("breadcrumb")) {
      // @ts-expect-error
      setState(JSON.parse(window.localStorage.getItem("breadcrumb")));
    } else {
      window.localStorage.setItem("breadcrumb", JSON.stringify([{ name: "Dashboard", url: "/" }]));
    }
  }, [window.localStorage.getItem("breadcrumb")])

  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef.current && outerRef.current && !props.complete && innerRef.current.clientHeight < outerRef.current.clientHeight) {
      props.handleNext();
    }
  })

  return (
    <Layout className="h-screen">
      <TopBar title="Canvas" />
      <Layout className="h-full">
        <Sidebar />
        <Content className="h-full p-3 overflow-y-scroll" id="scroll" ref={outerRef}>
          <Breadcrumb>
            {state.map((item) => (
              <Breadcrumb.Item key={item.name}>
                <Link to={item.url}>{item.name}</Link>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <InfiniteScroll
            dataLength={props.length}
            next={props.handleNext}
            loader={
              <div className="w-full p-3 flex flex-row place-content-center">
                <Spin />
              </div>
            }
            hasMore={!props.complete}
            scrollableTarget="scroll"
            className="mt-3"
          >
            <div ref={innerRef}>{props.children}</div>
          </InfiniteScroll>
        </Content>
      </Layout>
    </Layout>
  );
}
