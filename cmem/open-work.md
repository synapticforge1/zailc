# open-work.md — what is open in zailc

Last verified: 2026-11-19. Open items only; where the project stands is `STATE.md`. Done work is
in [archive/done-before-0.0.1.md](archive/done-before-0.0.1.md).

## Open

- **S1 ▶️ Resume here: scope stage 1, build the zailc compiler** (owner, 2026-11-05). The stages
  (`roadmap.md` § "The development stages"), each done when its examples give zilc's results:
  **(1)** the zailc compiler (Linux x86-64, Zig 0.17.1); **(2)** C; **(3)** C++; **(4)** Zig;
  **(5)** TypeScript / zail. Around them: x86-64 first, a runtime in Zig as the stages need it,
  TypeScript's syntax for zail, Zig 0.17.1 from the first nightly; nightlies until the MVP, `0.0.1`.
  Nothing is scoped or started. Scoping covers: the compiler's parts on Zig 0.17.1 (front ends,
  zailc's own pass in Zig for LLVM 22 IR, LLVM's code generator); how its C front end reproduces
  Fil-C clang's differences (varargs, unions with pointers, pointer atomics); which zilc C
  examples stage 2 takes first. Method: an oracle per piece, then whole programs against zilc.
- **M1 Workspace letter H37** (2026-11-17): the review standard (H38, H41, H42, H43 answered 2026-11-19);
  the steps are `STATE.md` § Next.
- 🗓️ **Follow-ups of the 2026-11-05 release decision** (`design-decisions.md`, the `0.0.1` row):
  `build.zig.zon` reads `0.1.0` and must read `0.0.1` before the release gate opens; how a
  nightly is numbered and published; what the MVP contains.
- ⏳ **The release path converges on the workspace's uniform shape before `0.0.1`** (letters H32,
  H33; `release.md` § "zailc against the uniform shape"): checks before CI tags, the build split
  from `contents: write`, the attestation read back, actions pinned by hash and Bun by sha256, a
  user's read-back, re-run safety everywhere. The release gate stays `closed` meanwhile.
- 🗓️ **zail's memory model — five open questions** (`zail-language.md` DD-44–48; owner's rule:
  faster wherever safety allows, measured): allocation per value; immutable strings through a
  builder; readonly-by-freeze for arrays and objects; whether Fil-C makes constant globals
  read-only; WebAssembly's collector (a later target).
- ⚠️ **The first nightly needs a Fil-C pass that reads LLVM 22 IR** (Zig 0.17.1's; Fil-C 0.687's
  pass reads LLVM 20, zilc's Zig pass is not started) — `zig-version-path.md` (DD-49).
- 🗓️ **Pending owner confirmation:** the 2026-10-27 type and operator decisions (`int`/`float`,
  Zig's sized types, `\`) stay as zail's additions to TypeScript's syntax.
- **W-7's exact line** in `FilPizlonator.cpp` (surmised: `scheduleChecks`; `workarounds.md` W-7).
  Not blocking.
- 🗓️ **GitHub still serves the pre-purge commits by hash** until its own garbage collection; a
  full removal is a GitHub Support request (owner; `history-purge-2026-10-27.md`).
- ⏳ **Workspace compatibility rule 3, behaviour carried forward**: the previous release tag's
  tests run against new source before a patch or minor (`releasing.md` § "The compatibility
  gate", the negatives). Due before the first bump after `v0.0.1`.

## Workspace correspondence

The letters live in `../workspace/cmem/letters/`, one file per item (letters H41, H42); the session
routine in `working-rules.md` says when to read them. Answered and awaiting the creator's close
(open in the workspace index, 2026-11-19): H19 (2026-10-27); H30–H34 and C37 (2026-11-12).
H38, H41, H42, H43 answered 2026-11-19; H37 is open work (M1). zailc has opened one item, C28 (to zilc),
closed by zailc 2026-11-19: zilc's answer is in the letter and its rule is on its `origin/main`.
