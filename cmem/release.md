# release.md — how zailc is released, and every release it has made

🔒 **One place for the release record, in every project** (owner, 2026-11-10, workspace
`cmem/release-process.md` § 8 D3; letter H33): § "Release History" below, newest first, a summary
of what changed in each. The rules (version scheme, the compatibility gate, the release gate,
patch-from-branch) are in [releasing.md](releasing.md); this file is the uniform shape and the
record.

## The order (owner, 2026-11-10, D1 — every project)

**CI checks first → CI pushes the tag → the GitHub Release page from the tag → the publish.**
zailc publishes to no package registry: its release IS the GitHub Release page with the
CI-built archives (`zailc-vX.Y.Z-x86_64-linux-musl.tar.gz`, `SHA256SUMS`) and their build
provenance (a git-tag ecosystem, release-process.md § 6). Never from the owner's machine.

## zailc against the uniform shape (release-process.md § 5, measured 2026-11-12)

Each item: **slot** — zailc today.

- **U1 the go and the level** — the owner's go; `bump.ts` takes the level as an argument
  *status:* meets

- **U2 merge first, the bump its own commit** — `releasing.md` § "RULE — the version line ARMS a release"
  *status:* meets

- **U3 the bump tool** — `tools/release/bump.ts`: surface floor (the compatibility gate)
  *status:* meets the floor; the clean-tree guard (untracked files count) and previous-release tests are ⏳

- **U4 the release script** — none: pushing `main` with an untagged version releases (`auto-tag.yml`) — a
  recorded difference
  *status:* ⏳ decide before 0.0.1

- **U5 `checks` first, on the pushed commit, before any tag** — ⏳ today `auto-tag.yml` tags first and
  `publish.yml` runs the gates after
  *status:* ⏳ converge before 0.0.1

- **U6 CI creates the tag after U5** — `auto-tag.yml` creates it (with the release gate)
  *status:* order ⏳ (U5)

- **U7 the page from the tag** — `publish.yml` → `tools/release/github-release.ts` (REST API, no GitHub CLI;
  refuses a tag GitHub lacks; re-run safe; read back; rehearsed against a local fake of the API, 9/9, two
  mutants caught) — 2026-11-12, letter H30
  *status:* ✅ no GitHub CLI; H32's job order ⏳ with U5

- **U8 publish last, only its credential** — the build and `contents: write` share one job; the attestation is
  produced but not read back
  *status:* ⏳ split the job; read the attestation back through the REST attestations API

- **U9 pins** — Zig 0.15.2 exact; Bun 1.4.4 (H31, 2026-11-12); actions by major tag (`@v6`, `@v2`)
  *status:* ⏳ actions to commit hashes; Bun by sha256

- **U10 read back as a user** — the smoke test runs the binary FROM the archive
  *status:* ⏳ download the released archive in a scratch folder

- **U11 the record** — this file
  *status:* ✅

- **U12 failure: re-run, never a new or moved tag** — the page step is re-run safe (U7)
  *status:* ⏳ every job skips what is done

**Before 0.0.1** (the release gate stays `closed` until then; nothing can release meanwhile):
U3's guards, U4, U5/U6 order, U8 split and read-back, U9 hashes, U10, U12 — each a CHANGED release
job, rehearsed before it lands (workspace best-practices 7.22), landed before a release, never
during one. Also before 0.0.1: `build.zig.zon` reads `0.0.1` (it still reads `0.1.0`), and the
nightly's numbering and publishing are decided (`design-decisions.md`, the `0.0.1` row).

## Every release entry records (in this order, written BEFORE the bump)

1. Version, date, level (patch / minor / major) and the owner's go.
2. 🔒 **The security review and the hardening review** (owner, 2026-11-12, letter H35): each run
   on everything since the last release, its rounds, and the empty round that ended it
   (`review-process.md`). "release" stops if either is missing.
3. A summary of what changed (from `unreleased.md`), the breaking changes with their migration.
4. After CI: the tag's commit, the page's URL (made by `github-actions[bot]`, not a draft), the
   assets and their SHA-256, the attestation read back.

## Release History

*(newest first)*

None yet: zailc has never released. Its first release will be `0.0.1`, the MVP; nightlies come
before it (owner, 2026-11-05).
