import { Typography, Avatar, Divider } from "antd";
import Center from "./Center"
import { Link, useParams } from "react-router-dom";
import { ReactNode } from "react";

const { Title, Text } = Typography;

export default function ItemHeader(props: {
  title: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  date: string;
  children?: ReactNode;
}) {
  const { course } = useParams();
  return (
    <>
      <div className="flex">
        <Title style={{ margin: 0 }}>{props.title}</Title>
        <div className="flex-grow"></div>
        <Link className="flex flex-row" to={`/${course}/person/${props.authorId}`}>
          <Center height="46.73px">
            <Text style={{ marginRight: "10px" }}>{props.authorName}</Text>
          </Center>
          <Center height="46.73px">
            <Avatar src={props.authorImage} />
          </Center>
        </Link>
      </div>
      <Text style={{ color: "gray" }}>
        {new Date(Date.parse(props.date)).toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </Text>
      <Divider />
      {props.children ? <div>{props.children}<Divider /></div> : "" }
    </>
  );
}