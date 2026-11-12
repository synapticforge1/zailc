// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception OR MIT
//
// Creates (or completes) the GitHub Release page for a tag and uploads its assets, through GitHub's
// REST API with the job's GITHUB_TOKEN. It replaces the GitHub CLI's `release create` in
// publish.yml: the workspace rule is "no GitHub CLI, in CI too" (letter H30, owner 2026-11-08).
//
//   bun run tools/release/github-release.ts --tag vX.Y.Z --title "zailc vX.Y.Z" \
//       [--notes-file notes.md] <asset>...
//
// Environment: GITHUB_TOKEN (contents: write), GITHUB_REPOSITORY (owner/name), GITHUB_API_URL
// (default https://api.github.com; set by Actions).
//
// What it guarantees, in order:
//   1. The tag exists on GitHub (as the CLI's `--verify-tag` did); otherwise exit 1 and
//      nothing is created.
//   2. One Release for the tag. Re-run safe (release-process.md U12): if the page already exists
//      it is reused, never duplicated.
//   3. Every asset uploaded. An asset already on the page with the same name and size is kept; the
//      same name with a different size is an error (exit 1), never overwritten.
//   4. Read back: the page lists every asset, or exit 1.
// Notes: the --notes-file's text if it is non-empty, else GitHub's generated notes.
// Every request has a time limit (workspace best-practices 7.21).
//
// Self-contained (no tools/lib/tool.ts), like gate.ts: publish.yml runs it on a bare checkout.

import { readFileSync, statSync, existsSync } from "node:fs";
import { basename } from "node:path";

const API_TIMEOUT_MS = 30_000;
const UPLOAD_TIMEOUT_MS = 300_000;

interface Args {
  tag: string;
  title: string;
  notesFile: string | null;
  assets: string[];
}

export function parseArgs(argv: string[]): Args {
  let tag = "";
  let title = "";
  let notesFile: string | null = null;
  const assets: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--tag" || a === "--title" || a === "--notes-file") {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} needs a value`);
      if (a === "--tag") tag = v;
      else if (a === "--title") title = v;
      else notesFile = v;
    } else if (a.startsWith("--")) {
      throw new Error(`unknown option ${a}`);
    } else {
      assets.push(a);
    }
  }
  if (!/^v\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$/.test(tag)) throw new Error(`--tag must be vX.Y.Z, got "${tag}"`);
  if (!title) throw new Error("--title is required");
  if (assets.length === 0) throw new Error("no assets given");
  for (const f of assets) if (!existsSync(f) || !statSync(f).isFile()) throw new Error(`asset not found: ${f}`);
  const names = assets.map((f) => basename(f));
  if (new Set(names).size !== names.length) throw new Error("two assets share a file name");
  return { tag, title, notesFile, assets };
}

interface Ctx {
  api: string;
  repo: string;
  token: string;
}

async function call(ctx: Ctx, method: string, url: string, body?: unknown, timeout = API_TIMEOUT_MS): Promise<{ status: number; json: any }> {
  const res = await fetch(url.startsWith("http") ? url : `${ctx.api}${url}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${ctx.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

function fail(msg: string): never {
  throw new Error(msg);
}

export async function release(ctx: Ctx, a: Args): Promise<string> {
  const repo = `/repos/${ctx.repo}`;

  // 1. The tag must exist on GitHub.
  const ref = await call(ctx, "GET", `${repo}/git/ref/tags/${encodeURIComponent(a.tag)}`);
  if (ref.status !== 200) fail(`tag ${a.tag} is not on GitHub (HTTP ${ref.status}); nothing created`);

  // 2. The page: reuse it on a re-run, else create it.
  let rel = await call(ctx, "GET", `${repo}/releases/tags/${encodeURIComponent(a.tag)}`);
  if (rel.status === 200) {
    console.log(`release page for ${a.tag} exists (id ${rel.json.id}); completing it`);
  } else if (rel.status === 404) {
    const notes = a.notesFile && existsSync(a.notesFile) ? readFileSync(a.notesFile, "utf8").trim() : "";
    const body = notes
      ? { tag_name: a.tag, name: a.title, body: notes, draft: false, prerelease: false }
      : { tag_name: a.tag, name: a.title, generate_release_notes: true, draft: false, prerelease: false };
    if (!notes) console.log(`::warning::no release notes given; using GitHub's generated notes`);
    rel = await call(ctx, "POST", `${repo}/releases`, body);
    if (rel.status !== 201) fail(`creating the release failed (HTTP ${rel.status}): ${JSON.stringify(rel.json)}`);
    console.log(`release page created for ${a.tag} (id ${rel.json.id})`);
  } else {
    fail(`reading the release for ${a.tag} failed (HTTP ${rel.status})`);
  }
  const id: number = rel.json.id;
  const uploadBase = String(rel.json.upload_url ?? "").replace(/\{.*\}$/, "");
  if (!uploadBase) fail("the release has no upload_url");

  // 3. The assets: keep identical ones, refuse a conflicting one, upload the rest.
  const have = new Map<string, number>();
  for (const x of rel.json.assets ?? []) have.set(x.name, x.size);
  for (const f of a.assets) {
    const name = basename(f);
    const size = statSync(f).size;
    if (have.has(name)) {
      if (have.get(name) === size) {
        console.log(`asset ${name} already uploaded (${size} B)`);
        continue;
      }
      fail(`asset ${name} is already on the page with ${have.get(name)} B, not ${size} B; refusing to overwrite`);
    }
    const res = await fetch(`${uploadBase}?name=${encodeURIComponent(name)}`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${ctx.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/octet-stream",
        "Content-Length": String(size),
      },
      body: readFileSync(f),
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
    });
    if (res.status !== 201) fail(`uploading ${name} failed (HTTP ${res.status}): ${await res.text()}`);
    console.log(`asset ${name} uploaded (${size} B)`);
  }

  // 4. Read back: every asset is on the page.
  const back = await call(ctx, "GET", `${repo}/releases/${id}`);
  if (back.status !== 200) fail(`reading the release back failed (HTTP ${back.status})`);
  const listed = new Set<string>((back.json.assets ?? []).map((x: any) => x.name));
  const missing = a.assets.map((f) => basename(f)).filter((n) => !listed.has(n));
  if (missing.length) fail(`read back: the page lacks ${missing.join(", ")}`);
  if (back.json.draft) fail("read back: the release is a draft");
  console.log(`read back: ${a.tag} lists all ${a.assets.length} assets — ${back.json.html_url ?? ""}`);
  return back.json.html_url ?? "";
}

if (import.meta.main) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const token = process.env.GITHUB_TOKEN ?? "";
    const repo = process.env.GITHUB_REPOSITORY ?? "";
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`GITHUB_REPOSITORY must be owner/name, got "${repo}"`);
    await release({ api: (process.env.GITHUB_API_URL ?? "https://api.github.com").replace(/\/$/, ""), repo, token }, args);
  } catch (e) {
    console.error(`::error::${(e as Error).message}`);
    process.exit(1);
  }
}
