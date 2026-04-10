/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

declare module "virtual:changelog" {
  interface ChangelogEntry {
    id: string;
    version: string;
    date: string;
    body: string;
    image: string | null;
  }

  interface ChangelogData {
    entries: ChangelogEntry[];
  }

  const data: ChangelogData;
  export default data;
}
