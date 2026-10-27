# open-work.md — where zailc stands and what is outstanding

The status line lives HERE and nowhere else (workspace `../cmem/memory-conventions.md` § "The
two layers"). Only open items stay open; done work is one line with its merge commit and the
file that now holds the substance. The full dated narrative this file replaces (the INDEX's
⏸️ PAUSED section, 2026-10-05 → 2026-10-22) is `git show f194fc9:cmem/INDEX.md`.

## Status (2026-10-27)

- **Step 2 paused since 2026-10-09 (night)** (owner: "update the project memory files and pause
  here for today"); no runtime work since. Since then: the Bun port (`2e0e650`), the org move
  (`f194fc9`), and on 2026-10-27 the workspace-floor conformance (`dacd426`), the compatibility
  gate (`1455c16`), the history purge (force-pushed), and the **zail language direction and the
  Zig version path** (decisions only, nothing built: `roadmap.md` §§ "The Zig version path",
  "Beyond the first release"; `design-decisions.md`).
- **Release:** version `0.1.0` in `build.zig.zon`; nothing released, no tag. 🚦 The release gate
  (`.github/release-gate`) is `closed`: `main` takes finished branches and is pushed, CI runs,
  auto-tag releases nothing. Opening it is the owner's call (`releasing.md`).
- **Git (2026-10-27):** `main` pushed to `origin/main` with this file's commit; merged branches
  are kept locally (owner, 2026-10-08) and only `main`, `step2/stock-runtime` and
  `docs/state-2026-10-08` exist on `origin`. Commit ids quoted before 2026-10-27 are pre-purge:
  `history-purge-2026-10-27.md`. Check rather than trust this line: `git log --oneline --first-parent
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
- 🗓️ **GitHub still serves the pre-purge commits by hash** until its own garbage collection; a
  full removal is a GitHub Support request (owner; `history-purge-2026-10-27.md`).
- ⏳ **Workspace compatibility rule 3, behaviour carried forward**: the previous release tag's
  tests run against new source before a patch or minor (`releasing.md` § "The compatibility
  gate", the negatives). Due before the first bump after `v0.1.0`.

## Done (summary; the substance is in the file named)

| when | what | merge | where it lives now |
| --- | --- | --- | --- |
| 2026-10-05/08 | Project started and named `zailc` (was "Zaig"); the brief | `b032b4d`, `b01f05d` | `design-decisions.md`, `vision.md`, `scope.md` |
| 2026-10-08 | Release rules from binaryang; a push to `main` releases; the release gate | `b01f05d`, `f2e1b29`, `b331448` | `releasing.md` |
| 2026-10-08 | Forwarder generator in Zig, byte-identical to Ruby; musl header install, byte-identical | `70ede2a` | `testing.md`, `oracle.md` |
| 2026-10-08 | Stock half of the runtime from `zig build libpas` (178 objects, symbol oracle) | `70ede2a` | `testing.md`, `workarounds.md` W-4 |
| 2026-10-08 | Link and run against our runtime (`tests/link`); zilc's corpus 156/156 | `b8807e2`, `9530f68` | `testing.md` |
| 2026-10-08 | Upstream defects documented first, published only in `UPSTREAM-ISSUES.md` | `8861e2c`, `84ad363` | `best-practices.md` § 6, `workarounds.md` |
| 2026-10-09 | W-7's cause confirmed; W-5 fixed | `5306f0c` | `workarounds.md` W-5, W-7 |
| 2026-10-09 | `zailc-gen --version` from `build.zig.zon` | `8b6e064` | `releasing.md` |
| 2026-10-09 | yolo musl's static half (`zig build yolomusl`) | `b5388be` | `testing.md`, `workarounds.md` W-8 |
| 2026-10-09 | compiler-rt (`zig build compiler-rt`); Fil-C's `_Float16` defect kept fixed | `5b74041` | `testing.md`, `workarounds.md` W-10, `UPSTREAM-ISSUES.md` |
| 2026-10-22 | Tools in Bun only, Deno dropped; `tools/dev/typecheck.ts` replaces `deno check` | `2e0e650` | `best-practices.md` § 1, `design-decisions.md`, `testing.md` |
| 2026-10-22 | Repository moved to `synapticforge1` | `f194fc9` | `design-decisions.md` |
| 2026-10-27 | Workspace floor: drive paths out of HEAD, ★ block, privacy path test, no version cap, exFAT `.git` fix, this file | `dacd426` | `best-practices.md` §§ 6, 8; `releasing.md`; `local/environment.md` (gitignored) |
| 2026-10-27 | The compatibility gate: surface snapshot, floor-refusing `bump.ts`, CI and tag checks; inverted 16/16 | `1455c16` | `releasing.md` § "The compatibility gate", `testing.md` |
| 2026-10-27 | History purged of drive paths (H19): 67 commits rewritten, force-pushed with lease | `b325c49` | `history-purge-2026-10-27.md` (the old → new map) |
| 2026-10-27 | The zail language direction (owner): `.zail`, one `string`, `int`/`float` + Zig's numeric set, `/` and `\`, one `zail.json` generating `build.zig`/`build.zig.zon`, packages from URLs and Git | `e03f98e` … `40e3094` | `roadmap.md` § "Beyond the first release", `design-decisions.md` |
| 2026-10-27 | The Zig version path (owner): 0.15.2 until cross-platform, then 0.17.0 (LLVM 22.1.8, loop vectorizer off); every move waits for ZLS | `7dcba5b` … `1ef2c04` | `roadmap.md` § "The Zig version path", `design-decisions.md` § "Forward path" |

## Workspace correspondence (letters addressed to zailc)

Read `../cmem/workspace-correspondence.md` (then the letter in `../cmem/handoffs.md`) at session
start and before each new work item (🔒 owner, 2026-10-26). Answered 2026-10-27, workspace to
verify and close: **H26** (all of zailc's items), **H22** (path test), **H16** (`.git` fix),
**H28** (record-only), **H15** (already Bun; recorded), **H27** (canonical stamp; zailc's one
old-folder hit was inside a drive path, now gone), **H19** (purged 2026-10-27,
`history-purge-2026-10-27.md`). Every zailc commit id quoted before 2026-10-27 is a PRE-purge id:
look it up in that file's map.
