# cmem — Portable Project Memory for zailc

**At session start, read `../cmem/workspace-correspondence.md` for open items addressed to this
repo, then the letter it points to in `../cmem/handoffs.md`** (the workspace pull line; zailc has
no `CLAUDE.md`, so it lives here, as in binaryang and wazmrt). Then
[open-work.md](open-work.md): **where things stand and where to resume.**

This folder is the **authoritative, portable project memory** for zailc. It lives inside the project
tree, travels with it and is **committed to git**. Plain Markdown, one focused topic per file, kept
small. Modeled on zilc's `cmem/` (same author), which is modeled on wazmrt's. Since 2026-10-26
zailc is under the workspace floor (`../cmem/working-rules.md`, `memory-conventions.md`,
`best-practices.md`); this repo's own rules govern inside it.

**Policy (binding on every agent):**
- Read this file at session start. Record decisions, state and lessons in the topic files, with
  the date and who decided (owner, or proposed by an agent and pending).
- **This index stays one line per file; no status narrative here.** The status line lives once,
  in `open-work.md`. Bootstrap (this file) stays under about 10 KB.
- Every workaround gets an entry in `workarounds.md` WHEN IT IS MADE, with copious notes on the why.
- Nothing produced by Fil-C, cosmo, zilc or zailc is ever EXECUTED on the Windows host; all building
  and running happens inside WSL (`best-practices.md`).
- LF line endings everywhere (`.gitattributes`); tools in Bun only (owner, 2026-10-22: Deno is
  going away); no Deno, no Python, no committed shell scripts, no heredocs.
- 🔒 **No secrets or personal information in any committed file**, drive paths included: the test
  is "machine-specific?", not "absolute?" (`best-practices.md` § 6). Machine facts go in the
  gitignored `local/`.
- zilc is the oracle: zailc is right when it produces what zilc (and, through it, upstream Fil-C)
  produces (`oracle.md`).
- Never run a formatter on `cmem/`.

## Triggers

1. **"update the project memory"** — revise the matching topic file, refresh its line here,
   absolute dates, update rather than duplicate. Then AUDIT: grep the old values across `cmem/`
   and `README.md`; when two files disagree, measure. Cross-repo lessons go to the workspace
   (`../cmem/`) as well.
2. **"look for code issues"** — audit tested AND untested paths for workarounds, dead code
   (grep-verified), bugs and silent fall-throughs (the worst class); report `file:line` +
   severity; fix the safe ones; diff OUTPUT, not exit codes.
3. **Correspondence before new work** (🔒 owner, 2026-10-26) — before a new work item, read every
   open row of `../cmem/workspace-correspondence.md` addressed to zailc or touching what you will
   change; handle or record the conflict first. Only an item's creator closes it.
4. **"divergence"** — a difference from a sibling found in a session is filed in
   `../cmem/divergences.md` in that session, with a class.
5. **Regression gate** — a CHANGE to `src/`, `build.zig` or `tools/` triggers the full gate
   (`testing.md`), run on the committed tree after the last edit, reading every exit code. A
   docs-only batch does not.

## Files

| file | what |
| --- | --- |
| [open-work.md](open-work.md) | **Status (the one place), the resume item, what is open, done work summarized with merge commits, letters answered** |
| [scope.md](scope.md) | **The brief** (from zilc's `zig-filc-scope.md`, 2026-10-05): the three steps sized, step 2's piece table, step 3's shape, costs and risks (steps 2–3 are zilc's since 2026-10-27) |
| [vision.md](vision.md) | What zailc is for, in the owner's words, how it differs from zilc, and the zail language after the first release |
| [design-decisions.md](design-decisions.md) | The decisions table (name, Zig pin, zilc as oracle, byte-identical outputs, WSL-only, licence, Bun tools, a push to `main` releases, the compatibility gate, the zail language's types, operators and `zail.json`, …), the split with zilc (2026-10-27), the open questions (zailc's first release and next work item), and the **forward path** (Zig 0.15.2 → 0.17.1, the ZLS rule) |
| [roadmap.md](roadmap.md) | **The approach** (a clean slate in the latest Zig, zilc as the reference corpus), the order of work, **what zailc owns**; steps 2 and 3 as the 0.686 record (moved to zilc); the Zig version path; the zail language goals; what the cosmo evaluation and platform scope leave for zailc |
| [oracle.md](oracle.md) | How zilc and Fil-C serve as the oracle: trees, versions, hashes, the comparison procedure (zailc's results are 0.686's; zilc is on 0.687) |
| [upstream.md](upstream.md) | Pinned Fil-C (v0.686, `163fae5`) and Zig (0.15.2, then 0.17.1); where they live in WSL |
| [releasing.md](releasing.md) | 🔖 Release rules (from binaryang, 2026-10-08): SemVer 2.0.0, first release `0.0.1`, no cap, merge unbumped then bump on the owner's go, the release gate, patch-from-branch, preflight, CI-only binaries |
| [release.md](release.md) | **The release record** (owner, 2026-11-10): the uniform order, zailc slot by slot against the workspace's release shape, what converges before `0.0.1`, and § "Release History" (newest first) |
| [review-process.md](review-process.md) | zailc's slots in the workspace review standard ("review", "security review", "hardening review"; owner, 2026-11-12) and its findings ledger |
| [unreleased.md](unreleased.md) | What `main` holds beyond the last release; becomes `CHANGELOG.md` § version at release |
| [testing.md](testing.md) | The gates and their last results |
| [workarounds.md](workarounds.md) | Every workaround and its WHY (template, families); look new failures up here first |
| [best-practices.md](best-practices.md) | Rules of work: this machine, proving a port, upstreams, defects, gates, records (incl. the privacy rule), git; § 8 the workspace ★ block, copied verbatim |
| [licensing.md](licensing.md) | Dual licence, and why a translation project must keep upstream's notices on every ported file |
| [history-purge-2026-10-27.md](history-purge-2026-10-27.md) | The drive-path purge of git history (H19): method, verification, and the **old → new commit-id map** for any id quoted before 2026-10-27 |
| `local/` | Gitignored, absent in a clone: this machine's real paths and local git settings (`environment.md`) |

## Owner commands: "commit", "push", "release" (owner, 2026-11-10)

🔒 Written into every project by the workspace session on the owner's direction (2026-11-10:
"please write that into each project"; workspace `cmem/working-rules.md` Tooling rule 12, letter
H34). When the owner says:

- **"commit"** — first run "update the project memory files" (re-derive this repo's `cmem/` from
  its current state), then commit to the branch being worked on. Nothing is pushed.
- **"push"** — perform "commit", then merge the branch into `main`, then push `main` (and the
  working branch) to GitHub (`origin`) and read it back with `git ls-remote`.
- **"release"** — perform "push", then the release process: the workspace's
  `cmem/release-process.md` §§ 5–8 — CI checks first, then CI pushes the tag, then the GitHub
  Release page from the tag, then the publish to the registry — recorded in `cmem/release.md`
  § "Release History" (newest first, a summary of what changed). The level (patch / minor /
  major) is the owner's: ask if it was not given.

Each command includes the one before it, and none goes further than its own word (a "commit"
never pushes, a "push" never releases). This repo's own gate and merge rules apply at each step.

**Three more (owner, 2026-11-12; workspace `cmem/review-process.md`, letter H35):**
**"review"** (a targeted agent code review, its § 2), **"security review"** (its § 3, seven
surfaces) and **"hardening review"** (its § 4, seven axes). A review never commits, pushes or
releases, and stops when a round's reviewers find nothing. 🔒 **A security review and a hardening
review are required before every release**, recorded in that release's entry in `release.md`
before the bump. zailc's own slots: [review-process.md](review-process.md).
