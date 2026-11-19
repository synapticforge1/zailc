# review-process.md — zailc's slots in the workspace review standard

🔒 **The process is the workspace's, the same in every project** (owner, 2026-11-12: "accept the
review process and make it a standard for all projects"; letter H35):
`../workspace/cmem/review-process.md`. The owner's words "review", "security review" and "hardening review"
map to its §§ 2, 3 and 4 (and to this repo's "Owner commands" in `INDEX.md`). The floor (§ 1)
applies unchanged: fresh reviewers given the CODE, not the author's conclusions; one per area,
3–4 per round, read-only, each in its own scratch folder; findings with file:line, a concrete
scenario and MEASURED severity; each re-verified by a run before any change and fixed as its
class with an inverted test; rounds until one finds nothing, then stop. **A security review and a
hardening review are required before every release**, each ended by an empty round and recorded
in that release's entry in `release.md` BEFORE the bump. This file holds only zailc's slots (§ 7).

Written 2026-11-05/12. zailc is at the start of a clean-slate implementation (`roadmap.md` §
"The approach"): until its code exists, the slots describe the existing 0.686 tree and are
re-filled as the new compiler arrives.

## Private-data paths (§ 1.1, § 5) — reviewers never read or copy these

- `cmem/local/` (gitignored): this machine's real paths, git settings, and the pre-purge history
  bundle `zailc-pre-purge-2026-10-27.bundle`, which still holds drive paths.
- `.claude/settings.local.json` (gitignored): per-machine tool settings with machine paths.
- WSL work areas `~/zailc-work`, `~/zilc-work` (caches, oracle trees, Fil-C sources); readable as
  inputs, never quoted by path in a finding.

## The worst silent case (§ 1.2)

**A program compiled by zailc runs with a memory-safety violation that is NOT trapped** — a check
the pass should insert is missing, or a runtime or libc function lets an out-of-bounds or
use-after-free access through. It looks like a working program; it is exactly what zailc exists to
prevent. Next: **a different result from zilc's** for the same program (silent wrong output). For
the existing 0.686 tree: a generated file that differs from upstream's while its tests stay green.

## Reference results (§ 1.3.4) — re-run after each group of fixes

- **zilc's recorded results** (`oracle.md`): its gate, its corpus, Fil-C's suite — the clean
  slate's translated tests must give them (same output, exit code, safety trap).
- **The existing tree's gates** (`testing.md`): `zig build test` (SHA-256 of the generated files
  against Ruby's), `tools/release/surface.ts --check`, the tools' type-check, and the WSL-only
  oracles (`verify-*.ts`, `link-run.ts`, `corpus-run.ts`).

## CI jobs and platforms (§ 1.5)

- `ci.yml` (ubuntu-latest): `zig fmt --check`, the tools' type-check, the surface snapshot,
  `zig build test`, the `zailc-gen` smoke (header SHA, `--version`).
- `auto-tag.yml` / `publish.yml`: the release path (`release.md`); nothing released yet.
- Local: Linux x86_64 in WSL only — nothing zailc or Fil-C builds is ever executed on the Windows
  host (`best-practices.md` § 1).

## Class list (§ 2.2)

None yet: no class-by-class review has been run here.

## The seven security surfaces, for zailc (§ 3.1)

1. **Untrusted input:** source files (C, C++, Zig, zail) given to the compiler; the Fil-C source
   tree read with `-Dfilc-src`; later, packages fetched by URL into `zail-modules`. None of it is
   executed by the compiler.
2. **Malformed input:** a refusal by name (the compiler's diagnostics; `zailc-gen`'s usage, exit 2),
   never a crash or a guess.
3. **Archives and paths:** later, package fetches unpack only inside `zail-modules`; the release
   archives in `publish.yml`; an output never overwrites an input.
4. **Resources:** every tool that runs a process has a time limit; build parallelism capped to
   memory (32 parallel compiles once crashed the WSL VM, `best-practices.md` § 1).
5. **The release path:** `auto-tag.yml`, `publish.yml`, the release gate, the compatibility gate,
   provenance attestation; no GitHub CLI (H30); actions and tools pinned (`release.md`).
6. **Dependencies:** the tools' `typescript` and `@types/bun` (`tools/bun.lock`); Zig pinned;
   Fil-C pinned (`upstream.md`); licences per component (`licensing.md`,
   `third_party/LICENSES.md`).
7. **Privacy:** the scan in `best-practices.md` § 6, text and binaries, before every commit of
   memory and before every push.

## The environment matrix (§ 4.1)

Linux x86_64: WSL (Ubuntu 26.04) locally and `ubuntu-latest` in CI; the release binary is
`x86_64-linux-musl`. The Windows host runs the Bun tools only. Other platforms follow the roadmap
(Linux aarch64, then macOS/Windows, WebAssembly later).

## Records (§ 6)

| what | where |
| --- | --- |
| findings fixed or not fixed | **§ "Findings ledger" below**, one row `#n` each (zailc's workarounds stay in `workarounds.md`) |
| each round | `open-work.md` (status and done table) |
| a release's security and hardening reviews | `release.md`, that release's entry, before the bump |
| a claim found wrong | corrected in place, marked 🔁 with the date and the row |

## Findings ledger

| # | date | scope / round | finding (file:line, scenario, severity) | class | fix, test, inversion | status |
| --- | --- | --- | --- | --- | --- | --- |
| | | | *(no review run yet)* | | | |
