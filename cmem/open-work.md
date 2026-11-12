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

## ▶️ Resume here: stage 1, build the zailc compiler (owner, 2026-11-05)

**The stages** (`roadmap.md` § "The development stages"), each done when its examples give
zilc's results: **(1)** build the zailc compiler (Linux x86-64, Zig 0.17.1); **(2)** C; **(3)**
C++; **(4)** Zig; **(5)** then TypeScript / zail. The order of work around them: x86-64 first, a
runtime in Zig as the stages need it, TypeScript's syntax for zail, Zig 0.17.1 from the first
nightly. Releases: nightlies until the MVP, the first release `0.0.1`.

Nothing is scoped or started yet. **The first concrete step is scoping stage 1:** the compiler's
parts on Zig 0.17.1 (front ends, zailc's own pass in Zig for LLVM 22 IR, LLVM's code generator),
how its C front end reproduces Fil-C clang's differences (varargs, unions with pointers, pointer
atomics), and which zilc C examples stage 2 takes first. The method that served the 0.686 work
still applies: an oracle per piece, then whole programs compared against zilc's results.

## Open

- 🗓️ **Follow-ups of the 2026-11-05 release decision** (`design-decisions.md`, the `0.0.1` row):
  `build.zig.zon` reads `0.1.0` and must read `0.0.1` before the release gate opens; how a
  nightly is numbered and published; what the MVP contains.
- ⏳ **The release path converges on the workspace's uniform shape before `0.0.1`** (letters H32,
  H33; `release.md` § "zailc against the uniform shape"): checks before CI tags, the build split
  from `contents: write`, the attestation read back, actions pinned by hash and Bun by sha256, a
  user's read-back, re-run safety everywhere. The release gate stays `closed` meanwhile.
- 🔴 **`main` cannot be pushed** (since 2026-11-05): GitHub rejects every push of `main` with
  `fatal error in commit_refs_rules`; GitHub's status was operational and no rule on the repo is
  visible without signing in. 🗓️ OWNER: check the `synapticforge1` organisation's and the repo's
  rulesets. Until then every commit since `258f0d2` is local only.
- 🗓️ **zail's memory model — five open questions** (`design-decisions.md` § Open; owner's rule:
  faster wherever safety allows, measured): allocation per value; immutable strings through a
  builder; readonly-by-freeze for arrays and objects; whether Fil-C makes constant globals
  read-only; WebAssembly's collector (a later target).
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
| 2026-11-12 | Workspace letters answered: H34 committed (+ H35's three words); H35 slots (`review-process.md`); H31 Bun 1.4.4 (three workflows, `@types/bun`, `tools/bun.lock`); H30 the GitHub CLI out of `publish.yml` (`tools/release/github-release.ts`, rehearsed 9/9, two mutants caught); H32/H33 `release.md` (the shape; convergence before `0.0.1`); C37 the Zig 0.17 breaks; `.claude/settings.local.json` ignored | (the commit recording them) | `release.md`, `review-process.md`, `upstream.md`, `releasing.md`, `INDEX.md` |
| 2026-11-05 | zail's memory model (from the Goose discussion: faster where safety allows, measured) and WebAssembly as a later target; five open questions | (the commit recording them) | `design-decisions.md`, `roadmap.md` §§ "zail's memory model", platform section |
| 2026-11-05 | Stage 6 (Go via TinyGo, Gollvm or LLGo) added, assessed, then dropped the same day (owner) | `f5a2f2d` (added); the drop's commit | `design-decisions.md` (the ❌ row) |
| 2026-11-05 | The development stages: compiler → C → C++ → Zig → TypeScript/zail, each matching zilc's results | (the commit recording them) | `design-decisions.md`, `roadmap.md` § "The development stages" |
| 2026-11-05 | `zail-modules`: the libraries programs link (runtime, libc, libc++, dependencies) per project, via `zail init` / `zail add`; compiling needs no libraries, linking does | (the commit recording it) | `design-decisions.md` (the `zail-modules` row), `roadmap.md` |
| 2026-11-05 | The libc direction (a Zig libc translated from musl function by function, only the functions used; one top, a per-OS bottom), licensing for the clean slate (framework kept; musl's notice via Zig's `lib/libc/musl/COPYRIGHT`; a "Retired" ledger section), and the clean slate's pins (Fil-C 0.687, Zig 0.17.1, zilc `v0.15.2-0.687.1`) | (the commit recording them) | `design-decisions.md`, `licensing.md`, `third_party/LICENSES.md`, `upstream.md`, `roadmap.md` |
| 2026-11-05 | The clean slate recorded: a new, fully Zig implementation on the latest Zig; zilc as the reference corpus and source of translated tests; parity = same result | `42f7eab` | `design-decisions.md` (the clean-slate row), `roadmap.md` § "The approach", `oracle.md` |
| 2026-11-05 | The owner's answers recorded: first release `0.0.1` (the MVP), nightlies before it; work order x86-64 → runtime in Zig → TypeScript syntax → Zig 0.17.1 from the first nightly | `79a6225` | `design-decisions.md`, `roadmap.md` § "The order of work" |
| 2026-11-05 | The split with zilc recorded (C22–C25): steps 2–3 are zilc's; zailc owns departures (W-10), cross-platform, a Zig runtime, Zig fidelity, C++, newer Zig, zail; first release and next item → owner | `cd17f16` | `design-decisions.md` (split row, § Open), `roadmap.md` § "What zailc owns" |

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
`design-decisions.md` (the split row), `roadmap.md`, `oracle.md`. Answered 2026-11-12, the
workspace (the creator) to verify on `origin/main` and close: **H30** (no GitHub CLI), **H31**
(Bun 1.4.4), **H32** / **H33** (`release.md`; the CI job order converges before `0.0.1`), **H34**
(the Owner-commands section committed), **H35** (the review words and slots), **C37** (the Zig
0.17 breaks, record-only). ⚠️ The workspace can only verify once `main` can be pushed (Open,
above).

**Opened by zailc (zailc verifies and closes):** **C28** (2026-11-05, to zilc, record-only):
zailc is a clean slate on the latest Zig and zilc is its reference corpus — zilc's tests,
examples and recorded results are now a dependency of zailc, so moves, renames or removals should
be announced. Close it once zilc's answer is in the row and its own memory records it (re-derive:
`git grep` in `../zilc/cmem/` for the corpus role). Before C28, zailc had opened no item (checked
2026-11-05: none of 56 rows).
