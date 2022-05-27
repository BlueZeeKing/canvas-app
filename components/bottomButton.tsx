import { Button } from "antd"
import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom"
import useAPI from "../utils/useAPI";
import { open } from "@tauri-apps/api/shell";

interface Items {
  items: {
    prev: Item;
    next: Item
  }[]
}

interface Item {
  url: string;
  type: string;
  id: string;
  content_id: string;
  page_url: string;
  external_url: string;
}

export default function BottomButtons() {
  const { course } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [body, setBody] = useState<Items>()

  useAPI(
    `https://apsva.instructure.com/api/v1/courses/${course}/module_item_sequence?asset_type=ModuleItem&asset_id=${searchParams.get("id")}`,
    (body) => {
      setBody(body)
    }
  );

  if (searchParams.get("id") && body && body.items.length > 0) {
    return (
      <div className="flex flex-row m-3">
        {
          body.items[0].prev ?
          <Button
            onClick={() =>
              body.items[0].prev.type == "ExternalUrl"
                ? open(body.items[0].prev.external_url)
                : ""
            }
          >
            <a href={parseType(body.items[0].prev, course != null ? course : "")}>
              Previous
            </a>
          </Button> : ""
        }
        <div className="flex-grow"></div>
        {
          body.items[0].next ?
          <Button
            onClick={() =>
              body.items[0].next.type == "ExternalUrl"
                ? open(body.items[0].next.external_url)
                : ""
            }
          >
            <a
              href={parseType(body.items[0].next, course != null ? course : "")}
            >
              Next
            </a>
          </Button> : ""
        }
      </div>
    );
  } else {
    return <div></div>;
  }
}

function parseType(item: Item, course: string) {
  if (item.type == "File") {
    return `/${course}/file/${item.content_id}?id=${item.id}`;
  } else if (item.type == "Assignment") {
    return `/${course}/assignment/${item.content_id}?id=${item.id}`;
  } else if (item.type == "Page") {
    return `/${course}/page/${item.page_url}?id=${item.id}`;
  } else if (item.type == "ExternalUrl") {
    return "javascript: void(0);";
  } else if (item.type == "Discussion") {
    return `/${course}/discussion/${item.content_id}?id=${item.id}`;
  }
  console.log(item.type)
  return "javascript: void(0);";
}