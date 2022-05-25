import { useState, useEffect } from "react";
import { Typography, Avatar, Skeleton, Layout, Menu, Divider, List } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import Center from "../../components/Center";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faEnvelope,
  faCheck,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import TopBar from "../../components/TopBar";
import useAPI from "../../utils/useAPI";

const { Text, Title } = Typography

interface Item {
  subject: string;
  last_message_at: string;
  id: string;
  participants: Participant[];
  last_message: string;
  messages: Message[]
}

interface Message { 
  author_id: string;
  body: string;
  created_at: string
}

interface Participant {
  name: string;
  avatar_url: string;
  pronouns: string;
  id: string
}

const { Content, Sider } = Layout;

function App() {
  const [data, setData] = useState<Item>();
  const { message } = useParams();

  useAPI(
    `https://apsva.instructure.com/api/v1/conversations/${message}?include[]=participant_avatars`,
    (inData) => {
      setData(inData);
    }
  );

  const author: Participant = data ? data.participants.filter((item) => item.id == data.messages[0].author_id)[0] : {name: "Unknown", avatar_url: "", pronouns: "", id: ""};

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
            <div>
              <div style={{ display: "flex", verticalAlign: "middle" }}>
                <Title style={{ margin: 0 }}>{data.subject}</Title>
                <div style={{ flexGrow: 1 }}></div>
                <Center height="46.73px">
                  <Text style={{ marginRight: "10px" }}>{author.name}</Text>
                </Center>
                <Center height="46.73px">
                  <Avatar src={author.avatar_url} />
                </Center>
              </div>
              <Text style={{ color: "gray" }}>
                {new Date(Date.parse(data.last_message_at)).toLocaleString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
              </Text>
              <Divider />
              <Text className="whitespace-pre">{data.messages[0].body}</Text>
              {data.messages.slice(1).map((item) => {
                const participant = data.participants.filter(
                  (participant) => participant.id == item.author_id
                )[0];
                return (
                  <>
                    <Divider>
                      {new Date(Date.parse(item.created_at)).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </Divider>
                    <div>
                      <Avatar src={participant.avatar_url} />
                      <Text>{participant.name}</Text>
                    </div>
                    <br></br>
                    <Text className="whitespace-pre mt-10">{item.body}</Text>
                  </>
                );
              })}
            </div>
          ) : (
            <Skeleton active />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;