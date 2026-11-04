import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("the browser application has valid inline JavaScript", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

  assert.equal(scripts.length, 1, "expected exactly one inline application script");
  assert.doesNotThrow(() => new Function(scripts[0][1]));
});

test("local setup instructions refer to real tracked setup files", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  const gitignore = await readFile(new URL("../.gitignore", import.meta.url), "utf8");

  assert.match(packageJson.scripts.start, /--env-file=\.env/);
  assert.match(envExample, /ANTHROPIC_API_KEY=/);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
});
