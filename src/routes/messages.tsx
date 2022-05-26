import { useState } from "react";
import { Typography, Avatar, Layout, Menu, Comment, List, Button, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faEnvelope,
  faCheck,
  faGear,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

import TopBar from "../../components/TopBar";
import useAPI, {fetchData} from "../../utils/useInfiniteAPI";
import InfiniteScroll from "react-infinite-scroll-component";

const { Text } = Typography

interface Item {
  subject: string;
  last_message_at: string;
  id: number;
  participants: Participant[];
}

interface Participant {
  name: string;
  avatar_url: string;
  pronouns: string;
}

const { Content, Sider } = Layout;

function App() {
  const [data, setData] = useState<Array<Item>>([]);
  const navigate = useNavigate();

  function handleAPI(inData: Item[]) {
    setData(data.concat(inData));
  }

  const { next, setNext, complete, setComplete } = useAPI(
    "https://apsva.instructure.com/api/v1/conversations?per_page=15&include[]=participant_avatars",
    handleAPI
  );


  return (
    <Layout className="h-screen">
      <TopBar title="Burlap" />
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
        <Content className="p-3 overflow-scroll overflow-x-hidden" id="scroll">
          <div className="fixed bottom-0 right-0 m-4 z-50">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={
                <FontAwesomeIcon
                  size="7x"
                  className="pr-1 pt-1"
                  icon={faPaperPlane}
                />
              }
            />
          </div>
          <InfiniteScroll
            dataLength={data.length}
            next={() => fetchData(next, handleAPI, setNext, setComplete)}
            loader={
              <div className="w-full p-3 flex flex-row place-content-center">
                <Spin />
              </div>
            }
            hasMore={!complete}
            scrollableTarget="scroll"
          >
            <List
              loading={data == null}
              dataSource={data}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Link to={`/messages/${item.id}`}>
                    <Comment
                      author={
                        <Text>
                          {item.participants[0].name}{" "}
                          {item.participants[0].pronouns == null ? (
                            ""
                          ) : (
                            <span style={{ color: "gray" }}>
                              ({item.participants[0].pronouns})
                            </span>
                          )}
                        </Text>
                      }
                      content={<Text>{item.subject}</Text>}
                      avatar={
                        <Avatar
                          src={item.participants[0].avatar_url}
                          alt={item.participants[0].name}
                        />
                      }
                      datetime={
                        <Text style={{ color: "gray" }}>
                          {new Date(
                            Date.parse(item.last_message_at)
                          ).toLocaleString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </Text>
                      }
                    />
                  </Link>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;