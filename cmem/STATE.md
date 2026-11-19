# STATE: zailc

Updated: 2026-11-19, at the end of the session

## Version
- Released: nothing; `build.zig.zon` reads `0.1.0` (the first release will be `0.0.1`, the MVP)
- Release gate (`.github/release-gate`): `closed`
- Working branch: `chore/memory-guide-2026-11-19`

## Now
- zailc is a clean slate: a new implementation entirely in Zig 0.17.1, with zilc as its reference corpus
- Nothing of the new implementation exists yet; the existing code is the 0.686 history, not a base
- `cmem/` migrated to the workspace memory guide (H38, all seven steps); size check clean but the held ★ copy

## Review
- Run for: none in progress
- Position: not applicable
- Open issues: 0
- Platforms passed: none yet

## Next
1. H37: rewrite review-process.md to the five classes; `review-issues.md` gitignored; `platforms.md`
2. H37 (d), (e): review set before release; tests out of CI; `surface.ts:5` pointer — own branch, rehearsed
3. Scope stage 1, the zailc compiler on Zig 0.17.1 (open-work.md § S1)

## Waiting on owner
- The `0.0.1` follow-ups: nightly numbering, what the MVP contains
- The ★ best-practices copy (held as is, letter H38)
- The pre-purge commits GitHub still serves by hash: a GitHub Support request

## Read next
- [open-work.md](open-work.md): the open items and the resume point
- [working-rules.md](working-rules.md): the session routine and the owner commands
