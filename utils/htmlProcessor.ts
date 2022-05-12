import DOMPurify from "isomorphic-dompurify";
import { open } from "@tauri-apps/api/shell"

const modules = new RegExp("https://apsva.instructure.com/courses/(\\d*)/modules/(\\d*)")
const files = new RegExp("https://apsva.instructure.com/courses/(\\d*)/files/(\\d*)")
const pages = new RegExp("https://apsva.instructure.com/courses/(\\d*)/pages/(.*)")
const email = new RegExp("mailto:.*@.*\\..*")

export default function process(rawHtml: string) {
  const html = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
  });

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, "text/html");

  doc.querySelectorAll("a").forEach((item) => {
    item.target = "_blank"
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
    } else if (email.test(item.href)) {
      ;
    } else {
      item.onclick = (e) => {
        e.preventDefault()
        open(item.href)
        console.log("click")
      };
      item.href = "";
    }
  })
  // @ts-expect-error
  return DOMPurify.sanitize(doc.body.parentElement.innerHTML, {
    USE_PROFILES: { html: true },
  });
}
