// main.ts — hands the entry's X post to the grader.
//
// The post itself is named by POST.json at the repository root. This program
// only copies that file into the output directory; it never reads the post,
// never touches the network, and writes the same bytes on every run.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const source = join(botDir, "POST.json");
const target = join(outDir, "POST.json");

if (!existsSync(source)) {
  console.error(`error: ${source} not found`);
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch {
  console.error("error: POST.json is not valid JSON");
  process.exit(1);
}
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  console.error("error: POST.json must hold a JSON object");
  process.exit(1);
}
if (typeof parsed.url !== "string" || parsed.url.length === 0) {
  console.error("error: POST.json must hold a url string");
  process.exit(1);
}
if (
  !parsed.url.startsWith("https://x.com/") &&
  !parsed.url.startsWith("https://twitter.com/")
) {
  console.error("error: POST.json url must be an X post address");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
