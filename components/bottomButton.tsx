import { Button } from "antd"
import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom"
import useAPI from "../utils/useAPI";

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
      console.log(body.items)
    }
  );

  console.log(`https://apsva.instructure.com/api/v1/courses/${course}/module_item_sequence?asset_type=ModuleItem&asset_id=${searchParams.get("id")}`);

  if (searchParams.get("id") && body && body.items.length > 0) {
    return (
      <div className="flex flex-row m-3">
        <Button>
          <a href={parseType(body.items[0].prev, course != null ? course : "")}>
            Previous
          </a>
        </Button>
        <div className="flex-grow"></div>
        <Button>
          <a href={parseType(body.items[0].next, course != null ? course : "")}>
            Next
          </a>
        </Button>
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
  }
  return item.url;
}