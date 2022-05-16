import { useState } from "react";
import TopBar from "../components/TopBar";
import Courses from "./routes/courses"
import Course from "./Course"

export default function App() {
  const [title, setTitle] = useState("Canvas")
  const [course, setCourse] = useState<number>();
  return (
    <>
      <TopBar title={title} />
      {course == null ? <Courses /> : <Course course={course} />}
    </>
  );
}