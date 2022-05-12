import { useEffect } from "react"
import { notification } from "antd";
import { fetch, getClient } from "@tauri-apps/api/http"

export default function useAPI(url: string, onComplete: (body: any) => void) {
  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    }).then((body) => {
      if (body.ok) {
        onComplete(body.data);
      } else {
        notification.error({
          message: `Error: ${body.status}`,
          // @ts-expect-error
          description: `An error occurred while fetching the data: ${body.data.error}`,
        });
      }
    }).catch((err) => {
      notification.error({
        message: "An error occurred",
        description: `${err}`,
      });
    });
  }, []);
}