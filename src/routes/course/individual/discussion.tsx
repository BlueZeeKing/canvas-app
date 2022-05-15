import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Body, fetch } from "@tauri-apps/api/http"

import Main from "../../../../components/Main";
import Center from "../../../../components/Center";
import process from "../../../../utils/htmlProcessor";
import { Skeleton, Avatar, Divider, Tooltip, Typography, Comment } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import setItem from "../../../../utils/breadcrumb";
import useAPI from "../../../../utils/useAPI";
import getAPIKey from "../../../../utils/getAPIKey";

const { Text, Title } = Typography

interface Participant {
  display_name: string;
  avatar_image_url: string;
  pronouns: string;
}

interface Discussion {
  author: {
    display_name: string;
    avatar_image_url: string;
  };
  id: number;
  posted_at: string;
  title: string;
  message: string;
  due_at: string;
  allow_rating: boolean;
}

interface Entry {
  author: Participant
  rating: number
  text: string
  date: string
  id: number
  my_rating: number
}

export default function Discussion() {
  const { course, discussion } = useParams();
  const [data, setData] = useState<Discussion>();
  const [entries, setEntries] = useState<Entry[]>([]);

  setItem(3, "Discussion", `/${course}/discussion/${discussion}`);

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics/${discussion}`,
    (body) => {
      setData(body);
      setItem(3, body.title, `/${course}/discussion/${discussion}`);
    }
  );

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics/${discussion}/view`,
    (body) => {
      setEntries(
        body.view.map((item: any) => {
          return {
            author: body.participants.find(
              (person: any) => person.id == item.user_id
            ),
            rating: item.rating_sum,
            text: item.message,
            date: item.updated_at,
            id: item.id,
            my_rating: body.entry_ratings[item.id],
          };
        })
      );
    }
  );

  async function setLikes(item: any, index: number) {
    let copy = JSON.parse(JSON.stringify(entries));
    let entry = copy[index];
    if (entries[index].my_rating == 1) {
      entry.rating--;
      entry.my_rating--;
    } else {
      entry.rating++;
      entry.my_rating++;
    }

    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/discussion_topics/${discussion}/entries/${item.id}/rating`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getAPIKey()}`,
        },
        body: Body.form({ rating: entry.my_rating.toString() }),
      }
    )

    setEntries(copy)
  }

  return (
    <Main>
      {data ? (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", verticalAlign: "middle" }}>
            <Title style={{ margin: 0 }}>{data.title}</Title>
            <div style={{ flexGrow: 1 }}></div>
            <Center height="46.73px">
              <Text style={{ marginRight: "10px" }}>
                {data.author.display_name}
              </Text>
            </Center>
            <Center height="46.73px">
              <Avatar src={data.author.avatar_image_url} />
            </Center>
          </div>
          <Text style={{ color: "gray" }}>
            {new Date(Date.parse(data.posted_at)).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
          <Divider />
          <div
            dangerouslySetInnerHTML={{
              __html: process(data.message),
            }}
          ></div>
          <Divider />
          {
            entries.map((item, index) => (
              <Comment
                key={item.id}
                author={
                  <Text>
                    {item.author.display_name}{" "}
                    {item.author.pronouns == null ? (
                      ""
                    ) : (
                      <span style={{ color: "gray" }}>
                        ({item.author.pronouns})
                      </span>
                    )}
                  </Text>
                }
                avatar={
                  <Avatar src={item.author.avatar_image_url} alt="Profile picture" />
                }
                content={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: process(item.text),
                    }}
                  ></div>
                }
                datetime={
                  <Text style={{ color: "gray" }}>
                    {new Date(Date.parse(item.date)).toLocaleString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </Text>
                }
                actions={
                  data.allow_rating
                    ? [
                        <Tooltip key="comment-like" title="Like">
                          <span onClick={() => setLikes(item, index)}>
                            {item.my_rating == 1 ? (
                              <LikeFilled />
                            ) : (
                              <LikeOutlined />
                            )}
                            &nbsp;
                            <span className="comment-action">
                              {item.rating}
                            </span>
                          </span>
                        </Tooltip>,
                      ]
                    : []
                }
              />
            ))
          }
        </div>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}
