// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception OR MIT
//
// Type-checks every tool. Bun runs TypeScript without checking it, and a type error in
// tools/lib/tool.ts once went unseen across every tool (cmem/testing.md, 2026-10-08), so this is
// a gate: CI runs it, and the local gate runs the same command.
//
//   bun run tools/dev/typecheck.ts        (from Windows or Linux; runs in WSL)
//
// node_modules cannot live on the exFAT checkout (no symlinks, and Bun's lockfile rename fails
// there; workarounds.md W-2's family), so the check runs on a copy of tools/ in $WORK/tools-check:
// `bun install --frozen-lockfile` (tools/bun.lock pins TypeScript and @types/bun), then `tsc`.

import { readdirSync } from "node:fs";
import { REPO, WORK, linuxOnly, must, rmrf, show } from "../lib/tool.ts";

await linuxOnly(import.meta);

const dir = `${WORK}/tools-check`;
await rmrf(dir);
await must(["mkdir", "-p", WORK]);
await must(["cp", "-r", `${REPO}/tools`, dir]);
const files = readdirSync(dir, { recursive: true, encoding: "utf8" })
  .filter((p) => p.endsWith(".ts") && !p.split("/").includes("node_modules"));

const bun = process.execPath;
if (await show([bun, "install", "--frozen-lockfile"], { cwd: dir }) !== 0) {
  console.log("FAILED: bun install --frozen-lockfile (is tools/bun.lock in step with tools/package.json?)");
  process.exit(1);
}
const code = await show([bun, "run", "check"], { cwd: dir });
console.log(code === 0 ? `OK: ${files.length} tool files type-check` : `FAILED: tsc exit ${code} over ${files.length} tool files`);
process.exit(code === 0 ? 0 : 1);
