# history-purge-2026-10-27.md — drive paths removed from zailc's git history

🔒 Owner, 2026-10-27: "yes perform the history purge" (workspace letter H19: personal information
is purged from history, "a necessary thing for security", 2026-10-22). Paths only: the
maintainer address on commits is allowed and was not touched (owner, 2026-10-26).

## What was rewritten and how

- **Found** (2026-10-27, `git grep -a` over every commit of every ref): all 63 commits carried at
  least one drive path, in three files, since the first commit. Three families, exact strings
  (as rewritten, so this file names none of them): the zilc checkout under the WSL
  `/mnt/<drive>/…` view in `cmem/oracle.md` (63 commits) → `../zilc`; the binaryang checkout
  under a Windows drive in `cmem/releasing.md` (62) → `../binaryang`; a user profile's Zig cache
  in `cmem/workarounds.md` W-9, both slash styles (13 + 13) → `C:/Users/<user>/` and
  `C:\Users\<user>\`. Commit messages and author/committer fields carried none. No tags existed.
- **Backup first:** `git bundle create … --all` (30 refs, `bundle verify` ok), kept in the
  gitignored `cmem/local/` of the development checkout — it still holds the paths, so it never
  leaves that machine.
- **Rewrite:** `git filter-branch --index-filter` over every local branch (`--branches`, 25),
  replacing those strings INSIDE the blobs that held them (`cat-file` → replace →
  `hash-object -w --no-filters` → `update-index --index-info`). No checkout, so no line-ending
  normalisation could change any other byte. A `--commit-filter` logged the map below. No
  `git filter-repo` (it needs Python; workspace rule).
- **Verified** (2026-10-27): 0 of 67 rewritten commits match the scan (the same pattern finds 63
  in the old refs: the positive control); every commit pair differs in EXACTLY the files whose old
  version had a hit, by exactly the hit lines (oracle +63/−63, releasing +62/−62, workarounds
  +26/−26); author, committer, dates and messages identical on all 67 (`git log` formats
  compared byte for byte); `main`'s tip tree unchanged (`9f33902…`), because HEAD was already
  clean.
- **Published:** `main`, `step2/stock-runtime` and `docs/state-2026-10-08` (the three branches
  on `origin`) were force-pushed with `--force-with-lease` together with the commit that adds this
  file; the other 22 kept branches were never pushed and still are not. Then `refs/original`
  deleted, reflogs expired, `gc --prune=now`.
- **What a rewrite cannot reach:** GitHub keeps serving the old commits by hash until its own
  garbage collection; a full removal is a GitHub Support request (🗓️ OWNER). Any other clone
  still has the old history: re-clone, never push from it. Commit MESSAGES that quote an id
  (e.g. a range in a merge message) keep the old id: look it up below. No release, tag or
  provenance record names any of these commits (nothing was ever released).
- Quoted ids in `cmem/` were moved to the new ids in the same commit (29 places, each the prefix
  of exactly one old commit).

## Old → new (oldest first)

| old | new | date and subject |
| --- | --- | --- |
| `8a733384a` | `b032b4dba` | 2026-10-08 First publish |
| `7530556f8` | `49df2b03e` | 2026-10-08 docs(cmem): release rules from binaryang; best practices from zilc and binaryang; LF attributes |
| `15ab7689e` | `b01f05d50` | 2026-10-08 merge: release rules, best practices and LF attributes (docs/release-and-practices) |
| `ba03e493c` | `2fc9912c1` | 2026-10-08 ci: a push to main releases, as in binaryang (auto-tag, publish, CI) |
| `821e25aa9` | `f2e1b29cf` | 2026-10-08 merge: a push to main releases (ci/release-workflows) |
| `ce5c373f9` | `46914a9e3` | 2026-10-08 Step 2: the stock half of Fil-C's runtime builds from zig build; musl headers in Zig |
| `92ec73da1` | `70ede2a72` | 2026-10-08 merge: step 2, the stock half of the runtime from zig build (step2/stock-runtime) |
| `668e652d2` | `5cb39b104` | 2026-10-08 cmem: git state at the end of day one (remote, unpushed main, pushed branch, next push releases) |
| `c7e9be893` | `435ff8825` | 2026-10-08 merge: cmem state at the end of day one (docs/state-2026-10-08) |
| `d71385dfc` | `719df52ae` | 2026-10-08 verify-libpas: ratchet the undefined-symbol differences; fail on an upstream object not built |
| `ec87a08c1` | `3e8bcdb58` | 2026-10-08 cmem: day-one review fixes (pin move covers step 2; the ratchet recorded; git state checkable) |
| `729184522` | `1ba9204fc` | 2026-10-08 merge: day-one review fixes (fix/day-one-review) |
| `3d25a76e5` | `cdd7fe0d2` | 2026-10-08 Step 2, link and run: tests/link + link-run.ts; upstream's source paths in the runtime (W-6) |
| `d402824a1` | `d93db5e4e` | 2026-10-08 verify-libpas: the source-path form rule is "relative and resolving from libpas/" |
| `43896d4ff` | `cfc4c9f5b` | 2026-10-08 link-run: variants per program (`// expect: exit N with <flags>`); exceptions pins W-7 |
| `07ab11a24` | `6b7a7fcf3` | 2026-10-08 link-run: prove the overlay CONTENT, not its path |
| `68cf735bc` | `5e4e4ebc6` | 2026-10-08 cmem: first release only after the full conversion (owner); link and run recorded |
| `51907fdcf` | `b8807e2cc` | 2026-10-08 merge: step 2, link and run for C/C++ (step2/link-and-run) |
| `f2ab73fb0` | `904edcce9` | 2026-10-08 release gate: main can take finished branches; nothing releases until the owner opens it |
| `983937821` | `6b4972719` | 2026-10-08 cmem: the release gate recorded (decision; releasing; state lines; tests) |
| `a75acda6b` | `b3314487e` | 2026-10-08 merge: release gate (release/gate) |
| `3fe9a8652` | `3b104f168` | 2026-10-08 cmem: main pushed; the first GitHub run proves the closed gate (no tag, no release) |
| `d11ef52b1` | `d4b894347` | 2026-10-08 merge: state after the first push (docs/first-push) |
| `0559f3f3e` | `c1966d7a2` | 2026-10-08 tools: the two-runtime link in one module; corpus-run.ts; deno check in CI |
| `6e010819b` | `514662ecf` | 2026-10-08 cmem: zilc's corpus against our runtime, 156/156 (link and run done) |
| `f17d64bf2` | `9530f6800` | 2026-10-08 merge: step 2, zilc's corpus against our runtime (step2/zilc-corpus) |
| `678c23835` | `aa3e54f36` | 2026-10-08 Upstream defects: documented in full before any workaround or fix (owner); W-7 to that standard |
| `f6db93832` | `8861e2c00` | 2026-10-08 merge: upstream-defect rule and W-7 (docs/upstream-defects) |
| `7e8b83406` | `d002b153f` | 2026-10-08 Upstream defects are published in UPSTREAM-ISSUES.md only (owner) |
| `4e6c6354a` | `84ad363ea` | 2026-10-08 merge: UPSTREAM-ISSUES.md is the only place upstream defects are published (docs/upstream-issues-only) |
| `3ceff2644` | `f23df2b32` | 2026-10-08 cmem: paused for the day (owner); where things stand and where to resume |
| `235b33344` | `6ba789489` | 2026-10-08 merge: pause 2026-10-08 (docs/pause-2026-10-08) |
| `bd52eac28` | `a00efc849` | 2026-10-08 cmem: merged branches are kept (owner) |
| `7b202606b` | `b77f1b838` | 2026-10-08 merge: keep merged branches (docs/keep-branches) |
| `c831c0dc6` | `d61129f54` | 2026-10-09 W-5 fixed: the musl tree's files are declared inputs of the headers step |
| `ac3dac55c` | `1d2231125` | 2026-10-09 W-7 cause confirmed (IR and predictions); W-5 recorded as fixed |
| `7d515b0ea` | `5306f0cb4` | 2026-10-09 merge: W-7 cause confirmed, W-5 fixed (fix/w7-cause-w5-input) |
| `4f8263232` | `987516689` | 2026-10-09 zailc-gen --version: build.zig.zon's version, the Zig that built it, the Fil-C tables' release |
| `07bce1548` | `864937f49` | 2026-10-09 cmem: zailc-gen --version recorded (releasing, INDEX, testing, unreleased) |
| `b4ab5191e` | `8b6e06478` | 2026-10-09 merge: zailc-gen --version (feat/zailc-gen-version) |
| `9ecbc7222` | `d78b7c89e` | 2026-10-09 Step 2, yolo musl: libyoloc.a and the crt objects from zig build; the order-and-symbol oracle |
| `3a9a17fee` | `2d6b73b1f` | 2026-10-09 verify-yolomusl: compare compile-unit names (the M2 mutant survived the __FILE__ check) |
| `9a5f57893` | `24c543fc4` | 2026-10-09 Step 2, yolo musl in the two-runtime oracle: link-run 12/12 with our libyoloc.a and crt objects |
| `fe49ba709` | `1e569cb58` | 2026-10-09 corpus-run: thread-order programs compared as the same lines in any order; verify-libpas on lib/objects.ts |
| `c060923d8` | `5be74f883` | 2026-10-09 corpus-run: programs printing the clock to the second are always compared by shape |
| `dbd614ad5` | `f5d45730c` | 2026-10-09 cmem: yolo musl's static half recorded; corpus-run: 53_random-numbers is clock-seeded |
| `41e19ec24` | `b5388be46` | 2026-10-09 merge: step 2, yolo musl's static half (step2/yolomusl) |
| `94435d41f` | `5211581fc` | 2026-10-09 Step 2, compiler-rt: libyolort.a, crtbegin.o, crtend.o from zig build; the _Float16 upstream issue |
| `82827fcc7` | `650145003` | 2026-10-09 compiler-rt in the two-runtime oracle; recorded departures in link-run (W-10) |
| `6120df563` | `3b5fdfac2` | 2026-10-09 link-run: count only departures that passed in the summary (M2 showed the miscount) |
| `0be1c8daf` | `69067f261` | 2026-10-09 cmem: compiler-rt recorded; W-9 (env forwarding) and W-10 (the _Float16 departure) |
| `7a7d7e782` | `5b74041ed` | 2026-10-09 merge: step 2, compiler-rt (step2/compiler-rt) |
| `8e8bc3f22` | `f0ffaa585` | 2026-10-09 cmem: W-9 left a stray Zig cache in the repo root before the fix; removed |
| `565e72af6` | `9f01c49e5` | 2026-10-09 merge: W-9 cleanup note (docs/w9-cleanup) |
| `c7ea7d240` | `f03104fe1` | 2026-10-09 cmem: W-9 note, restore the backslash a shell heredoc dropped |
| `bb5519862` | `6dee7ea01` | 2026-10-09 merge: W-9 note fix (docs/w9-fix-escape) |
| `7b7079a04` | `06f49f9b9` | 2026-10-09 cmem: paused for the day (owner); the handoff for 2026-10-09 |
| `d3ee8ee50` | `73035674e` | 2026-10-09 merge: pause 2026-10-09 (docs/pause-2026-10-09) |
| `fb50b5f99` | `a6eccf403` | 2026-10-22 tools: Bun only; Deno is dropped (owner) |
| `5ceec5b60` | `e32c1b718` | 2026-10-22 cmem: Bun port verified, every gate and the type-check's inversions |
| `228bcd6ae` | `2e0e65020` | 2026-10-22 merge: tools in Bun only, Deno dropped (tools/bun) |
| `950bab54e` | `2d2c7b311` | 2026-10-22 docs: the repository moved to github.com/synapticforge1/zailc |
| `ab5ce21a2` | `f194fc901` | 2026-10-22 merge: the repository moved to synapticforge1 (docs/repo-move) |
| `58791b80e` | `9a83dfd67` | 2026-10-27 docs+tools: conform to the workspace floor (letter H26) |
| `465223e35` | `dacd426e7` | 2026-10-27 merge: conform to the workspace floor (docs/workspace-floor) |
| `d23f5d842` | `1bef451ab` | 2026-10-27 tools: the compatibility gate - a bump is gated, never judged |
| `db5f44293` | `1455c1629` | 2026-10-27 merge: the compatibility gate (feat/bump-gate) |
