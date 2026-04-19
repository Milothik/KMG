import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "ios-web");
const entries = ["index.html", "css", "data", "js", "assets"];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  cpSync(join(root, entry), join(outDir, entry), { recursive: true });
}

console.log(`Prepared iOS web assets in ${outDir}`);
