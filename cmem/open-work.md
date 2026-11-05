# open-work.md — where zailc stands and what is outstanding

The status line lives HERE and nowhere else (workspace `../cmem/memory-conventions.md` § "The
two layers"). Only open items stay open; done work is one line with its merge commit and the
file that now holds the substance. The full dated narrative this file replaces (the INDEX's
⏸️ PAUSED section, 2026-10-05 → 2026-10-22) is `git show f194fc9:cmem/INDEX.md`.

## Status (2026-11-05)

- 🧱 **zailc is a clean slate (owner, 2026-11-05):** a new implementation written entirely in
  Zig on the latest Zig (0.17.1), with zilc as its reference corpus — zilc's tests translated into
  the latest Zig must give zilc's results (`roadmap.md` § "The approach"). zailc's existing code
  is the 0.686 history, not a base. Nothing of the new implementation exists yet.
- 🔁 **Steps 2 and 3 are zilc's since 2026-10-27** (owner; `design-decisions.md`, the split row):
  zilc's pure-Zig track continues them on Fil-C 0.687 and has already done yolo musl's shared half,
  zailc's old resume point. zailc's step-2 code and records here are the 0.686 history. **zailc
  owns** its departures (W-10), cross-platform (Linux aarch64 included), a runtime in Zig, Zig
  language fidelity, C++ and polish, the newer-Zig path (0.17.1) and the zail language
  (`roadmap.md` § "What zailc owns"). **Next (owner, 2026-11-05): the x86-64 version first**, then
  a runtime in Zig, TypeScript's syntax for zail, and Zig 0.17.1 from the first nightly. **Release
  plan:** nightlies until the MVP; the MVP is the first release, `0.0.1` (below).
- Since the 2026-10-09 pause: the Bun port (`2e0e650`), the org move (`f194fc9`); on 2026-10-27
  the workspace-floor conformance (`dacd426`), the compatibility gate (`1455c16`), the history
  purge (`b325c49`), the zail language direction and the Zig version path (decisions only); on
  2026-11-05 the Zig target moved to 0.17.1 and the split with zilc was recorded.
- **Release:** version `0.1.0` in `build.zig.zon`; nothing released, no tag. 🚦 The release gate
  (`.github/release-gate`) is `closed`: `main` takes finished branches and is pushed, CI runs,
  auto-tag releases nothing. Opening it is the owner's call (`releasing.md`).
- **Git (2026-11-05):** `main` last pushed 2026-10-27 (`258f0d2`, CI and auto-tag green);
  later commits are local until the owner says push. Merged branches are kept locally (owner, 2026-10-08) and only `main`, `step2/stock-runtime` and
  `docs/state-2026-10-08` exist on `origin`. Commit ids quoted before 2026-10-27 are pre-purge:
  `history-purge-2026-10-27.md`. Check rather than trust this line: `git log --oneline --first-parent
  origin/main..main`, `git branch -r`, `git tag`. Several sessions may commit here: re-read
  `git log` before merging into `main`.
- **Repository:** `github.com/synapticforge1/zailc` since 2026-10-22 (`origin` uses it).

## ▶️ Resume here: the x86-64 version first (owner, 2026-11-05)

The order (`roadmap.md` § "The order of work"): **(1) the x86-64 version first** (zail on Linux
x86_64, zilc's platform and oracle); **(2) a runtime written in Zig** (zilc's former P3); **(3)
zail's grammar is TypeScript's syntax**; **(4) the Zig 0.17.1 move starts with the first
nightly**. Releases: nightlies until the MVP, which is the first release, `0.0.1`. Nothing of
this is scoped or started yet; the first concrete step is scoping item 1 — what "the x86-64
version" of the clean-slate implementation must contain on Zig 0.17.1, which zilc tests it
translates first, and where the MVP draws the line between rewritten and compiled-from-C pieces. The method that served step 2 still
applies: an importer for upstream's lists, an oracle against the release, the two-runtime overlay
(`link-run.ts`, `corpus-run.ts`).

## Open

- 🗓️ **Follow-ups of the 2026-11-05 release decision** (`design-decisions.md`, the `0.0.1` row):
  `build.zig.zon` reads `0.1.0` and must read `0.0.1` before the release gate opens; how a
  nightly is numbered and published; what the MVP contains.
- ⚠️ **The first nightly needs a Fil-C pass that reads LLVM 22 IR** (Zig 0.17.1's; Fil-C 0.687's
  pass reads LLVM 20, zilc's Zig pass is not started) — `design-decisions.md` § "Forward path".
- 🗓️ **Pending owner confirmation:** the 2026-10-27 type and operator decisions (`int`/`float`,
  Zig's sized types, `\`) stay as zail's additions to TypeScript's syntax.
- **W-7's exact line** in `FilPizlonator.cpp` (surmised: `scheduleChecks`; `workarounds.md` W-7).
  Not blocking.
- 🗓️ **GitHub still serves the pre-purge commits by hash** until its own garbage collection; a
  full removal is a GitHub Support request (owner; `history-purge-2026-10-27.md`).
- ⏳ **Workspace compatibility rule 3, behaviour carried forward**: the previous release tag's
  tests run against new source before a patch or minor (`releasing.md` § "The compatibility
  gate", the negatives). Due before the first bump after `v0.0.1`.

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
| 2026-10-27 | The zail language direction (owner): `.zail`, one `string`, `int`/`float` + Zig's numeric set, `/` and `\`, one `zail.json` generating `build.zig`/`build.zig.zon`, packages from URLs and Git | `e03f98e` … `40e3094` | `roadmap.md` § "The zail language", `design-decisions.md` |
| 2026-10-27 | The Zig version path (owner): 0.15.2 until cross-platform, then 0.17.0 (LLVM 22.1.8, loop vectorizer off); every move waits for ZLS | `7dcba5b` … `1ef2c04` | `roadmap.md` § "The Zig version path", `design-decisions.md` § "Forward path" |
| 2026-11-05 | Zig target 0.17.0 → 0.17.1 (owner; released 2026-11-02) | `582c84d` | `design-decisions.md` § "Forward path" |
| 2026-11-05 | The clean slate recorded: a new, fully Zig implementation on the latest Zig; zilc as the reference corpus and source of translated tests; parity = same result | (the commit recording it) | `design-decisions.md` (the clean-slate row), `roadmap.md` § "The approach", `oracle.md` |
| 2026-11-05 | The owner's answers recorded: first release `0.0.1` (the MVP), nightlies before it; work order x86-64 → runtime in Zig → TypeScript syntax → Zig 0.17.1 from the first nightly | (the commit recording them) | `design-decisions.md`, `roadmap.md` § "The order of work" |
| 2026-11-05 | The split with zilc recorded (C22–C25): steps 2–3 are zilc's; zailc owns departures (W-10), cross-platform, a Zig runtime, Zig fidelity, C++, newer Zig, zail; first release and next item → owner | (the memory-update commit) | `design-decisions.md` (split row, § Open), `roadmap.md` § "What zailc owns" |

## Workspace correspondence (letters addressed to zailc)

Read `../cmem/workspace-correspondence.md` (then the letter in `../cmem/handoffs.md`) at session
start and before each new work item (🔒 owner, 2026-10-26). Answered 2026-10-27, workspace to
verify and close: **H26** (all of zailc's items), **H22** (path test), **H16** (`.git` fix),
**H28** (record-only), **H15** (already Bun; recorded), **H27** (canonical stamp; zailc's one
old-folder hit was inside a drive path, now gone), **H19** (purged 2026-10-27,
`history-purge-2026-10-27.md`). Every zailc commit id quoted before 2026-10-27 is a PRE-purge id:
look it up in that file's map. Answered 2026-11-05, zilc (the creator) to verify and close:
**C22** (cross-platform is zailc's, Linux aarch64 included), **C23** (zilc on Fil-C 0.687,
released `v0.15.2-0.687.1`), **C24** (steps 2–3 moved to zilc; zailc keeps W-10, the zail
language, newer Zig, cross-platform), **C25** (zilc finished yolo musl's shared half) — all in
`design-decisions.md` (the split row), `roadmap.md`, `oracle.md`. zailc has created no ledger item
of its own (checked 2026-11-05: none of the 56 rows is from zailc).
