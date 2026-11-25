// Your Agent in One Emoji — entry program.
//
// The whole entry is one glyph. The octopus stands for an agent at work:
// many arms busy at once, each one handling a different job for its person,
// while the head keeps track of all of them. It reads at a glance, it says
// how the agent works (in parallel, with tools), and it is nobody's first
// obvious pick — no robot face, no smiley.
//
// The rules ask for the glyph alone: /output/entry.txt must be UTF-8 text
// of 1 to 16 characters and not only white space. So this program writes
// exactly the glyph's bytes — no newline, no padding, nothing else.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const GLYPH = "🐙";
const OUTPUT_PATH = "/output/entry.txt";

// Count Unicode code points, which is how the 1..16 character gate reads
// the file for a single astral-plane emoji: one glyph, one code point.
function codePointCount(text: string): number {
  let count = 0;
  for (const _point of text) {
    count += 1;
  }
  return count;
}

function checkGate(text: string): void {
  const count = codePointCount(text);
  if (count < 1 || count > 16) {
    throw new Error(`entry must hold 1 to 16 characters, got ${count}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // One glyph means one code point here: no joiners, no variation
  // selector, no modifier trailing behind the octopus. A single astral
  // code point encodes to four UTF-8 bytes, and the file holds exactly
  // those bytes, so two runs always agree byte for byte.
  if (count !== 1) {
    throw new Error(`entry must be a single glyph, got ${count} code points`);
  }
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes !== 4) {
    throw new Error(`single astral glyph should encode to 4 bytes, got ${bytes}`);
  }
}

function main(): void {
  checkGate(GLYPH);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, GLYPH, "utf8");
}

main();
