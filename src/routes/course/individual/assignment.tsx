import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetch } from "@tauri-apps/api/http";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import process from "../../../../utils/htmlProcessor";
import { Skeleton, Menu, Divider, Empty, Typography, Steps } from "antd";
import setItem from "../../../../utils/breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCloudArrowUp, faPaperPlane, faComment } from "@fortawesome/free-solid-svg-icons";

const { Text, Title } = Typography
const { Step } = Steps;

interface Assignment {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  id: number;
  created_at: string;
  name: string;
  description: string;
  due_at: string;
  submission: {
    workflow_state: string
  }
}

export default function Assignment() {
  const { course, assignment } = useParams();
  const [data, setData] = useState<Assignment>();

  useEffect(() => {
    setItem(3, "Assignment", `/${course}/assignment/${assignment}`);
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}?include=submission`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data);
      // @ts-expect-error
      setItem(3, body.data.name, `/${course}/assignment/${assignment}`);
      console.log(body);
    });
  }, []);

  return (
    <Main>
      {data ? (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", verticalAlign: "middle" }}>
            <Title style={{ margin: 0 }}>{data.name}</Title>
            <div style={{ flexGrow: 1 }}></div>
            <Center height="46.73px">
              <Text style={{ marginRight: "10px" }}>
                <span style={{ color: "gray" }}>Due on:</span>&nbsp;
                {new Date(Date.parse(data.due_at)).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </Text>
            </Center>
          </div>
          <Text style={{ color: "gray" }}>
            {new Date(Date.parse(data.created_at)).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
          <Divider />
          <Steps current={["unsubmitted", "uploaded", "submitted", "graded"].indexOf(data.submission.workflow_state)-1}>
            <Step title="Uploaded" icon={<FontAwesomeIcon icon={faCloudArrowUp} />} />
            <Step title="Submitted" icon={<FontAwesomeIcon icon={faPaperPlane} />} />
            <Step title="Graded" icon={<FontAwesomeIcon icon={faComment} />} />
          </Steps>
          <Divider />
          {data.description != "" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: process(data.description),
              }}
            ></div>
          ) : (
            <Empty />
          )}
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
