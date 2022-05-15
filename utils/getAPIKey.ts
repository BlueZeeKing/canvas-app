import { readTextFile } from "@tauri-apps/api/fs"
import { appDir, join } from "@tauri-apps/api/path";

export default async () => {
  const data = await readTextFile(await join(await appDir(), "apikey.txt"));
  return data;
}