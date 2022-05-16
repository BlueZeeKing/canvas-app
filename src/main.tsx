import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from "./routes/App";

import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

const Messages = React.lazy(() => import("./routes/messages"));
const Message = React.lazy(() => import("./routes/message"));
const Wiki = React.lazy(() => import("./routes/course/wiki"));
const Modules = React.lazy(() => import("./routes/course/modules"));
const Assignments = React.lazy(() => import("./routes/course/assignments"));
const Discussions = React.lazy(() => import('./routes/course/discussions'));
const Announcements = React.lazy(() => import('./routes/course/announcements'));
const Announcement = React.lazy(() => import("./routes/course/individual/announcement"));
const Assignment = React.lazy(() => import("./routes/course/individual/assignment"));
const Discussion = React.lazy(() => import("./routes/course/individual/discussion"));
const Page = React.lazy(() => import("./routes/course/individual/page"));
const File = React.lazy(() => import("./routes/course/individual/file"));

import TopBar from "../components/TopBar";

import { Layout, Spin, Result, Button } from "antd";

const { Content } = Layout;

async function asyncImports() {
  await import("antd/dist/antd.dark.min.css");
}

asyncImports();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/messages" element={<Suspense fallback={<Spin />} ><Messages /></Suspense>} />
          <Route path="/messages/:message" element={<Suspense fallback={<Spin />} ><Message /></Suspense>} />

          <Route path="/:course/wiki" element={<Suspense fallback={<Spin />} ><Wiki /></Suspense>} />
          <Route path="/:course/modules" element={<Suspense fallback={<Spin />} ><Modules /></Suspense>} />
          <Route path="/:course/modules/:module" element={<Suspense fallback={<Spin />} ><Modules /></Suspense>} />
          <Route path="/:course/assignments" element={<Suspense fallback={<Spin />} ><Assignments /></Suspense>} />
          <Route path="/:course/discussions" element={<Suspense fallback={<Spin />} ><Discussions /></Suspense>} />
          <Route path="/:course/announcements" element={<Suspense fallback={<Spin />} ><Announcements /></Suspense>} />

          <Route path="/:course/announcement/:announcement" element={<Suspense fallback={<Spin />} ><Announcement /></Suspense>} />
          <Route path="/:course/assignment/:assignment" element={<Suspense fallback={<Spin />} ><Assignment /></Suspense>} />
          <Route path="/:course/discussion/:discussion" element={<Suspense fallback={<Spin />} ><Discussion /></Suspense>} />
          <Route path="/:course/page/:page" element={<Suspense fallback={<Spin />} ><Page /></Suspense>} />
          <Route path="/:course/file/:file" element={<Suspense fallback={<Spin />} ><File /></Suspense>} />

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

function Error() {
  const navigate = useNavigate()
  return (
    <Layout>
      <TopBar title="Canvas" />
      <Content className="p-3 !min-h-screen overflow-x-hidden">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Back Home
            </Button>
          }
        />
      </Content>
    </Layout>
  );
}