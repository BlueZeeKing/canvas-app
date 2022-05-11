import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { Layout } from "antd";

const { Content } = Layout;

export default function Main(props: { children: any }) {
  return (
    <Layout className="!min-h-screen">
      <TopBar title="Canvas" />
      <Layout className="h-full">
        <Sidebar/>
        <Content className="h-full p-3">{props.children}</Content>
      </Layout>
    </Layout>
  );
}
