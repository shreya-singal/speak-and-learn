import assert from "node:assert/strict";
import { test } from "node:test";
import handler from "../api/generate.js";

function responseMock() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("rejects methods other than POST", async () => {
  const res = responseMock();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.error, "method_not_allowed");
});

test("validates the lesson before calling the provider", async () => {
  const res = responseMock();
  await handler({ method: "POST", body: { lesson: " " } }, res);
  assert.equal(res.statusCode, 400);

  const longLessonRes = responseMock();
  await handler({ method: "POST", body: { lesson: "x".repeat(6001) } }, longLessonRes);
  assert.equal(longLessonRes.statusCode, 400);
});

test("reports missing server API configuration", async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    const res = responseMock();
    await handler({ method: "POST", body: { lesson: "A classroom lesson." } }, res);
    assert.equal(res.statusCode, 503);
  } finally {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
  }
});

test("returns a validated tile list from the provider", async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalModel = process.env.ANTHROPIC_MODEL;
  const originalFetch = globalThis.fetch;
  const providerTiles = [
    { en: "water", hi: "पानी", sym: "water" },
    { en: "plant", hi: "पौधा", sym: "plant" },
    { en: "sunlight", hi: "धूप", sym: "sun" },
    { en: "leaf", hi: "पत्ती", sym: "leaf" },
    { en: "oxygen", hi: "ऑक्सीजन", sym: "oxygen" },
    { en: "roots", hi: "जड़ें", sym: "roots" },
    { en: "sugar", hi: "चीनी", sym: "sugar" },
    { en: "air", hi: "हवा", sym: "air" },
  ];
  process.env.ANTHROPIC_API_KEY = "test-key";
  delete process.env.ANTHROPIC_MODEL;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.anthropic.com/v1/messages");
    assert.equal(JSON.parse(options.body).model, "claude-sonnet-5-5");
    return new Response(JSON.stringify({
      content: [{ type: "text", text: JSON.stringify(providerTiles) }],
    }), { status: 200 });
  };

  try {
    const res = responseMock();
    await handler({ method: "POST", body: { lesson: "Plants need water and sunlight." } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.length, 8);
    assert.equal(res.body[0].sym, "water");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.ANTHROPIC_MODEL;
    else process.env.ANTHROPIC_MODEL = originalModel;
  }
});

test("rejects malformed provider output", async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalModel = process.env.ANTHROPIC_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.ANTHROPIC_API_KEY = "test-key";
  delete process.env.ANTHROPIC_MODEL;
  globalThis.fetch = async () => new Response(JSON.stringify({
    content: [{ type: "text", text: "not JSON" }],
  }), { status: 200 });

  try {
    const res = responseMock();
    await handler({ method: "POST", body: { lesson: "A classroom lesson." } }, res);
    assert.equal(res.statusCode, 502);
    assert.match(res.body.error, /could not be used/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.ANTHROPIC_MODEL;
    else process.env.ANTHROPIC_MODEL = originalModel;
  }
});

test("rejects provider output with fewer than eight usable tiles", async () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;
  const originalModel = process.env.ANTHROPIC_MODEL;
  const originalFetch = globalThis.fetch;
  process.env.ANTHROPIC_API_KEY = "test-key";
  delete process.env.ANTHROPIC_MODEL;
  globalThis.fetch = async () => new Response(JSON.stringify({
    content: [{ type: "text", text: JSON.stringify(Array.from({ length: 7 }, (_, index) => ({
      en: `word ${index}`,
      hi: `शब्द ${index}`,
      sym: `word ${index}`,
    }))) }],
  }), { status: 200 });

  try {
    const res = responseMock();
    await handler({ method: "POST", body: { lesson: "A classroom lesson." } }, res);
    assert.equal(res.statusCode, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.ANTHROPIC_MODEL;
    else process.env.ANTHROPIC_MODEL = originalModel;
  }
});
