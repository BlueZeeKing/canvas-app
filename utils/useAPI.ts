import { useEffect } from "react"
import { notification } from "antd";
import { fetch, getClient } from "@tauri-apps/api/http"
import getAPIKey from "./getAPIKey";

const re = new RegExp('<(http.+?)>; rel="next"');

export default function useAPI(url: string, onComplete: (body: any) => void, fetchNext?: boolean) {
  useEffect(() => {
    fetchData(url, onComplete, typeof fetchNext !== "undefined" ? fetchNext : false);
  }, []);
}

async function fetchData(url: string, onComplete: (body: any) => void, fetchNext: boolean)  {
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
      if (link && fetchNext) {
        fetchData(link, onComplete, fetchNext);
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