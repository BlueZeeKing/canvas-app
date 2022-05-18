import { useState, useEffect } from 'react'
import { Input, Card, Spin, Layout, Modal, Popconfirm, notification, Menu, List } from "antd";
import { useNavigate, Link } from "react-router-dom";

import TopBar from "../../components/TopBar";
import setIndex from "../../utils/breadcrumb";
import getAPIKey from "../../utils/getAPIKey";
import { fetch } from "@tauri-apps/api/http"

import { createDir, writeFile } from "@tauri-apps/api/fs";
import { appDir, join } from "@tauri-apps/api/path";

import { fetchData } from '../../utils/useInfiniteAPI';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faEnvelope,
  faCheck,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

interface Item {
  name: string;
  is_favorite: boolean;
  course_code: string;
  id: number;
  default_view: string;
  public_description: string;
}

const { Content, Sider } = Layout;

function App() {
  const [data, setData] = useState<Array<Item>>([])
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiKeyInput, setKey] = useState("")

  const [next, setNext] = useState("https://apsva.instructure.com/api/v1/courses?enrollment_state=active&state=available&include[]=public_description&include[]=favorites");
  const [complete, setComplete] = useState(false);

  function handleAPI(inData: Item[]) {
    setData(data.concat(inData));
  }

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        await createDir(await appDir(), {recursive: true});
        await getAPIKey()

        fetchData(next, handleAPI, setNext, setComplete);
      } catch (err) {
        setIsModalVisible(true)
      }
    };

    asyncFunction();
  }, []);

  useEffect(() => {
    if (!complete) {
      fetchData(next, handleAPI, setNext, setComplete);
    }
  }, [next])

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
        <Content
          className="flex flex-row flex-wrap p-3 overflow-scroll overflow-x-hidden"
          id="scroll"
        >
          {data ? (
            <List
              className="w-full overflow-x-hidden"
              dataSource={data.filter(item => item.is_favorite)}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 5,
                xxl: 3,
              }}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    onClick={() => {
                      if (item.default_view == "wiki") {
                        setIndex(1, item.name, `/${item.id}/wiki`);
                        navigate(`/${item.id}/wiki`);
                      } else if (item.default_view == "modules") {
                        setIndex(1, item.name, `/${item.id}/modules`);
                        navigate(`/${item.id}/modules`);
                      } else if (item.default_view == "assignments") {
                        setIndex(1, item.name, `/${item.id}/assignments`);
                        navigate(`/${item.id}/assignments`);
                      }
                    }}
                    key={item.id}
                    title={item.name}
                    className="h-40 cursor-pointer"
                  >
                    <p>
                      {!item.public_description ||
                      item.public_description == ""
                        ? item.course_code
                        : item.public_description}
                    </p>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <div className="p-3 w-full flex flex-row place-content-center">
              <Spin size="large" />
            </div>
          )}
          <Modal
            title="Enter API Key"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            okText={
              <Popconfirm
                title="Are you absolutely sure you want to proceed?"
                okText="Yes"
                cancelText="No"
                onConfirm={async () => {
                  writeFile({
                    path: await join(await appDir(), "apikey.txt"),
                    contents: apiKeyInput,
                  });
                  setIsModalVisible(false);
                  try {
                    const body = await fetch(
                      "https://apsva.instructure.com/api/v1/courses?per_page=50&enrollment_state=active&state=available&include[]=public_description&include[]=favorites",
                      {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${await getAPIKey()}`,
                        },
                      }
                    );
                    if (body.ok) {
                      // @ts-expect-error
                      setData(body.data);
                    } else {
                      notification.error({
                        message: `Error: ${body.status}`,
                        // @ts-expect-error
                        description: `An error occurred while fetching the data: ${body.data.error}`,
                      });
                    }
                  } catch (err) {
                    notification.error({
                      message: "An error occurred",
                      description: `${err}`,
                    });
                  }
                }}
                onCancel={() => setIsModalVisible(false)}
              >
                OK
              </Popconfirm>
            }
          >
            <p>
              In order to continue to use this application an API key is needed.
              Please continue with caution as this app is still in development.
              Enter the APi key in the input below only if you are absolutely
              sure you are willing to use this development version.
            </p>
            <Input
              value={apiKeyInput}
              onChange={(e) => setKey(e.target.value)}
              placeholder="API Key"
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App

const re = new RegExp('<(http.+?)>; rel="next"');

function parseLinks(dataString: string) {
  if (dataString) {
    const data = dataString.split(",");
    for (let i = 0; i < data.length; i++) {
      const match = data[i].match(re);
      if (match != null) {
        return match[1];
      }
    }
  }
}