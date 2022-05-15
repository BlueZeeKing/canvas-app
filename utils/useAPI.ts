import { useEffect } from "react"
import { notification } from "antd";
import { fetch, getClient } from "@tauri-apps/api/http"
import getAPIKey from "./getAPIKey";

export default function useAPI(url: string, onComplete: (body: any) => void) {
  useEffect(() => {
    const asyncFunction = async () => {
      try {
        const body = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await getAPIKey()}`,
          },
        })
        if (body.ok) {
          onComplete(body.data);
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

    asyncFunction();
  }, []);
}