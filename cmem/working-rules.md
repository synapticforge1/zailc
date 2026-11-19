# working-rules.md — the rules every session in zailc follows

Last verified: 2026-11-19. The standing rules, in the present tense. How a rule came to be, and
when it changed, is in [design-decisions.md](design-decisions.md). zailc is under the workspace
floor: `../workspace/cmem/working-rules.md` and `tooling-rules.md`; this repo's rules govern inside it.

## Session routine

- **Start:** read `STATE.md`, then `INDEX.md`, then `../workspace/cmem/workspace-correspondence.md`
  and only the letters in `../workspace/cmem/letters/` addressed to zailc. Then only the topic
  files STATE's "Read next" or the task names.
- **End:** rewrite `STATE.md`; move items closed this session to `archive/`; record decisions in
  `design-decisions.md` and rules here; run `bun scripts/check-cmem.ts` from the repo root and
  fix what it reports; empty this session's scratchpad of what is no longer needed (§ Scratch space).
- **Correspondence before new work** (🔒 owner, 2026-10-26): before a new work item, read every
  open letter addressed to zailc or touching what you will change; handle or record the conflict
  first. Answer by appending one bullet under `## Answers` in the letter's file (letter H41);
  only an item's creator closes it. The workspace repo is public: no machine paths in an answer.
- **Divergences:** a difference from a sibling found in a session is filed in the workspace's
  `divergences.md` in that session, with a class.

## Records

- Record decisions, state and lessons in the topic files, with the date and who decided (owner,
  or proposed by an agent and pending). Absolute dates only.
- **"update the project memory"**: revise the matching topic file, update rather than duplicate,
  then AUDIT — grep the old values across `cmem/` and `README.md`; when two files disagree,
  measure. Cross-repo lessons go to the workspace as well.
- The memory guide's limits hold (`../workspace/cmem/memory-guide.md`): INDEX.md 3 KB, STATE.md
  60 lines, other live notes 25 KB, lines 200 characters; `archive/` and `local/` unlimited.
  **One exception:** `best-practices.md` (31.7 KB, and one 201-character line in § 8) — its § 8
  is the workspace ★ block, copied verbatim, and the owner holds every ★ copy as it is until
  decided (letter H38). The check reports these two; nothing else may be left open.
- `scripts/check-cmem.ts` is a verbatim copy of `../workspace/tools/check-cmem.ts`; refresh it
  by copying, never by editing here.
- Every workaround gets an entry in `workarounds.md` WHEN IT IS MADE, with the why.
- 🔒 **No secrets or personal information in any committed file**, drive paths included: the test
  is "machine-specific?", not "absolute?" (`best-practices.md` § 6). Machine facts go in the
  gitignored `local/`.
- Never run a formatter on `cmem/`. LF line endings everywhere (`.gitattributes`).
- Every zailc commit id quoted before 2026-10-27 is pre-purge: look it up in
  `history-purge-2026-10-27.md`.

## Building and tools

- Nothing produced by Fil-C, cosmo, zilc or zailc is ever EXECUTED on the Windows host; all
  building and running happens inside WSL (`best-practices.md`).
- Tools in Bun only; no Deno, no Python, no committed shell scripts, no heredocs.
- zilc is the oracle: zailc is right when it produces what zilc (and, through it, upstream Fil-C)
  produces (`oracle.md`).
- **Regression gate:** a CHANGE to `src/`, `build.zig` or `tools/` triggers the full gate
  (`testing.md`), run on the committed tree after the last edit, reading every exit code. A
  docs-only batch does not.
- **"look for code issues"**: audit tested AND untested paths for workarounds, dead code
  (grep-verified), bugs and silent fall-throughs; report `file:line` + severity; fix the safe
  ones; diff OUTPUT, not exit codes.

## Scratch space (workspace Tooling rule 15, letter H43)

- Use only this session's own scratchpad folder; never write its path into a tracked file.
- Delete what you wrote there when its item is cleared: a one-time script after its run; a
  reproducer, clone or build output when its finding is fixed and verified; a reviewer's folder
  when its round is triaged. Nothing lives only in scratch: move what is worth keeping first.
- Budget 200 MB per session folder; announce anything larger before making it.
- "commit" ends with an empty scratchpad. Sub-agents work under the main session's scratchpad,
  and the main session removes their folders; a reviewer's brief says so.
- The WSL work area `~/zailc-work` is a cache and build area, not scratch: a session that adds a
  folder there removes it when its item is cleared. Kept there (2026-11-19, 1.8 GB): the folders the
  tools read or write (`gen`, `link`, `out`, `ref`, `tools-check`, the Zig caches) and W-7's evidence.
- Project notes live in `cmem/`, never only in the assistant's per-project memory folder.

## Owner commands: "commit", "push", "release" (owner, 2026-11-10)

🔒 Written into every project by the workspace session on the owner's direction (2026-11-10:
"please write that into each project"; workspace Tooling rule 12, letter H34). When the owner says:

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

**Three more (owner, 2026-11-12; letter H35):**
**"review"** (a targeted agent code review, its § 2), **"security review"** (its § 3, seven
surfaces) and **"hardening review"** (its § 4, seven axes). A review never commits, pushes or
releases, and stops when a round's reviewers find nothing. 🔒 **A security review and a hardening
review are required before every release**, recorded in that release's entry in `release.md`
before the bump. zailc's own slots: [review-process.md](review-process.md).
