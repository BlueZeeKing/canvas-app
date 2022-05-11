import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import "antd/dist/antd.dark.min.css";
import App from "./App";

import Wiki from "./routes/course/wiki";
import Modules from "./routes/course/modules";
import Assignments from "./routes/course/assignments";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Discussions from './routes/course/discussions';
import Announcements from './routes/course/announcements';
import Announcement from "./routes/course/individual/announcement";
import Assignment from "./routes/course/individual/assignment";
import Discussion from "./routes/course/individual/discussion";
import Page from "./routes/course/individual/page";
import File from "./routes/course/individual/file";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/:course/wiki" element={<Wiki />} />
          <Route path="/:course/modules" element={<Modules />} />
          <Route path="/:course/modules/:module" element={<Modules />} />
          <Route path="/:course/assignments" element={<Assignments />} />
          <Route path="/:course/discussions" element={<Discussions />} />
          <Route path="/:course/announcements" element={<Announcements />} />

          <Route path="/:course/announcement/:announcement" element={<Announcement />} />
          <Route path="/:course/assignment/:assignment" element={<Assignment />} />
          <Route path="/:course/discussion/:discussion" element={<Discussion />} />
          <Route path="/:course/page/:page" element={<Page />} />
          <Route path="/:course/file/:file" element={<File />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);