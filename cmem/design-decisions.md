# design-decisions.md — the decisions zailc works under, and why

Last verified: 2026-11-19. One item per decision, IDs `DD-NN` (numbered 2026-11-19 in the order the
rows stood). Elsewhere: the zail language (DD-27–30, 34, 39, 42, and its open questions DD-44–48) in
[zail-language.md](zail-language.md); the Zig version path (DD-49) in
[zig-version-path.md](zig-version-path.md); the 0.686 work and superseded items (DD-03–06, 08, 12–16,
19, 21, 22) in [archive/decisions-0.686.md](archive/decisions-0.686.md).

## Decisions made

- **DD-01 · 2026-10-05** — 🌱 **The project exists** (owner; called "Zaig" from 2026-10-05 to 2026-10-08, then
  renamed, next row): a new project on Zig + Fil-C, AI-assisted, "zag where they zig". zilc stays the stable
  reference and zailc's test oracle, its cadence unchanged
  *Why:* Owner: keeps zilc maintainable and provable against Zig/LLVM/Fil-C releases without criss-crossing
  intents, while zailc grows from what zilc proved. Recorded in zilc's `design-decisions.md` the same evening

- **DD-02 · 2026-10-08** — 🏷️ **The name is `zailc` = Zig + AI + Fil-C** (owner). Folder `zailc`, package
  `.zailc`, binary `zailc-gen`, env prefix `ZAILC_`, work area `~/zailc-work`; GitHub slug `jrmarcum/zailc`
  when published (moved to `synapticforge1/zailc` by 2026-10-22; row below)
  *Why:* Owner: "zaig" has several GitHub projects already; `zaiglang` was liked but "looks too much like
  ziglang and I don't want to get them mad at just copying them"; `zailc` "is a good compromise and easy to
  type", and "the punch line states it all in one go: Zig + AI + Fil-C". Measured 2026-10-08 (GitHub search,
  exact repo-name matches): `zailc` 0; taken: `zaig` 4, `zigai` 3, `zaic` 6, `zeig` 3, `zagi` 10, `zig-ai` 6,
  `zagai` 2, `zaigen` 2, `zagc` 3, `zygai` 1. The 2026-10-05 history in zilc's cmem keeps the old name with a
  rename note

- **DD-07 · 2026-10-08** — 🛑 **Nothing built by Fil-C, cosmo, zilc or zailc is ever executed on the Windows
  host.** All building, testing and running happens inside WSL; the Windows half of an APE only under Wine
  inside WSL
  *Why:* The development machine runs SentinelOne (EDR). On 2026-10-05 cosmo APE files run as `.exe` from
  Claude's Windows scratchpad were quarantined and Claude Code was killed (zilc's `workarounds.md`, "Nothing
  built by Fil-C or cosmo is ever EXECUTED on the Windows host"). Nothing in this work needs the Windows host

- **DD-09 · 2026-10-08** — ⚖️ **Licence: `Apache-2.0 WITH LLVM-exception OR MIT`**, as zilc; ported upstream
  code keeps its own licence with the notice in every ported file and a ledger row
  *Why:* zilc's `cmem/licensing.md` has the full reasoning (the LLVM exception keeps user binaries free of §4;
  the MIT arm matches Zig). zailc is a translation project, so the ledger discipline matters more here than in
  zilc

- **DD-10 · 2026-10-08** — 🔖 **Releases follow binaryang's cadence; zilc keeps its own** (owner: "zilc will
  follow upstream and maintain its release rules. We will follow the same cadence as binaryang"). Plain semver
  from `0.1.0`, tags `vX.Y.Z`; patch by default, MINOR for any break (behavioural included); sub-version
  capped at 9 (🔁 retired 2026-10-27, row below); the version line arms a release, so merge unbumped and bump
  as its own commit on the owner's go; a patch while `main` holds unreleased work goes from a branch cut from
  the last tag; `unreleased.md` → `CHANGELOG.md`; release binaries only from CI, never local. Upstream
  versions are recorded in `upstream.md` / `--version`, not in the number. Full rules and the adaptations:
  `releasing.md`
  *Why:* Closes the open "version scheme" question. zilc's `<Zig>-<Fil-C>.<release>` names the upstreams it
  follows; zailc will stop following Fil-C's pass, and binaryang's settled flow (8 of 8 tag-push publishes)
  already encodes the lessons about irreversible releases

- **DD-11 · 2026-10-08** — 🚀 **A push to `main` releases, as in binaryang** (owner: "when we commit to main
  we would be also pushing the release like binaryang does. That is how I would like this repository setup
  also"). `ci.yml` (gates), `auto-tag.yml` (tags a new `build.zig.zon` version and calls `publish.yml`),
  `publish.yml` (CI-built, attested `zailc-gen` binaries on a GitHub Release); `tools/release/bump.ts`. So
  `main` only takes `--no-ff` merges, and a bump is its own commit. Departure: auto-tag CALLS publish
  (`workflow_call`) instead of dispatching it
  *Why:* binaryang's settled pattern, minus its one failing path: a `GITHUB_TOKEN` tag push cannot trigger
  `push: tags`, and binaryang's dispatch fallback published 0 of 4. ⚠️ With no tag yet, the first push of
  `main` releases `v0.1.0`. Details: `releasing.md`

- **DD-17 · 2026-10-08** — 🐞 **Upstream defects are documented in full, then worked around or fixed** (owner:
  "if we find a defect in the upstream code whether zig or zilc or Fil-C, we will fully document what the
  defect is, why it is a defect, and how we confirmed it to be so. Then we will document our work around or
  fix to correct the defect found."). Template: `workarounds.md` § "How to write an entry" (the defect; why it
  is one, against upstream's own contract; how it was confirmed with upstream alone; what zailc does;
  published). **Published in `UPSTREAM-ISSUES.md` only**, never filed in upstream trackers; upstream
  references the file (owner: "We will document in that file only and let upstream reference it for their
  use.") Reproductions in `tests/upstream/`; the maintainers' list in `UPSTREAM-ISSUES.md`
  *Why:* A defect claimed but not confirmed sends work the wrong way (zilc's "inline asm" and "integer
  forging" misattributions, `best-practices.md` § 3–4). Confirming with upstream alone is what separates
  "upstream is wrong" from "our port is wrong", and while upstream is the oracle that distinction decides
  whether zailc reproduces the behaviour or must change

- **DD-18 · 2026-10-08** — 🚦 **A release gate: `.github/release-gate` reads `closed` until the owner opens
  it; while closed, `main` takes finished branches and is pushed as usual, and NOTHING is released** (owner:
  "I would prefer the guard so we keep main up to date with finished branches and releases when they are
  ready"). `tools/release/gate.ts` is the one reader (`open` / `closed`, anything else exits 1).
  `auto-tag.yml` reads it first and, when closed, stops green with a notice: no version read, no tag.
  `publish.yml` refuses before any build or upload unless the gate is open at the tagged commit, so a
  hand-pushed `v*` tag cannot release either. `bump.ts` says when the gate is closed. Opening it is the
  owner's decision, made as its own commit and merged with `--no-ff`
  *Why:* Resolves the open "Remote" row: the alternative, never pushing `main`, would leave the remote behind
  for months and CI unused. The gate keeps binaryang's flow intact (a push of `main` with a new version
  releases) for when releases start, and makes "not yet" a fact in the repo instead of a habit. A malformed
  file fails the run rather than reading as open

- **DD-20 · 2026-10-09** — ⚖️ **A recorded departure: libyolort keeps `_Float16` (`COMPILER_RT_HAS_FLOAT16`),
  so zailc converts `_Float16` correctly where Fil-C 0.686's release does not** (owner, asked with the
  evidence: "Keep the fix"; "records this as an upstream issue item")
  *Why:* Upstream's GCC-11.4-built libyolort takes the half value in `%edi` while Fil-C's clang passes it in
  `%xmm0`: 1.5 → 0.0083 (W-10, `UPSTREAM-ISSUES.md` Fil-C 2). Reproducing it would mean overriding what
  compiler-rt's CMake decides for our compiler, to keep wrong answers. Pinned on both sides:
  `tests/link/half_float.c` (`// departure W-10: stock exit 1`) requires ours correct AND stock still wrong;
  when upstream fixes it, the stock half fails and the departure line goes

- **DD-23 · 2026-10-22** — 🥟 **Tools are Bun scripts, and only Bun; Deno is dropped** (owner: "since deno is
  going away, please make the scripts exclusively bun scripts and update the project files to note this").
  Every tool uses Bun's built-ins and `node:` modules (no `jsr:`/`npm:` imports), runs as `bun run
  tools/<group>/<tool>.ts`, and `linuxOnly()` re-runs it under `~/.bun/bin/bun` in WSL. The type-check is
  `tools/dev/typecheck.ts`: `tsc` and `@types/bun` pinned in `tools/package.json` / `tools/bun.lock`,
  installed into a copy in `$WORK/tools-check`; CI runs the same tool with Bun 1.4.3
  *Why:* Supersedes the Deno half of the 2026-10-08 tools row. `node:` APIs keep the tools runtime-neutral
  TypeScript, with Bun-only calls confined to `tools/lib/tool.ts` (`Bun.spawn`, `import.meta.dir`). Bun does
  not type-check, so the check `deno check` gave must be its own step. One semantic difference was found and
  kept out: `Bun.spawn`'s `env` REPLACES the environment where Deno's added to it, so `run()` merges with
  `process.env`

- **DD-24 · 2026-10-22** — 🏠 **zailc lives at `github.com/synapticforge1/zailc`, and zilc at
  `github.com/synapticforge1/zilc`** (owner moved both from `jrmarcum/`; first seen at the push of `2e0e650`,
  when GitHub answered "This repository moved"). Links and records use the new paths; `origin` points at the
  new URL
  *Why:* GitHub redirects the old URLs (web, git and API), but a redirect is not a guarantee: it breaks if a
  repo named `jrmarcum/zailc` is ever created again. Records written before the move keep the old path where
  they describe what happened then

- **DD-25 · 2026-10-27** — 🔒 **zailc conforms to the workspace floor** (owner: "review the workspace rules
  and bring this repo into compliance"; workspace letter H26). (1) **SemVer 2.0.0 with no cap**: the
  2026-10-08 row's "sub-version capped at 9" is retired, and `tools/release/bump.ts` no longer carries
  (`0.1.9` patch → `0.1.10`, not `0.2.0`); before 1.0.0 a break is a MINOR, from 1.0.0 a MAJOR. (2) **No
  machine-specific path in a committed file** (the "machine-specific?" test, `best-practices.md` § 6); real
  paths in the gitignored `cmem/local/`. (3) The workspace ★ rules copied verbatim (`best-practices.md` § 8).
  (4) The status narrative moved from `INDEX.md` to `open-work.md`
  *Why:* (1) The workspace owner retired every cap on 2026-09-20 (drift W6: components unbounded, nothing
  carries); zailc adopted binaryang's cap on 2026-10-08 from a rule binaryang was itself to retire (drift
  X10). No version was ever bumped, so nothing released is affected. Proved by `--dry-run` on copies at
  `0.1.0`, `0.1.9`, `0.9.9` × patch/minor/major: exactly the three carry cases changed. (2)–(4) the workspace
  rules (`../cmem/working-rules.md` § Records, `memory-conventions.md`)

- **DD-26 · 2026-10-27** — 🔒 **The compatibility gate: a bump is gated, never judged** (owner: "yes add the
  bump gate"; workspace rule of 2026-09-20). zailc's surface is extracted from the source
  (`tools/release/surface.ts`) into a committed `tools/release/surface.txt`; CI fails when they differ;
  `bump.ts` refuses a bump below the floor the diff from the last release tag sets; `publish.yml` repeats it
  on the tag. Pre-1.0, a minor over a major floor needs a README Breaking Changes row. Full rules:
  `releasing.md` § "The compatibility gate"
  *Why:* "Backward compatible" was a judgment typed at bump time; now it is a measurement. Extracting from
  SOURCE TEXT, not by running `zailc-gen`, keeps the gate runnable on the Windows host (nothing zailc builds
  runs there) and on a bare CI checkout without a build. Not adopted yet: workspace rule 3 (the previous tag's
  tests against new source), recorded as a negative in `releasing.md`

- **DD-31 · 2026-10-27 (recorded here 2026-11-05)** — 🔒 **The split with zilc: steps 2 and 3 move to zilc;
  zailc builds on zilc's result** (🔁 *refined 2026-11-05: zailc is a clean-slate Zig implementation that
  reads zilc as its reference corpus, row below*) (owner, decided in zilc: *"all of zailc's build to the point
  of pure zig implemenation running in linux should be in zilc"*; *"that way they stay up to date here and the
  zailc modifications stay there. this will be the corpus of truth"* — `../zilc/cmem/design-decisions.md`,
  workspace items C22, C24). **zilc** does step 2 (Fil-C's runtime from its sources by `zig build`) and step 3
  (the pass in Zig) as its "pure-Zig track" (Z1, Z2), faithful to each Fil-C release with no departures, Linux
  x86_64 only, on the Zig whose LLVM matches Fil-C's. It brought zailc's 0.686 step-2 work over by reading
  this repo and re-verified it on Fil-C 0.687, adding what zailc never reached (yolo musl's shared half,
  2026-10-27). **zailc keeps:** its departures — exactly one today, **W-10** (`_Float16` converted correctly;
  owner 2026-10-09 "Keep the fix"); the zail language; the Zig versions past zilc's (0.17.1, DD-49 in `zig-version-path.md`
  below); and **all cross-platform work, Linux aarch64 included** (zilc stays Linux x86_64). **zailc
  inherits** zilc's abandoned P3 (a runtime written in Zig, swapped in piece by piece behind the pass's ABI),
  P4 (Zig language fidelity: Zig's pointer kinds onto Fil-C's capabilities), P5 (C++ and polish) and P6
  (platforms), with zilc's `platforms.md`, `filc-abi.md` and `tools/p3/` probes as the record to start from
  *Why:* The owner wants one "corpus of truth" for the faithful Fil-C-in-Zig build, kept current with Fil-C
  releases, and zailc's modifications kept apart from it. zailc's step-2 code and records stay here as the
  history of the 0.686 work (`roadmap.md` § Step 2); new runtime-from-source work happens in zilc. Whether
  0.687 still has W-10's `_Float16` defect is UNVERIFIED here (zilc built 0.687's compiler-rt without the
  departure)

- **DD-32 · 2026-11-05** — 🔒 **zail's first release is `0.0.1`, the MVP; until then builds are NIGHTLY**
  (owner: "zail's first release is 0.0.1 now. until then we are at nightly until we get to MVP"). Supersedes
  the 2026-10-08 🎯 first-release definition ("Fil-C fully converted to Zig", now zilc's track) and the
  planned `0.1.0` start
  *Why:* The faithful conversion is zilc's; zailc's first release is defined by its own MVP. **Follow-ups, not
  yet done (owner's go):** `build.zig.zon` still reads `0.1.0` (the version line that arms a release once the
  gate opens), so it must read `0.0.1` before the gate opens; how a nightly is numbered and published (e.g. a
  SemVer pre-release such as `0.0.1-nightly.YYYYMMDD` as a GitHub pre-release, the way Zig publishes
  `0.18.0-dev.N+hash`) is not decided; what the MVP must contain is not yet listed

- **DD-33 · 2026-11-05** — 🔒 **zailc's work, in order** (owner): **(1) the x86-64 version first** — Linux
  x86_64, zilc's platform, before any other target (aarch64 and the rest follow); **(2) a runtime written in
  Zig** (zilc's former P3); **(3) zail's grammar is TypeScript's syntax** (row below); **(4) the Zig 0.17.1
  move starts with the first nightly** (DD-49, `zig-version-path.md`)
  *Why:* Owner's ordering. The x86-64 version means zail on the platform zilc already proves, so every piece
  has zilc as its oracle; cross-platform work follows it

- **DD-35 · 2026-11-05** — 🔒 **zailc / zail is a CLEAN-SLATE implementation, written entirely in Zig on the
  latest Zig; zilc is the reference corpus it reads, never a code base it forks** (owner: "zail would be the
  full new fully zig implementation in the latest zig. zilc would be the corpus that zail refers to and gets
  its test examples from to translate into the latest version of zig"; confirmed "That is correct. Please
  record it."). zailc carries none of zilc's code or git history. It reads zilc (nothing is written there)
  for: what correct behaviour is; **its test programs and examples, translated from Zig 0.15.2 into the latest
  Zig** and checked against zilc's results before they count; its gate and corpus results; its notes
  (`Fil-C.md`, `Zig.md`, `platforms.md`, `filc-abi.md`). As zilc takes each new Fil-C release, its new tests
  and results are zailc's to translate and match. Refines the split row above: zilc still owns the faithful
  Fil-C-in-Zig track; "zailc builds on zilc's result" now means on its knowledge and tests, not its code. A
  fork sharing zilc's history (proposed and withdrawn the same day) is NOT the plan
  *Why:* **Parity is the same RESULT, not the same bytes** — zilc's own rule of 2026-11-05 ("we are looking
  for the end result being the same"): a zilc test on Zig 0.15.2 and its zailc translation on 0.17.1 cannot
  give identical binaries, so they must give the same output, exit code and safety traps. **What a clean slate
  makes larger:** (1) **the pass is zailc's own, in Zig, for LLVM 22** — nothing existing reads Zig 0.17.1's
  IR (Fil-C 0.687's pass reads LLVM 20; zilc's Z2 targets zilc's LLVM and is not started), so the first
  nightly depends on it; (2) **"fully Zig" eventually covers the runtime and the C libraries Fil-C ships**
  (musl, libc++ are very large) — the MVP must say which of them are rewritten and which are compiled from
  their C sources by zailc; (3) **translating tests is porting, not copying** — Zig's standard library and
  build API changed between 0.15.2 and 0.17.1. No history rewrite or force-push is needed: the fresh
  implementation arrives as new commits, and the 0.686 code stays in history

- **DD-36 · 2026-11-05** — 🔒 **zail's libc: a Zig libc, translated from musl FUNCTION BY FUNCTION, and only
  the functions actually used** (owner: "I prefer the function by function translation into zig, just for the
  functions being utilized. It would not be necessarry to convert the entire library if it is not being fully
  utilized"). Shape: one checked **top** in Zig — the C API programs call, exported with the C ABI and
  compiled through zailc's pass — shared by every platform, over a small per-OS **bottom**: raw system calls
  on Linux (and Android), Win32 (`kernel32`/`ntdll`) on Windows, Apple's `libSystem` on macOS/iOS (Apple's
  system-call interface is private and unstable, so the bottom there wraps `libSystem`). This mirrors Fil-C's
  own split (a checked "user" musl over an unchecked "yolo" layer). Order: Linux x86-64 first. **"Used" is
  measured, not guessed:** the undefined libc symbols of what zailc builds (zilc's translated tests first,
  then zail programs) list what to translate next; the source is Zig's bundled musl (`lib/libc/musl`), with
  Fil-C's adaptations of musl translated where its user libc differs. **Proposed (agent, pending owner): a
  function not yet translated** comes from Zig's bundled musl compiled through zailc's pass, so any program
  still links and keeps Fil-C's checks; the alternative is a link error naming the missing function
  *Why:* No full port of ~100k lines nobody calls; each translated function is checked like every other piece
  (against zilc's results). Fil-C already replaces `malloc` with libpas. C headers (`stdio.h` …) come with the
  translated functions (from musl, so musl's notice applies). libc++ sits on top of libc, so the C++ side
  needs this layer complete enough for it. Zig has itself been moving parts of its bundled C library into Zig
  — how far by 0.17.1 is UNVERIFIED; read its release notes before translating what Zig may already provide

- **DD-37 · 2026-11-05** — 🔒 **Licensing for the clean slate: the framework stays** (owner: "Yes" to
  recording it). Licences follow what is copied or TRANSLATED, not what is used: zailc's own pass in Zig
  translates Fil-C's (Apache-2.0 WITH LLVM-exception); the runtime in Zig ports libpas / Fil-C's runtime
  (BSD-2-Clause); the libc translates musl (MIT) and any of Fil-C's musl adaptations (Fil-C's notice); Zig's
  licence applies only to code copied or adapted from Zig, not to using Zig as the compiler; zilc (same
  author) needs attribution only, except tests zilc itself took from elsewhere (they keep their origin's
  licence). **Zig's bundled musl carries musl's own notice, not Zig's:** Zig's `LICENSE` is "Copyright (c) Zig
  contributors", its `lib/libc/musl/COPYRIGHT` is "Copyright © 2005-2020 Rich Felker, et al." (both read in
  this machine's Zig 0.15.2 tree, 2026-11-05; re-check in 0.17.1). The 0.686 ledger rows move to a "Retired"
  section, with the removing commit, when their files leave the tree; new rows start as clean-slate code
  arrives
  *Why:* All four licences are permissive: the obligations are notices (file headers, ledger rows, `NOTICE`
  text in binary distributions). Avoiding them would need a clean-room process (a specification written by
  someone else, implemented without reading Fil-C's code) — impractical for an AI-assisted translation that
  reads the source, and not worth it for permissive licences. Rules and texts: `licensing.md`,
  `third_party/LICENSES.md`

- **DD-38 · 2026-11-05** — 🔒 **The clean slate's upstream pins** (owner: "Yes"): **Fil-C 0.687** (the release
  zilc is on, so the release its tests and results describe, and the source zailc's pass, runtime and libc
  translate), **Zig 0.17.1**, **zilc at `v0.15.2-0.687.1`** as the corpus. The 0.686 / 0.15.2 pins in
  `upstream.md`'s table stay as the pins of the 0.686 code until it leaves the tree
  *Why:* `upstream.md` § "The clean slate's pins". `UPSTREAM-ISSUES.md` stays at its path (Fil-C's upstream
  links to it); its W-7 and W-10 entries are 0.686 findings and stay as published; new defects found while
  translating are added the same way

- **DD-40 · 2026-11-05** — 🔒 **The development stages: compiler, then C, C++, Zig, then TypeScript** (owner:
  "we would necessarily build the zailc compiler, build the c examples and make sure that they compile an
  provide the same results as zilc, then do the same for c++, and zig, before moving on to the typescript part
  of the system for compilation"). (1) build zailc; (2) C examples compile and give zilc's results; (3) the
  same for C++; (4) the same for Zig; (5) then TypeScript / zail. A stage is done only when its examples match
  zilc; the next starts after
  *Why:* The C stage is the hardest front-end stage, not the easiest: zailc's C front end must reproduce Fil-C
  clang's differences from stock clang (varargs, unions with pointers, pointer atomics; `scope.md` § Step 3,
  risk 2), and it first pulls in the runtime and the first libc functions. **The C++ stage needs a C++
  reference:** zilc's corpus had no C++ as last recorded here (2026-10-08: 78 C + 78 Zig) — check zilc's
  current tree; otherwise Fil-C's own C++ tests through stock Fil-C. Full table: `roadmap.md` § "The
  development stages"

- **DD-41 · 2026-11-05** — ❌ **Considered and DROPPED the same day: a stage 6 for Go** through an LLVM-based
  Go compiler (TinyGo, Gollvm or LLGo). Owner: "Lets add as a step 6 …", then, after the assessment, "maybe
  that was a bad idea. lets scrap that one." Do not re-propose without new facts
  *Why:* The assessment that preceded the drop (full text: `git show f5a2f2d:cmem/roadmap.md`, § "The
  development stages"): the pass could take their LLVM IR, but the cost was porting Go's runtime (its GC,
  scheduler, moving stacks, pointer↔integer casts, assembly) onto Fil-C's model, matching the LLVM version,
  and breaking the clean slate's "fully Zig" rule (the front ends are Go or C++); the gain was limited because
  Go is already memory-safe outside `unsafe` and cgo

- **DD-43 · 2026-11-19** — 🔒 **`cmem/` follows the workspace memory guide** (owner, 2026-11-17; letter H38):
  `STATE.md` read first; `INDEX.md` a router only; rules in `working-rules.md`; tables became ID'd lists
  *Why:* INDEX.md was 8.2 KB of rules, history and routes, read every session

How the memory rules changed: until 2026-11-19, INDEX.md held the policy, the triggers and the
Owner commands, with a 10 KB bootstrap limit and the status line in `open-work.md` (workspace
`memory-conventions.md`, now archived). STATE.md replaced the status line. The rules moved to
`working-rules.md` unchanged, except that the session-start pointers moved to `../workspace/cmem/`
(letters H41, H42), and the scratch-space rule (H43) was added.

