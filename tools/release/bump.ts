// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception OR MIT
//
// Bumps `.version` in build.zig.zon, the one place zailc's version lives (cmem/releasing.md).
// Sub-versions are capped at 9: 0.1.9 -> 0.2.0, 0.9.9 -> 1.0.0, the major is uncapped.
//
//   bun run tools/release/bump.ts [patch|minor|major] [--dry-run]
//
// PATCH is the default; MINOR is for any break, behavioural ones included. With the release gate
// open (.github/release-gate), the bump ARMS a release: pushing it to main makes auto-tag.yml tag
// and publish it. So it is its own commit,
// made on the owner's go, and never part of a merge. This tool only edits the file. It doesn't
// commit, tag or push.

import { readFile, writeFile } from "node:fs/promises";
import { REPO } from "../lib/tool.ts";
import { releaseGate } from "./gate.ts";

const argv = process.argv.slice(2);
const args = argv.filter((a) => a !== "--dry-run");
const dryRun = argv.includes("--dry-run");
const kind = args[0] ?? "patch";
if (!["patch", "minor", "major"].includes(kind) || args.length > 1) {
  console.error("usage: bun run tools/release/bump.ts [patch|minor|major] [--dry-run]");
  process.exit(2);
}

const path = `${REPO}/build.zig.zon`;
const text = await readFile(path, "utf8");
const line = /^    \.version = "(\d+)\.(\d+)\.(\d+)",$/gm;
const hits = [...text.matchAll(line)];
if (hits.length !== 1) {
  console.error(`expected exactly one '.version = "X.Y.Z",' line in ${path}, found ${hits.length}`);
  process.exit(1);
}
let [x, y, z] = hits[0].slice(1, 4).map(Number);
const old = `${x}.${y}.${z}`;

if (kind === "patch") z += 1;
if (kind === "minor") [y, z] = [y + 1, 0];
if (kind === "major") [x, y, z] = [x + 1, 0, 0];
if (z > 9) [y, z] = [y + 1, 0];
if (y > 9) [x, y] = [x + 1, 0];
const next = `${x}.${y}.${z}`;

if (dryRun) {
  console.log(`${old} -> ${next} (${kind}, dry run: build.zig.zon not written)`);
  process.exit(0);
}

const updated = text.replace(hits[0][0], `    .version = "${next}",`);
await writeFile(path, updated);
const check = await readFile(path, "utf8");
if (!check.includes(`    .version = "${next}",`) || check.includes(`    .version = "${old}",`)) {
  console.error(`read-back failed: build.zig.zon does not hold ${next}`);
  process.exit(1);
}
const gate = await releaseGate();
console.log(
  gate === "open"
    ? `${old} -> ${next} (${kind}). Commit this alone; pushing it to main releases v${next}.`
    : `${old} -> ${next} (${kind}). The release gate is CLOSED (.github/release-gate): pushing it to main releases nothing until the owner opens the gate.`,
);
