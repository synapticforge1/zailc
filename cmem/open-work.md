# open-work.md — where zailc stands and what is outstanding

The status line lives HERE and nowhere else (workspace `../cmem/memory-conventions.md` § "The
two layers"). Only open items stay open; done work is one line with its merge commit and the
file that now holds the substance. The full dated narrative this file replaces (the INDEX's
⏸️ PAUSED section, 2026-10-05 → 2026-10-22) is `git show ab5ce21:cmem/INDEX.md`.

## Status (2026-10-27)

- **Paused since 2026-10-09 (night)** (owner: "update the project memory files and pause here for
  today"); only maintenance since: the Bun port (`228bcd6`), the org move (`ab5ce21`), and the
  workspace-floor conformance (2026-10-27, this file's commit).
- **Release:** version `0.1.0` in `build.zig.zon`; nothing released, no tag. 🚦 The release gate
  (`.github/release-gate`) is `closed`: `main` takes finished branches and is pushed, CI runs,
  auto-tag releases nothing. Opening it is the owner's call (`releasing.md`).
- **Git:** `main` = `origin/main` at `ab5ce21` before this commit; merged branches are kept
  (owner, 2026-10-08). Check rather than trust this line: `git log --oneline --first-parent
  origin/main..main`, `git branch -r`, `git tag`. Several sessions may commit here: re-read
  `git log` before merging into `main`.
- **Repository:** `github.com/synapticforge1/zailc` since 2026-10-22 (`origin` uses it).

## ▶️ Resume here: step 2, yolo musl's shared half

`libyoloc.so` from the `.lo` objects + `ldso/dlstart`, `ldso/dynlink`, linked `-shared
-Wl,-e,_dlstart` with LDFLAGS_AUTO and libyolort as `LIBCC`; `ld-fil1-x86_64.so` a link to it.
Then the three Fil-C-compiled pieces (Fil-C's clang inside `zig build`, a development bridge
only), then step 3, the pass (`roadmap.md`). Same method each time: an importer for upstream's
lists, a `verify-*.ts` symbol oracle against the release tarball, then into the overlay with
`link-run.ts` (about 2 min) and `corpus-run.ts` (about 20 min, in the background).

## Open

- **W-7's exact line** in `FilPizlonator.cpp` (surmised: `scheduleChecks`; `workarounds.md` W-7).
  Not blocking.
- 🔴 **History purge of drive paths (workspace letter H19, owner 2026-10-22).** HEAD is clean
  since 2026-10-27, but measured the same day: **all 63 commits on every ref** carry at least one
  of the four paths (they were in the first commit), and all 63 are on `origin`. A purge rewrites
  every commit and every kept branch, so it needs a force-push: 🗓️ OWNER. Template: workspace
  `handoffs.md` H19 (loader-dotnet's `filter-branch` recipe; no `git filter-repo`, it needs
  Python); record the old → new map here; `gc --prune=now` after.
- ⏳ **The compatibility gate on `tools/release/bump.ts`** (🔒 workspace rule; `releasing.md`
  § "The version scheme"). Due before the first bump.

## Done (summary; the substance is in the file named)

| when | what | merge | where it lives now |
| --- | --- | --- | --- |
| 2026-10-05/08 | Project started and named `zailc` (was "Zaig"); the brief | `8a73338`, `15ab768` | `design-decisions.md`, `vision.md`, `scope.md` |
| 2026-10-08 | Release rules from binaryang; a push to `main` releases; the release gate | `15ab768`, `821e25a`, `a75acda` | `releasing.md` |
| 2026-10-08 | Forwarder generator in Zig, byte-identical to Ruby; musl header install, byte-identical | `92ec73d` | `testing.md`, `oracle.md` |
| 2026-10-08 | Stock half of the runtime from `zig build libpas` (178 objects, symbol oracle) | `92ec73d` | `testing.md`, `workarounds.md` W-4 |
| 2026-10-08 | Link and run against our runtime (`tests/link`); zilc's corpus 156/156 | `51907fd`, `f17d64b` | `testing.md` |
| 2026-10-08 | Upstream defects documented first, published only in `UPSTREAM-ISSUES.md` | `f6db938`, `4e6c635` | `best-practices.md` § 6, `workarounds.md` |
| 2026-10-09 | W-7's cause confirmed; W-5 fixed | `7d515b0` | `workarounds.md` W-5, W-7 |
| 2026-10-09 | `zailc-gen --version` from `build.zig.zon` | `b4ab519` | `releasing.md` |
| 2026-10-09 | yolo musl's static half (`zig build yolomusl`) | `41e19ec` | `testing.md`, `workarounds.md` W-8 |
| 2026-10-09 | compiler-rt (`zig build compiler-rt`); Fil-C's `_Float16` defect kept fixed | `7a7d7e7` | `testing.md`, `workarounds.md` W-10, `UPSTREAM-ISSUES.md` |
| 2026-10-22 | Tools in Bun only, Deno dropped; `tools/dev/typecheck.ts` replaces `deno check` | `228bcd6` | `best-practices.md` § 1, `design-decisions.md`, `testing.md` |
| 2026-10-22 | Repository moved to `synapticforge1` | `ab5ce21` | `design-decisions.md` |
| 2026-10-27 | Workspace floor: drive paths out of HEAD, ★ block, privacy path test, no version cap, exFAT `.git` fix, this file | (this commit) | `best-practices.md` §§ 6, 8; `releasing.md`; `local/environment.md` (gitignored) |

## Workspace correspondence (letters addressed to zailc)

Read `../cmem/workspace-correspondence.md` (then the letter in `../cmem/handoffs.md`) at session
start and before each new work item (🔒 owner, 2026-10-26). Answered 2026-10-27, workspace to
verify and close: **H26** (all of zailc's items), **H22** (path test), **H16** (`.git` fix),
**H28** (record-only), **H15** (already Bun; recorded), **H27** (canonical stamp; zailc's one
old-folder hit was inside a drive path, now gone). **Open on zailc's side:** H19 (the purge,
above).
