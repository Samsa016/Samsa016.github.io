/* Статик-сервер с gzip и keep-alive — чтобы замер отражал сайт, а не сервер. */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createGzip } from "node:zlib";
import path from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const MIME = { ".html":"text/html; charset=utf-8", ".js":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".jpg":"image/jpeg", ".png":"image/png",
  ".ico":"image/x-icon", ".woff2":"font/woff2", ".webm":"video/webm", ".mp4":"video/mp4",
  ".xml":"application/xml", ".txt":"text/plain; charset=utf-8" };
const COMPRESS = new Set([".html",".js",".css",".json",".svg",".xml",".txt"]);

createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404).end("not found"); return; }
  const ext = path.extname(file);
  const headers = { "content-type": MIME[ext] ?? "application/octet-stream",
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable" };
  if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
    res.writeHead(200, { ...headers, "content-encoding": "gzip" });
    createReadStream(file).pipe(createGzip()).pipe(res);
  } else {
    res.writeHead(200, { ...headers, "content-length": statSync(file).size });
    createReadStream(file).pipe(res);
  }
}).listen(3300, () => console.log("статика на :3300"));
