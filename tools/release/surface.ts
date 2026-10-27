// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception OR MIT
//
// zailc's public SURFACE, extracted from the source by a tool, never typed by hand, and the
// compatibility gate built on it (cmem/releasing.md § "The compatibility gate"; the workspace's
// 🔒 rule, ../cmem/layout-and-packaging.md).
//
//   bun run tools/release/surface.ts            print the surface extracted from the tree
//   bun run tools/release/surface.ts --check    exit 1 unless tools/release/surface.txt matches it
//   bun run tools/release/surface.ts --write    re-baseline: rewrite surface.txt (its OWN commit)
//   bun run tools/release/surface.ts --release-check <vX.Y.Z>
//                                               CI on a tag: the bump from the previous tag must
//                                               be at least the floor the surface diff sets
//
// The surface is what a user can depend on: zailc-gen's command shapes, its `--version` first
// line and exit codes; `zig build` steps and -D options; the libraries and executables it
// installs; the ZAILC_* variables the tools read; any Zig module exported to dependents
// (`b.addModule`: none today); and the SHA-256 of the files zailc-gen generates (a changed output
// is a break, releasing.md). NOT covered (write the negatives down): behaviour that keeps every
// name (the previous tag's tests are not re-run against new source, workspace rule 3), object
// files installed by name (filc_crt.o, crt1.o, …), the musl headers' bytes, the tools themselves
// (development only, never shipped).
//
// Self-contained (no tools/lib/tool.ts), like gate.ts: publish.yml runs it on a bare checkout.

import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const REPO = join(import.meta.dir, "..", "..");
export const SNAPSHOT = "tools/release/surface.txt";

export type Level = "patch" | "minor" | "major";
const RANK: Record<Level, number> = { patch: 0, minor: 1, major: 2 };

function read(rel: string): string {
  return readFileSync(join(REPO, rel), "utf8");
}

/** Fails loudly when an extractor finds nothing: a refactor must not shrink the surface silently. */
function atLeast<T>(what: string, items: T[], n = 1): T[] {
  if (items.length < n) throw new Error(`surface: expected at least ${n} ${what}, found ${items.length}`);
  return items;
}

/** The surface lines, sorted. Each line is `<kind> <key>` or `<kind> <key> = <value>`. */
export function extract(): string[] {
  const main = read("src/gen/main.zig");
  const build = read("build.zig");
  const fwd = read("src/gen/forwarders.zig");
  const out: string[] = [];

  // The usage text is the command list; one line per command shape.
  const usage = main.match(/const usage =\n((?:\s*\\\\.*\n)+);/);
  if (!usage) throw new Error("surface: `const usage =` block not found in src/gen/main.zig");
  const shapes = usage[1].split("\n").map((l) => l.replace(/^\s*\\\\/, "").replace(/^usage:/, "").trim()).filter(Boolean);
  for (const s of atLeast("usage lines", shapes, 2)) out.push(`cli ${s}`);

  const ver = main.match(/const version_text = std\.fmt\.comptimePrint\(\n\s*\\\\(.*)\n/);
  if (!ver) throw new Error("surface: version_text's first line not found in src/gen/main.zig");
  out.push(`cli-version-line ${ver[1].trim()}`);

  const exits = [...new Set([...main.matchAll(/std\.process\.exit\((\d+)\)/g)].map((m) => m[1]))];
  for (const e of atLeast("exit codes", exits)) out.push(`cli-exit ${e}`);

  for (const m of atLeast("build steps", [...build.matchAll(/b\.step\("([^"]+)"/g)])) out.push(`build-step ${m[1]}`);
  for (const m of atLeast("build options", [...build.matchAll(/b\.option\(([^,]+), "([^"]+)"/g)])) {
    out.push(`build-option -D${m[2]} = ${m[1].trim()}`);
  }
  const artifacts = [...build.matchAll(/b\.add(Executable|Library)\(\.\{\s*\.name = "([^"]+)"/g)];
  for (const m of atLeast("installed artifacts", artifacts)) out.push(`artifact ${m[1].toLowerCase()} ${m[2]}`);
  for (const m of build.matchAll(/b\.addModule\("([^"]+)"/g)) out.push(`zig-module ${m[1]}`);

  // Every tool is scanned (a self-discovering list), this file excepted: its comments name the family.
  const vars = new Set<string>();
  const tools = [...new Bun.Glob("tools/**/*.ts").scanSync({ cwd: REPO })].map((p) => p.replaceAll("\\", "/"));
  const ours = tools.filter((p) => p !== "tools/release/surface.ts" && !p.includes("node_modules/"));
  for (const rel of ["build.zig", ...ours]) {
    for (const m of read(rel).matchAll(/\bZAILC_[A-Z][A-Z0-9_]*\b/g)) vars.add(m[0]);
  }
  for (const v of atLeast("ZAILC_ variables", [...vars])) out.push(`env ${v}`);

  const shas = [...fwd.matchAll(/pub const ruby_sha256_(\w+) = "([0-9a-f]{64})";/g)];
  for (const m of atLeast("generated-output hashes", shas, 2)) out.push(`output ${m[1]} = sha256:${m[2]}`);

  return [...new Set(out)].sort();
}

export function parse(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
}

export function render(lines: string[]): string {
  return [
    "# zailc's public surface, generated by `bun run tools/release/surface.ts --write`. Never edit",
    "# by hand. A change to it is a re-baseline in its OWN commit, with the reason (releasing.md).",
    ...lines,
    "",
  ].join("\n");
}

export interface Floor {
  level: Level;
  removed: string[];
  changed: string[];
  added: string[];
}

/** The minimum bump from `before` to `after`: anything removed or changed is major, an addition minor. */
export function floor(before: string[], after: string[]): Floor {
  const key = (l: string) => l.split(" = ")[0];
  const b = new Map(before.map((l) => [key(l), l]));
  const a = new Map(after.map((l) => [key(l), l]));
  const removed = [...b.keys()].filter((k) => !a.has(k)).map((k) => b.get(k)!);
  const changed = [...b.keys()].filter((k) => a.has(k) && a.get(k) !== b.get(k)).map((k) => `${b.get(k)}  ->  ${a.get(k)}`);
  const added = [...a.keys()].filter((k) => !b.has(k)).map((k) => a.get(k)!);
  const level: Level = removed.length || changed.length ? "major" : added.length ? "minor" : "patch";
  return { level, removed, changed, added };
}

export function printFloor(f: Floor, against: string): void {
  console.log(`surface floor against ${against}: ${f.level.toUpperCase()}`);
  for (const l of f.removed) console.log(`  removed   ${l}`);
  for (const l of f.changed) console.log(`  changed   ${l}`);
  for (const l of f.added) console.log(`  added     ${l}`);
}

export type Version = [number, number, number];
export function parseVersion(v: string): Version {
  const m = v.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!m) throw new Error(`not a version: ${v}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
/** The level of the step from `a` to `b`, or null when `b` is not above `a`. */
export function stepLevel(a: Version, b: Version): Level | null {
  if (b[0] !== a[0]) return b[0] > a[0] ? "major" : null;
  if (b[1] !== a[1]) return b[1] > a[1] ? "minor" : null;
  return b[2] > a[2] ? "patch" : null;
}

/**
 * Whether a `level` bump from `from` satisfies `f`. Before 1.0.0 a minor may stand in for a
 * major floor (SemVer allows a 0.y.z break in a minor; workspace rule 6), but only with a row in
 * README's "Breaking Changes" table for the release. Returns the refusal, or null.
 */
export function refusal(f: Floor, level: Level, from: Version, readme: string): string | null {
  if (RANK[level] >= RANK[f.level]) return null;
  if (f.level === "major" && level === "minor" && from[0] === 0) {
    return breakingRow(readme)
      ? null
      : "a pre-1.0 minor over a MAJOR floor needs a README `### ⚠️ Breaking Changes` row for `_next release_` (or the version) first";
  }
  return `a ${level} bump is below the ${f.level.toUpperCase()} floor`;
}

function breakingRow(readme: string): boolean {
  const sec = readme.split(/^### ⚠️ Breaking Changes\s*$/m)[1];
  if (!sec) return false;
  const table = sec.split(/^#/m)[0];
  return table.split("\n").some((l) => /^\|\s*(_next release_|v?\d+\.\d+\.\d+)\s*\|/.test(l));
}

async function git(args: string[]): Promise<{ code: number; out: string }> {
  const p = Bun.spawn(["git", "-C", REPO, ...args], { stdout: "pipe", stderr: "pipe" });
  const out = await new Response(p.stdout).text();
  return { code: await p.exited, out };
}

/** The highest `vX.Y.Z` tag strictly below `below` (or any, when omitted), or null. */
export async function previousTag(below?: Version): Promise<string | null> {
  const r = await git(["tag", "--list", "v*"]);
  if (r.code !== 0) throw new Error("git tag failed");
  const cmp = (x: Version, y: Version) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  const tags = r.out.split("\n").map((t) => t.trim()).filter((t) => /^v\d+\.\d+\.\d+$/.test(t));
  const vs = tags.map((t) => [t, parseVersion(t)] as const).filter(([, v]) => !below || cmp(v, below) < 0);
  vs.sort((x, y) => cmp(x[1], y[1]));
  return vs.length ? vs[vs.length - 1][0] : null;
}

/** The committed snapshot at `ref`. A tag that predates the gate has none: that is an error. */
export async function snapshotAt(ref: string): Promise<string[]> {
  const r = await git(["show", `${ref}:${SNAPSHOT}`]);
  if (r.code !== 0) throw new Error(`${ref} has no ${SNAPSHOT}: no baseline to diff against`);
  return parse(r.out);
}

if (import.meta.main) {
  const [mode, arg] = process.argv.slice(2);
  try {
    const now = extract();
    if (!mode) {
      console.log(now.join("\n"));
    } else if (mode === "--write") {
      const tmp = join(REPO, SNAPSHOT + ".tmp");
      writeFileSync(tmp, render(now));
      renameSync(tmp, join(REPO, SNAPSHOT));
      console.log(`wrote ${SNAPSHOT}: ${now.length} lines. Commit it ALONE, with the reason.`);
    } else if (mode === "--check") {
      const f = floor(parse(read(SNAPSHOT)), now);
      if (f.removed.length || f.changed.length || f.added.length) {
        printFloor(f, SNAPSHOT);
        console.error(`the source's surface differs from ${SNAPSHOT}: re-baseline with --write in its own commit, with the reason`);
        process.exit(1);
      }
      console.log(`surface matches ${SNAPSHOT} (${now.length} lines)`);
    } else if (mode === "--release-check" && arg) {
      const v = parseVersion(arg);
      const committed = parse(read(SNAPSHOT));
      const drift = floor(committed, now);
      if (drift.level !== "patch" || drift.added.length) throw new Error(`${SNAPSHOT} does not match the source at ${arg}`);
      const prev = await previousTag(v);
      if (!prev) {
        console.log(`${arg}: no earlier release tag, nothing to diff against (the first release)`);
      } else {
        const level = stepLevel(parseVersion(prev), v);
        if (!level) throw new Error(`${arg} is not above ${prev}`);
        const f = floor(await snapshotAt(prev), committed);
        printFloor(f, prev);
        const why = refusal(f, level, parseVersion(prev), read("README.md"));
        if (why) throw new Error(`${prev} -> ${arg} is a ${level}: ${why}`);
        console.log(`${prev} -> ${arg} (${level}) satisfies the floor`);
      }
    } else {
      console.error("usage: bun run tools/release/surface.ts [--check | --write | --release-check <vX.Y.Z>]");
      process.exit(2);
    }
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
