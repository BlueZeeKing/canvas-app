import { useState, useEffect } from 'react'
import { Typography, Card, Skeleton, Layout, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar";
import setIndex from "../utils/breadcrumb";
import useAPI from "../utils/useAPI";

interface Item {
  name: string;
  is_favorite: boolean;
  course_code: string;
  id: number;
  default_view: string;
  public_description: string;
}

const { Content } = Layout;

function App() {
  const [data, setData] = useState<Array<Item>>()
  const navigate = useNavigate();

  useAPI(
    "https://apsva.instructure.com/api/v1/courses?per_page=50&enrollment_state=active&state=available&include[]=public_description&include[]=favorites",
    (data) => setData(data)
  );

  return (
    <Layout className="h-screen">
      <TopBar title="Canvas" />
      <Content className="flex flex-row flex-wrap p-3 overflow-scroll overflow-x-hidden">
        {data ? (
          data
            .filter((a) => a.is_favorite)
            .map((item: Item) => (
              <Card onClick={() => {
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
              }} key={item.id} title={item.name} className="w-72 h-40 !m-3 cursor-pointer">
                <p>{!item.public_description || item.public_description == "" ? item.course_code : item.public_description}</p>
              </Card>
            ))
        ) : (
          <Skeleton style={{width: "100%"}} />
        )}
      </Content>
    </Layout>
  );
}

export default App
