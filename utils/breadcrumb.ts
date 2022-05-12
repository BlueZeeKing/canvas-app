export default function setIndex(index: number, value: string, url: string) {
  let storage = [{ name: "Dashboard", url: "/" }];
  if (window.localStorage.getItem("breadcrumb")) {
    // @ts-expect-error
    storage = JSON.parse(window.localStorage.getItem("breadcrumb"));
  }

  storage[index] = { name: value, url: url };
  window.localStorage.setItem("breadcrumb", JSON.stringify(storage.slice(0, index+1)));
}