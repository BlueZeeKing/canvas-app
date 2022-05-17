import { useEffect, useState } from "react"
import { notification } from "antd";
import { fetch, getClient } from "@tauri-apps/api/http"
import getAPIKey from "./getAPIKey";

const re = new RegExp('<(http.+?)>; rel="next"');

export default function useAPI(url: string, onComplete: (body: any) => void) {
  const [next, setNext] = useState(url)
  const [complete, setComplete] = useState(false)
  useEffect(() => {
    fetchData(next, onComplete, setNext, setComplete);
  }, []);

  return { next: next, setNext: setNext, complete: complete, setComplete: setComplete};
}

export async function fetchData(
  url: string,
  onComplete: (body: any) => void,
  setNext: (a: string) => void,
  setComplete: (a: boolean) => void
) {
  try {
    const body = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getAPIKey()}`,
      },
    });
    if (body.ok) {
      onComplete(body.data);
      const link = parseLinks(body.headers.link);
      if (link) {
        setNext(link);
        setComplete(false);
      } else {
        setComplete(true);
      }
    } else {
      notification.error({
        message: `Error: ${body.status}`,
        // @ts-expect-error
        description: `An error occurred while fetching the data: ${body.data.error}`,
      });
    }
  } catch (err) {
    notification.error({
      message: "An error occurred",
      description: `${err}`,
    });
  }
}

function parseLinks(dataString: string) {
  if (dataString) {
    const data = dataString.split(",");
    for (let i = 0; i < data.length; i++) {
      const match = data[i].match(re);
      if (match != null) {
        return match[1];
      }
    }
  }
}