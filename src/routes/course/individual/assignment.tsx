import { useParams } from "react-router";
import { useState, useEffect } from "react";

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import HTML from "../../../../components/HTML";
import { Skeleton, Alert, Divider, Empty, Typography, Steps, Button, Tabs} from "antd";
import setItem from "../../../../utils/breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCloudArrowUp, faPaperPlane, faComment } from "@fortawesome/free-solid-svg-icons";
import useAPI from "../../../../utils/useAPI";
import SubmitArea from "../../../../components/SubmitArea";

const { Text, Title } = Typography
const { Step } = Steps;
const { TabPane } = Tabs;

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
  submission_types: string[]
}

export default function Assignment() {
  const { course, assignment } = useParams();
  const [data, setData] = useState<Assignment>();
  const [current, setCurrent] = useState(-1)

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/assignments/${assignment}?include=submission`,
    (body) => {
      setData(body);
      setItem(3, body.name, `/${course}/assignment/${assignment}`);
      setCurrent(
        ["unsubmitted", "uploaded", "submitted", "graded"].indexOf(
          body.submission.workflow_state
        ) - 1
      );
    }
  )

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
          <Steps
            current={current}
            className="!mt-3"
          >
            <Step
              title="Uploaded"
              icon={<FontAwesomeIcon icon={faCloudArrowUp} />}
            />
            <Step
              title="Submitted"
              icon={<FontAwesomeIcon icon={faPaperPlane} />}
            />
            <Step title="Graded" icon={<FontAwesomeIcon icon={faComment} />} />
          </Steps>
          {data.description != "" ? (
            <>
              <Divider orientation="left">Description</Divider>
              <HTML html={data.description} />
            </>
          ) : (
            ""
          )}
          <Divider orientation="left">Submit</Divider>
          <Alert showIcon type="warning" closable message="Submissions are not yet fully stable, proceed with caution"/>
          <SubmitArea setCurrent={setCurrent} type={data.submission_types} />
        </div>
      ) : (
        <Skeleton active />
      )}
    </Main>
  );
}