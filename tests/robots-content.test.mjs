import assert from "node:assert/strict";
import test from "node:test";

const SAMPLE = `User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
Disallow: /checkout/
Disallow: /upgrade/
`;

test("robots prefers content-signal training block without bot disallow", () => {
  assert.match(SAMPLE, /Content-Signal:\s*search=yes,ai-train=no,use=reference/);
  assert.doesNotMatch(SAMPLE, /User-agent:\s*GPTBot[\s\S]*Disallow:\s*\//);
  assert.doesNotMatch(SAMPLE, /User-agent:\s*ClaudeBot[\s\S]*Disallow:\s*\//);
  assert.match(SAMPLE, /Disallow:\s*\/checkout\//);
});
