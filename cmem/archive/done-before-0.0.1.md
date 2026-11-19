# Done before 0.0.1 (nothing released yet)

Moved from `open-work.md` § Done on 2026-11-19 (letter H38). Closed items, kept verbatim with
their merge commits; ids before 2026-10-27 are pre-purge (`../history-purge-2026-10-27.md`).

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
| 2026-11-12 | Workspace letters answered: H34 committed (+ H35's three words); H35 slots (`review-process.md`); H31 Bun 1.4.4 (three workflows, `@types/bun`, `tools/bun.lock`); H30 the GitHub CLI out of `publish.yml` (`tools/release/github-release.ts`, rehearsed 9/9, two mutants caught); H32/H33 `release.md` (the shape; convergence before `0.0.1`); C37 the Zig 0.17 breaks; `.claude/settings.local.json` ignored | `a3dd8be` | `release.md`, `review-process.md`, `upstream.md`, `releasing.md`, `INDEX.md` |
| 2026-11-05 | zail's memory model (from the Goose discussion: faster where safety allows, measured) and WebAssembly as a later target; five open questions | `f951159` | `design-decisions.md`, `roadmap.md` §§ "zail's memory model", platform section |
| 2026-11-05 | Stage 6 (Go via TinyGo, Gollvm or LLGo) added, assessed, then dropped the same day (owner) | `f5a2f2d` (added); `6f575ea` (dropped) | `design-decisions.md` (the ❌ row) |
| 2026-11-05 | The development stages: compiler → C → C++ → Zig → TypeScript/zail, each matching zilc's results | `1be982c` | `design-decisions.md`, `roadmap.md` § "The development stages" |
| 2026-11-05 | `zail-modules`: the libraries programs link (runtime, libc, libc++, dependencies) per project, via `zail init` / `zail add`; compiling needs no libraries, linking does | `f084f51` | `design-decisions.md` (the `zail-modules` row), `roadmap.md` |
| 2026-11-05 | The libc direction (a Zig libc translated from musl function by function, only the functions used; one top, a per-OS bottom), licensing for the clean slate (framework kept; musl's notice via Zig's `lib/libc/musl/COPYRIGHT`; a "Retired" ledger section), and the clean slate's pins (Fil-C 0.687, Zig 0.17.1, zilc `v0.15.2-0.687.1`) | `ed7c05f` | `design-decisions.md`, `licensing.md`, `third_party/LICENSES.md`, `upstream.md`, `roadmap.md` |
| 2026-11-05 | The clean slate recorded: a new, fully Zig implementation on the latest Zig; zilc as the reference corpus and source of translated tests; parity = same result | `42f7eab` | `design-decisions.md` (the clean-slate row), `roadmap.md` § "The approach", `oracle.md` |
| 2026-11-05 | The owner's answers recorded: first release `0.0.1` (the MVP), nightlies before it; work order x86-64 → runtime in Zig → TypeScript syntax → Zig 0.17.1 from the first nightly | `79a6225` | `design-decisions.md`, `roadmap.md` § "The order of work" |
| 2026-11-05 | The split with zilc recorded (C22–C25): steps 2–3 are zilc's; zailc owns departures (W-10), cross-platform, a Zig runtime, Zig fidelity, C++, newer Zig, zail; first release and next item → owner | `cd17f16` | `design-decisions.md` (split row, § Open), `roadmap.md` § "What zailc owns" |

