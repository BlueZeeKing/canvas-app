import { useState, useEffect } from 'react'
import { fetch } from '@tauri-apps/api/http';
import { Typography, Card, Skeleton, Layout, Button } from "antd";
import { Link } from "react-router-dom";

import TopBar from "../components/TopBar";

interface Item {
  name: string
  is_favorite: boolean
  course_code: string
  id: number
}

const { Content } = Layout;

function App() {
  const [data, setData] = useState<Array<Item>>()

  useEffect(() => {
    fetch(
      "https://apsva.instructure.com/api/v1/courses?per_page=50&enrollment_state=active&state=available&include=favorites",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data);
    });
  }, [])

  return (
    <Layout>
      <TopBar title="Canvas" />
      <Content className="flex flex-row flex-wrap p-1 !min-h-screen">
        {data ? (
          data
            .filter((a) => a.is_favorite)
            .map((item: Item) => (
              <Link to={`/${item.id}/wiki`} key={item.id}>
                <Card title={item.name} className="w-72 h-40 !m-3">
                  <p>{item.course_code}</p>
                </Card>
              </Link>
            ))
        ) : (
          <Skeleton />
        )}
      </Content>
    </Layout>
  );
}

export default App
