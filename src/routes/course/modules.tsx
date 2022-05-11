import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { fetch } from "@tauri-apps/api/http";
import {
  faPenRuler,
  faFile,
  faLink,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

import Main from "../../../components/Main";
import { Skeleton, Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

interface Item {
  content_id: number,
  title: string,
  type: string,
  id: number,
  indent: number,
  external_url: string,
  page_url: string
}

interface Module {
  id: number,
  name: string,
  items: Item[]
}

export default function Modules() {
  const { course, module } = useParams();
  const [data, setData] = useState<Module[]>();


  useEffect(() => {
    fetch(
      `https://apsva.instructure.com/api/v1/courses/${course}/modules?include=items&per_page=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      }
    ).then((body) => {
      // @ts-expect-error
      setData(body.data);
      console.log(body.data)
    });
  }, []);

  console.log([module ? module : ""]);

  return (
    <Main>
      {data ? (
        <Menu mode="inline" defaultOpenKeys={[module ? module : ""]}>
          {data.map((module: Module) => (
            <SubMenu key={module.id} title={module.name}>
              {module.items.map((item: Item) => {
                if (item.type == "SubHeader") {
                  return <Menu.ItemGroup key={item.id} title={item.title} />;
                } else if (item.type == "Assignment") {
                  return (
                    <Item
                      icon={faPenRuler}
                      name={item.title}
                      indent={item.indent}
                      url={`/${course}/assignment/${item.content_id}`}
                      id={item.id}
                      key={item.id}
                    />
                  );
                } else if (item.type == "File") {
                  return (
                    <Item
                      icon={faFile}
                      name={item.title}
                      indent={item.indent}
                      url={`/${course}/file/${item.content_id}`}
                      id={item.id}
                      key={item.id}
                    />
                  );
                } else if (item.type == "ExternalUrl") {
                  return (
                    <Menu.Item
                      key={item.id}
                      style={{ paddingLeft: `${24 * item.indent + 48}px` }}
                    >
                      <a href={item.external_url} target="_blank">
                        <div>
                          <FontAwesomeIcon
                            icon={faLink}
                            color="white"
                            style={{ paddingRight: "8px" }}
                          />
                          {item.title}
                        </div>
                      </a>
                    </Menu.Item>
                  );
                } else if (item.type == "Page") {
                  return (
                    <Item
                      icon={faNewspaper}
                      name={item.title}
                      indent={item.indent}
                      url={`/${course}/page/${item.page_url}`}
                      id={item.id}
                      key={item.id}
                    />
                  );
                } else {
                  return (
                    <Menu.Item
                      key={item.id}
                      style={{ paddingLeft: `${24 * item.indent + 48}px` }}
                    >
                      <Link to="/">{item.title}</Link>
                    </Menu.Item>
                  );
                }
              })}
            </SubMenu>
          ))}
        </Menu>
      ) : (
        <Skeleton />
      )}
    </Main>
  );
}

function Item(props: {icon: any, name: string, indent: number, url: string, id: number}) {
  return (
    <Menu.Item
      key={props.id}
      style={{ paddingLeft: `${24 * props.indent + 48}px` }}
    >
      <Link to={props.url}>
        <div>
          <FontAwesomeIcon
            icon={props.icon}
            color="white"
            style={{ paddingRight: "8px" }}
          />
          {props.name}
        </div>
      </Link>
    </Menu.Item>
  );
}