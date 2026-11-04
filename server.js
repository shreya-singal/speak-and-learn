import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import generate from "./api/generate.js";

const port = Number(process.env.PORT) || 3000;
const indexPath = fileURLToPath(new URL("./index.html", import.meta.url));
const maxBodyBytes = 64 * 1024;

function respond(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType, "x-content-type-options": "nosniff" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  if (pathname === "/" || pathname === "/index.html") {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return respond(res, 405, { error: "method_not_allowed" });
    }
    const html = await readFile(indexPath, "utf8");
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'self'; img-src 'self' data: https://static.arasaac.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.arasaac.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
      "x-content-type-options": "nosniff",
    });
    return res.end(req.method === "HEAD" ? undefined : html);
  }

  if (pathname !== "/api/generate") {
    return respond(res, 404, { error: "not_found" });
  }

  try {
    req.body = req.method === "POST" ? await readJsonBody(req) : undefined;
    const response = {
      status(code) {
        res.statusCode = code;
        return this;
      },
      json(body) {
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(JSON.stringify(body));
        return this;
      },
      end() {
        res.end();
        return this;
      },
      setHeader(name, value) {
        res.setHeader(name, value);
      },
    };
    await generate(req, response);
  } catch (error) {
    const status = error.statusCode || 500;
    if (status === 500) console.error("Local request failed:", error.message);
    respond(res, status, { error: error.message || "Internal server error." });
  }
});

server.listen(port, () => {
  console.log(`Speak & Learn is running at http://127.0.0.1:${port}`);
}).on("error", (error) => {
  console.error("Could not start the local server:", error.message);
  process.exitCode = 1;
});
