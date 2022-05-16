import { useState, useEffect } from 'react'
import { Input, Card, Skeleton, Layout, Modal, Popconfirm, notification } from "antd";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/TopBar";
import setIndex from "../../utils/breadcrumb";
import getAPIKey from "../../utils/getAPIKey";
import { fetch } from "@tauri-apps/api/http"

import { createDir, writeFile } from "@tauri-apps/api/fs";
import { appDir, join } from "@tauri-apps/api/path";

interface Item {
  name: string;
  is_favorite: boolean;
  course_code: string;
  id: number;
  default_view: string;
  public_description: string;
}

const { Content } = Layout;

function Courses() {
  const [data, setData] = useState<Array<Item>>()
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiKeyInput, setKey] = useState("")

  useEffect(() => {
    const asyncFunction = async () => {
      let apiKey = ""
      try {
        await createDir(await appDir(), {recursive: true});
        apiKey = await getAPIKey()
        try {
          const body = await fetch(
            "https://apsva.instructure.com/api/v1/courses?per_page=50&enrollment_state=active&state=available&include[]=public_description&include[]=favorites",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${await apiKey}`,
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
      } catch (err) {
        console.log(err);
        setIsModalVisible(true)
      }
    };

    asyncFunction();
  }, []);

  return (
    <Layout className="h-screen">
      <TopBar title="Canvas" />
      <Content className="flex flex-row flex-wrap p-3 overflow-scroll overflow-x-hidden">
        {data ? (
          data
            .filter((a) => a.is_favorite)
            .map((item: Item) => (
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
                className="w-72 h-40 !m-3 cursor-pointer"
              >
                <p>
                  {!item.public_description || item.public_description == ""
                    ? item.course_code
                    : item.public_description}
                </p>
              </Card>
            ))
        ) : (
          <Skeleton style={{ width: "100%" }} />
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
                  contents: apiKeyInput
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
            Enter the APi key in the input below only if you are absolutely sure
            you are willing to use this development version.
          </p>
          <Input
            value={apiKeyInput}
            onChange={(e) => setKey(e.target.value)}
            placeholder="API Key"
          />
        </Modal>
      </Content>
    </Layout>
  );
}

export default Courses;
