import { Typography, Avatar, Skeleton, Layout, Menu, Divider, List } from "antd";
import useAPI from "../../../../utils/useAPI";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const { Text, Title } = Typography;
const { Content, Sider } = Layout;
import Center from "../../../../components/Center";
import TopBar from "../../../../components/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faEnvelope,
  faCheck,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

interface Person {
  avatar_url: string;
  bio: string;
  name: string;
}

export default function Person() {
  const { person, course } = useParams();
  const [data, setData] = useState<Person>()
  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/users/${person}?include[]=avatar_url&include[]=bio&include[]=custom_links`,
    (inData) => {
      console.log(inData);
      setData(inData);
    }
  );

  return (
    <Layout className="h-screen">
      <TopBar title="Canvas" />
      <Layout>
        <Sider>
          <Menu mode="inline" style={{ minHeight: "100%" }}>
            <Menu.Item icon={<FontAwesomeIcon icon={faGrip} />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item icon={<FontAwesomeIcon icon={faEnvelope} />}>
              <Link to="/messages">Messages</Link>
            </Menu.Item>
            <Menu.Item icon={<FontAwesomeIcon icon={faCheck} />}>
              <Link to="/">Todo</Link>
            </Menu.Item>
            <Menu.Item icon={<FontAwesomeIcon icon={faGear} />}>
              <Link to="/">Settings</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="p-3 overflow-scroll overflow-x-hidden">
          {data ? (
            <>
              <div className="flex flex-row pl-3">
                <Center height="46.73px">
                  <Avatar size="large" src={data.avatar_url} />
                </Center>
                <Title style={{ margin: 0, paddingLeft: "1rem" }}>{data.name}</Title>
              </div>
              <Divider />
              <p>{data.bio}</p>
            </>
          ) : (
            <Skeleton active />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}