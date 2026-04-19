const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");
const scriptFiles = [
  "js/assets.js",
  "js/storage.js",
  "js/colorMix.js",
  "js/particles.js",
  "js/audio.js",
  "js/systems.js",
  "js/cautives.js",
  "js/maggic.js",
  "js/familyLore.js",
  "js/main.js"
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function mimeFor(file) {
  if (file.endsWith(".ico")) return "image/x-icon";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".mp3")) return "audio/mpeg";
  if (file.endsWith(".wav")) return "audio/wav";
  if (file.endsWith(".ogg")) return "audio/ogg";
  if (file.endsWith(".m4a")) return "audio/mp4";
  return "application/octet-stream";
}

function buildAssetMap() {
  const assetDirs = [
    { dir: path.join(root, "assets", "images"), pattern: /\.(ico|png|webp|jpe?g)$/i },
    { dir: path.join(root, "assets", "sounds"), pattern: /\.(mp3|wav|ogg|m4a)$/i }
  ];
  const entries = {};

  function addFiles(dir, pattern, baseDir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        addFiles(fullPath, pattern, baseDir);
        return;
      }
      if (!pattern.test(entry.name)) return;
      const key = path.relative(baseDir, fullPath).split(path.sep).join("/");
      const data = fs.readFileSync(fullPath).toString("base64");
      entries[key] = `data:${mimeFor(entry.name)};base64,${data}`;
    });
  }

  assetDirs.forEach(({ dir, pattern }) => {
    if (!fs.existsSync(dir)) return;
    addFiles(dir, pattern, dir);
  });
  return entries;
}

function stripExternalScripts(body) {
  return body.replace(/\s*<script\s+src="\.\/js\/[^"]+"><\/script>\s*/g, "\n");
}

function main() {
  fs.mkdirSync(dist, { recursive: true });
  const index = read("index.html");
  const css = read("css/styles.css");
  const levels = read("data/levels.json");
  const bodyMatch = index.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  const bodyAttrs = bodyMatch?.[1] || "";
  const body = stripExternalScripts(bodyMatch?.[2] || "");
  const scripts = scriptFiles.map(read).join("\n\n");
  const assets = buildAssetMap();
  const assetMap = JSON.stringify(assets);
  const favicon = assets["kawaii_mixer_game_logo.ico"];

  const standalone = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Kawaii Mixer Game</title>
  ${favicon ? `<link rel="icon" type="image/x-icon" href="${favicon}">` : ""}
  <style>${css}</style>
</head>
<body${bodyAttrs}>${body}
<script>
window.KM_ASSETS = ${assetMap};
window.KM_LEVELS = ${levels};
${scripts}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dist, "kawaii-mixer-standalone.html"), standalone);
  console.log("Created dist/kawaii-mixer-standalone.html");
}

main();
