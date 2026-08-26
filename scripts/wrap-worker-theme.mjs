import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_BOOTSTRAP_HEAD_TAG } from "../src/lib/theme-script.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerPath = join(root, ".open-next", "worker.js");
let src = readFileSync(workerPath, "utf8");

if (src.includes("data-st-theme-bootstrap")) {
  console.log("theme bootstrap already wrapped into .open-next/worker.js");
  process.exit(0);
}

if (!src.includes("export default {")) {
  throw new Error("unexpected .open-next/worker.js shape: missing `export default {`");
}

const inject = `
function __stWithThemeBootstrap(response) {
  if (!(response instanceof Response) || !response.body) return response;
  const ct = response.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return response;
  return new HTMLRewriter()
    .on("html", {
      element(el) {
        el.removeAttribute("data-theme");
      },
    })
    .on("head", {
      element(el) {
        el.prepend(${JSON.stringify(THEME_BOOTSTRAP_HEAD_TAG)}, { html: true });
      },
    })
    .transform(response);
}
`;

// Keep imports / named exports. Only rename the default worker object, then wrap fetch.
src = src.replace("export default {", `${inject}\nconst __stOpenNextWorker = {`);
src += `

export default {
  async fetch(request, env, ctx) {
    const response = await __stOpenNextWorker.fetch(request, env, ctx);
    return __stWithThemeBootstrap(response);
  },
};
`;

writeFileSync(workerPath, src);
console.log("wrapped .open-next/worker.js so theme bootstrap is the first <head> child");
