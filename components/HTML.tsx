import { useEffect, useRef } from "react"
import { open } from "@tauri-apps/api/shell"
import DOMPurify from "isomorphic-dompurify";

const modules = new RegExp("https://apsva.instructure.com/courses/(\\d*)/modules/(\\d*)")
const files = new RegExp("https://apsva.instructure.com/courses/(\\d*)/files/(\\d*)")
const pages = new RegExp("https://apsva.instructure.com/courses/(\\d*)/pages/(.*)")
const assignments = new RegExp("https://apsva.instructure.com/courses/(\\d*)/assignments/(.*)")
const local = new RegExp("http://localhost.*")

export default function HTML(props: {html: string}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelectorAll("a").forEach((item) => {
        item.target = "_self"
        if (modules.test(item.href)) {
          const data = item.href.match(modules);
          // @ts-expect-error
          item.href = `/${data[1]}/modules/${data[2]}`;
        } else if (pages.test(item.href)) {
          const data = item.href.match(pages);
          // @ts-expect-error
          item.href = `/${data[1]}/page/${data[2]}`;
        } else if (files.test(item.href)) {
          const data = item.href.match(files);
          // @ts-expect-error
          item.href = `/${data[1]}/file/${data[2]}`;
        } else if (assignments.test(item.href)) {
          const data = item.href.match(assignments);
          // @ts-expect-error
          item.href = `/${data[1]}/assignment/${data[2]}`;
        } else if(!local.test(item.href)) {
          item.target = "_blank";
        }
      });
    }
  })

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(props.html, {
          USE_PROFILES: { html: true },
        }),
      }}
    ></div>
  );
}