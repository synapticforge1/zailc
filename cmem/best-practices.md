# Best practices (rules of work)

Rules carried over from zilc's `cmem/best-practices.md` and from binaryang's
`cmem/best-practices.md` and `cmem/working-rules.md`, chosen for what zailc does: port Fil-C's
generators, runtime build and pass to Zig, and prove every piece against an oracle (zilc, upstream
Fil-C, the Ruby scripts). Each rule names the incident that paid for it, and the full write-ups are
in the source project. Rules about TypeScript types, WebAssembly and JSR were left behind on purpose.
Add new rules as zailc earns them: one bold rule and a citation.

Selected 2026-10-08 (owner: "copy in the ones that are relevant to our specific work product").

## 1. This machine

- 🛑 **Never execute anything built by Fil-C, cosmo, zilc or zailc on the Windows host** (owner,
  2026-10-08). The development machine runs SentinelOne. On 2026-10-05 cosmo APE files run as
  `.exe` from Claude's Windows scratchpad were quarantined and Claude Code was killed. Build, test
  and run inside WSL; the Windows half of an APE only under `wine64` inside WSL; no WinDbg on this
  machine. WSL interop is disabled (`/etc/wsl.conf`), so WSL cannot hand a process to Windows by
  accident. The why and the event-log evidence: zilc's `workarounds.md`, "Nothing built by Fil-C
  or cosmo is ever EXECUTED on the Windows host".
- **Tools are Bun scripts, and only Bun** (owner, 2026-10-22: "since deno is going away, please
  make the scripts exclusively bun scripts"; before that, Deno or Bun). Never Deno or Python;
  shell only inside `run()` argument lists. Tools use Bun's built-ins and `node:` modules, so
  running one needs no install. Bun does not type-check, so `tools/dev/typecheck.ts` is the check
  (a CI step). Pass shell text to WSL as an argument list, never inline through PowerShell
  quoting: a `grep -E "a|b"` sent inline became shell pipes, and a watcher looped on errors for an
  hour (zilc KI-1, 2026-10-01). Throwaway scripts are Bun files in the session scratchpad.
  This is the workspace rule too (🔒 owner, 2026-10-22, `../cmem/working-rules.md` § Tooling 1;
  letter H15): a COMMITTED script for repeated use is written in the repo language's own
  scripting mechanism, else TypeScript on Bun; a mechanism that has to build an executable does
  not count, so for Zig (`zig run` builds one) it is Bun. **`build.zig` and the Zig it compiles
  and runs are the build, not scripts.** A one-time script deleted after use may be anything,
  still written with the editor. No committed shell, PowerShell or `.bat` scripts; CI `run:`
  steps only launch commands.
- **`node_modules` never lives on the exFAT checkout.** Bun cannot rename its lockfile there from
  Windows (EINVAL) or link a package's bin from WSL (EPERM: no symlinks) (zailc, 2026-10-22).
  Install into a copy in `~/zailc-work`, as `tools/dev/typecheck.ts` does.
- **LF everywhere** (`.gitattributes`: `* text=auto eol=lf`), and `core.autocrlf=false` in any
  reference clone. CRLF breaks `sh` and exact-text matching. **A setting the repo doesn't carry is a
  missing file**: a fix in machine config fixes one machine (binaryang, 32 files that only failed
  locally). After adding attributes, re-materialise the tree; `git checkout-index -a -f` rewrites
  nothing.
- **Files are written with the editor tools, never with shell heredocs.** A heredoc dropped one `\`
  from Zig's `\\` multiline-string prefix (zilc, 2026-09-18); binaryang lists four ways a shell
  layer corrupts literal text. **This includes edit SCRIPTS:** a Deno script piped in through a
  heredoc lost the backslashes of the regexes it inserted, three times in one day (zailc,
  2026-10-09: `link-run.ts`, `two-runtimes.ts`, a cmem line). `deno check` (since 2026-10-22,
  `tools/dev/typecheck.ts`) or a read-back caught each one; write the script with the editor and
  run it from the file.
- **Caches and outputs live in `~/zailc-work`**, not on the exFAT repo (`workarounds.md` W-2).
- **Stopping a WSL command from Windows does not stop its Linux processes**; check `ps` in WSL
  after a timeout, and give long jobs a long timeout up front.
- **Cap build parallelism to memory, not to cores.** 32 parallel `RelWithDebInfo` clang compiles
  crashed the 31 GB WSL VM and the WSL service, twice; `-j 12` was fine (zilc, 2026-10-01).
- **Name the repo in every git command (`git -C <absolute path>`), and never chain with `;` after
  a command that can fail.** A failed `cd` let a `fetch --filter=blob:none` run in zilc itself and
  silently turn it into a partial clone (zilc, 2026-10-01).
- **When a task fails only on Windows, trace down to the CHILD command that fails and run it
  alone** (`GIT_TRACE=1`), then read the next error too (zilc KI-23).
- **Exact-match patch text must keep upstream's trailing whitespace.** The file editor trims
  whitespace-only lines, and an edit's "original" then matches nothing. Check suspicious lines
  with `cat -A`, fix them with `sed`, and mark them in the edit script. (zilc, KI-22 lever (b),
  2026-10-02: a six-space line in `FilPizlonator.cpp`.)
- **After any scripted edit, read back the lines it changed; "0 replacements" is a failure, not a
  no-op.** Never build an exact-match string from RENDERED output (indentation copied from
  `sed 's/^/  /'` failed about six edits in one session; binaryang).

## 2. Proving a port against the oracle

- **Diff the OUTPUT, not the exit code.** A gate that exits 0 while silently doing less is a
  regression (zilc; binaryang: every serious defect it had produced *valid output with the wrong
  value*).
- **The code being replaced is not the specification of the replacement.** An agreement check
  against old code proves agreement only over the cases the corpus reaches. For the cases it does
  not reach, read the CONSUMER's rule and test it directly (binaryang M8c: a copied scoping bug
  that no corpus input exercised). For zailc this means the Ruby script is the oracle for its
  outputs, and Fil-C's consumers (the runtime, the pass) are the specification for what those
  outputs mean.
- **A comparison harness gives both sides the same world.** Same environment (`env -i` and a fixed
  list), same inputs, same working-directory layout. Run the reference twice to separate "differs"
  from "varies by itself" (zilc, 2026-10-02).
- **Prove "same code" like for like, and prove the comparison can tell.** Compare against a
  reference built from the SAME input in the same form. Show the variation with a harmless
  perturbation and a deterministic control. Keep LLVM use-list order (bitcode with use-lists, no
  text round trip, no cloning) wherever machine code must match, because it changes register
  allocation (zilc KI-22 lever (a): 80+ functions "differed" until both were fixed).
- **To prove a compiler change output-identical, compare INSIDE one run, not two binaries.** Fil-C's
  pass is not reproducible under ASLR. Keep the old computation behind a switch and abort if the two
  disagree (zilc's `ZILC_VERIFY_COLOURING`). Check the BASELINE's reproducibility first
  (`setarch -R`, two runs). This applies directly to step 3.
- **A comparison prints its DENOMINATOR**: how many inputs it compared and how many it dropped, with
  the reason, on the same line as the result. binaryang's first size script printed neat totals
  over zero modules, because a wrong flag failed every upstream call. Verify a flag exists before a
  run depends on it.
- **A check that cannot make the call agrees by construction. Count what it cannot see.** When both
  sides fail the same way (the harness, not the code), report that number and treat a rise as lost
  coverage (binaryang: 24,151 SIMD invocations "agreed" by throwing on both sides).
- **Identical bytes can hide a wrong intermediate.** When a mutant survives every byte test, assert
  the stage the bytes cannot see (binaryang: a defect in the tree with no byte-level witness).
- **Find WHERE the bytes are before attributing a size or a difference.** Split it by section or
  unit and name the biggest contributor. If a total moves and no part explains it, suspect the
  harness and its defaults (binaryang: three different answers to one size question).
- **A SIZE measurement cannot answer a CORRECTNESS question.** Ask what a change PREVENTS before
  what it saves, and test that directly (binaryang: "only unoptimized" was two invalid modules).
- **Measure Debug and Release separately; re-test a fix with the optimiser off.** A fix can pass
  only because the optimiser reshaped the code (zilc KI-13), and Debug's std is different code (zilc
  KI-21).

## 3. Upstreams and claims

- **⚠️ A DEFAULT IS A VARIABLE. Vary it before declaring anything impossible.** zilc concluded
  "Zig IR cannot enter Fil-C's pass" from runs that were all in Debug mode; every Release mode
  worked (zilc P1→P2).
- **Run the cheapest experiment that can KILL the plan, first** (zilc P1: one afternoon falsified
  two of three routes).
- **⚠️ A function's NAME is not its mechanism. Open it.** `expandStackSize` was assumed to walk off
  `envp`; it forges a pointer from an integer (zilc KI-5).
- **Read the IR before believing a mechanism** (zilc KI-13). **Check for the boring explanation
  first** (a "hoisted check" was stdio buffering; zilc).
- **Before building a workaround for an upstream cost, check whether upstream already discards your
  input** (zilc KI-22: the pass erases the markers a workaround would have inserted).
- **Measure the contract before planning the port, then trace one call end to end.** `nm` turns
  "port X" into named symbols in layers, but symbol counts show SIZE, not COUPLING (zilc,
  `architecture.md`, `filc-abi.md` §6).
- **There can be TWO upstreams. Probe both before attributing a difference** (binaryang). For zailc,
  that means stock Fil-C and zilc's patched Fil-C.
- **Verify a toolchain-version claim twice: in the upstream build files AND in the installed
  binary.** **A minimum-version field is not a pin**: `minimum_zig_version` only rejects older Zigs
  (zilc KI-3).
- **A parser that ACCEPTS your input may not have understood it. Print what it produced**
  (`SemanticVersion.parse("0.15.2_3")` is patch 23; zilc).
- **When a tool rejects your input, make it tell you what it wanted** (zilc: Fil-C's data layout,
  from an error message after three guesses failed).
- **A claim about what another project does is a HYPOTHESIS.** Open its source before relying on it
  (wazmrt, via zilc).
- **Reserve a switch by refusing it, never by falling back**, so no build can claim a new path while
  quietly using the old one (zilc `--runtime zig`).
- **Verify licences per file, not per badge, and ask where the artifact goes.** The obligations
  attach to what is distributed, and Fil-C's runtime ends up inside users' binaries (zilc,
  `licensing.md`).

## 4. Investigating a defect

- **Finding a real defect at a layer is not evidence that it causes your symptom.** Vary one thing at
  a time (zilc KI-2; wazmrt: four misdiagnoses).
- **Exonerate the prime suspect before building the case on it** (zilc P2: inline asm was blamed;
  the cause was an optimiser interaction).
- **Automate the reduction, and check the interestingness test first.** Clang's driver exits 1 when
  its frontend dies on a signal, so the reducer saw no crash (zilc P2). **When a reducer leaves
  something "innocent" behind, it is missing a unit type** (zilc KI-18).
- **When something reports total failure, suspect the instrument.** Run a control first: "0
  matches" for every patch edit was line endings (zilc, 2026-10-01).
- **In a pipeline, `$?` is the LAST command's status.** Redirect to a file, check the status, then
  format (zilc).
- **A defect's record says where it SHOWED, not where it LIVES.** Reproduce from the record's example
  and trace to the origin before editing the component it names (binaryang Q9).
- **Attribute every residual by looking at it**; a count that "mostly" fits a story is not an
  attribution (binaryang K4).

## 5. Tests and gates

- **Invert every new test or gate. Break the thing on purpose and see it fail FOR THE RIGHT
  REASON.** A test for a fix is not coverage until it fails without the fix, and it must fail on
  the BOUNDARY: include cases on both sides and read which ones flip (binaryang: four fixtures
  passed with the fix reverted; 5 of 7 cases flipped, and that split was the evidence). Assert that
  the broken build BUILT (zilc via wazmrt: an inversion that does not compile looks like one nothing
  caught).
- **Commit before mutating; target a mutant by CONTENT, not line number; print its diff.** A
  restore to the last commit discarded uncommitted work, and a shifted line meant a mutant changed
  nothing (binaryang).
- **A gate that only PRINTS its verdict is not a gate.** Every gate exits non-zero on failure. Read
  each step's EXIT CODE, never `| tail -1` (binaryang: the lesson recurred three times the day it
  was written, until the command changed).
- **Run the gate on the COMMITTED tree, after the LAST edit.** If an edit follows the gate, the gate
  has not run (binaryang decision 5). **When CI exists, the local gate is CI's gate**, read from the
  workflow file.
- **A green suite is evidence about the tests, not the code.** "0 failed / 0 skipped" is not
  "everything ran": count what errored before producing results. Before trusting a gate for a
  feature, find an input in it that HAS the feature (zilc; binaryang: half the suite collected,
  exit 0).
- **A harness that RUNS code has a timeout, and a mutant runner checks its restore byte for byte**
  (binaryang: a mutant loop hung for 10 minutes with the mutated file left in place).
- **A harness that captures a program's output keeps stdout and stderr in ONE stream** (`> f 2>&1`;
  `tools/lib/tool.ts` `run()` does `exec "$@" 2>&1`). With two pipes, the line order changes from
  run to run (zilc, 39_logging, 2026-10-05).
- **Every generated input a recorded result depends on needs its exact recipe written down, next
  to the tool that reads it.** Commit small inputs; for big ones, record the command and a checksum
  (zilc, tiny-ni2.ll, 2026-10-05: recipes recovered by trial, inputs copied from a vanished
  scratchpad).
- **A recorded count is a claim. Re-derive it, then make it RATCHET** (a budget the gate checks), so
  that it cannot go stale silently (binaryang).
- **Make every edit, gate and guard fail loudly when its target is absent.** Prefer "fail if absent"
  over "act if present", and enumerate from the source, not by hand (binaryang: seven no-ops that
  all reported success). **One authoritative enumeration**: a list written a second time drifts,
  and falling behind produces SILENCE (binaryang `walk.ts`). zailc's imported signature table is
  this rule applied.
- **A one-time check script is a gate too: invert it before trusting its "0 differ".** The text
  check of the ★ block first reported 28/28 identical while comparing only each rule's FIRST line
  (a `$` under the regex `m` flag ends at every line end); a one-word mutant in a continuation line
  passed it. Fixed and re-inverted: mid-rule and last-line mutants both caught (zailc,
  2026-10-27). The same day the path scan flagged the `C:/Users/<user>/` placeholder as a hit — a
  verification pattern must be judged against the rule it checks, then narrowed, not trusted.
- **Fix the class, not the instance, then guard the class** (binaryang: the `--version` drift fixed
  by a sync test, not by a corrected constant).

## 6. Records (`cmem/`)

- **Write down the thing you only said out loud.** Project knowledge lives in `cmem/`, which
  survives a clone (binaryang).
- **Decisions go in `design-decisions.md` with the date and who decided**; proposals are marked as
  proposed until the owner confirms. **Owner calls stay owner calls**: gather the evidence and
  stop (binaryang).
- **An upstream defect (Zig, zilc, Fil-C) is documented in full before it is worked around or
  fixed** (owner, 2026-10-08): what it is, why it is a defect against upstream's OWN contract,
  and how it was confirmed with upstream ALONE (reduction, controls, a committed reproduction in
  `tests/upstream/`), published in `UPSTREAM-ISSUES.md` ONLY (nothing is filed upstream; upstream
  references the file). Only then the workaround or fix
  (`workarounds.md` § "How to write an entry"; W-7 is the worked example).
- **Every workaround gets its why-notes when it is made** (`workarounds.md`), with measured facts
  and surmises kept apart and what was ruled out listed. **A reopen condition is not
  self-checking**: re-test it when you price the entry (zilc).
- **Every port gets a ledger row and keeps upstream's notice in the file** (`third_party/LICENSES.md`).
- **A written result is a CLAIM. Compare it to the artifact.** Check a commit's effect with
  `git show <sha> -- <path>`, not its message (binaryang: a "pin to 132" commit that left 116).
- **When a fix lands, update EVERY record it closes in the same commit**, and re-check each label
  before listing anything as open (zilc KI-10/KI-17).
- **A stale rationale is worse than none.** When a reason expires, re-state why the rule still holds
  or drop it (binaryang).
- **When work completes, summarize it in cmem; do not accumulate it.** Name what landed, its commits,
  and where the substance lives, with a `git show <commit>:<path>` pointer to the replaced text.
  Never summarize away decisions or open items. **Retarget every reference** (code and tools cite
  cmem by path and heading) in the same commit (binaryang).
- **Open-items lists cover zailc only**; closed topics are dropped, not re-listed in another form.
- 🔒 **No secrets or personal information are ever made public** (workspace owner rule,
  2026-10-22; full text `../cmem/working-rules.md` § Records). Everything committed is public,
  `cmem/` included. Never in a committed file, commit message, release, issue or PR: tokens,
  keys, passwords; email addresses, machine names, private account names; **personal drive
  paths**. **The path test is "is it machine-specific?", not "is it absolute?"** (owner,
  2026-10-23; workspace letter H22): not public is any path that records the owner's machine
  layout (a user profile, the drive and folder the projects live in, other drives, scoop or
  AppData installs, a scratchpad or session id, and the WSL `/mnt/<drive>/…` view of any of
  them); fine are repo- or sibling-relative paths (`../zilc`), env vars,
  placeholders (`<user>`, `<repo-root>`), home-relative work areas (`~/zailc-work`), and a
  CONVENTION path that names nothing about one machine (`C:\zig-cache\<repo>`). A scan hit is a
  candidate, judged by that test. **The one exception: the maintainer contact email** (owner,
  2026-10-23/26; letter H28) — as the git commit author/committer address, in a registry
  manifest field if zailc ever publishes to a registry (it publishes GitHub Releases only), and in
  ONE committed `cmem/` note naming the maintainer contact (zailc has none and needs none).
  Nowhere else. Real paths and other machine facts go in the gitignored `cmem/local/`
  (`git check-ignore -v` before the first write). **Before committing, scan the diff**, text AND
  binaries: `git grep -n -i -E '[A-Za-z]:[\\/]+(Programs|Users|scoop|tools)[\\/]|/[a-z]/(Programs|Users)/'`,
  once with `-I` and once with `-a`. A secret that reached the remote is ROTATED, not just deleted.
  History is purged of personal information as well (owner, 2026-10-22; letter H19): zailc's
  was purged on 2026-10-27 (`history-purge-2026-10-27.md`, with the old → new id map). The scan
  also matches the `C:/Users/<user>/` placeholder: a candidate, judged fine by the test.
- **Never run a formatter on `cmem/`.** `deno fmt cmem/<file>` rewrapped 862 lines around a 10-line
  edit and renumbered IDs (binaryang). Edit cmem by hand and keep lines under 100 columns.

## 7. Git

- **Branch, commit, then `git merge --no-ff` to `main`**, docs-only changes included (binaryang:
  two direct commits to `main` led the owner to have the history rewritten). Confirmed for zailc
  by the owner, 2026-10-08: a push of `main` is also a release (`auto-tag.yml`), as in binaryang
  ([releasing.md](releasing.md)).
- **When another session shares the working tree, never switch branches in it and never commit a
  file whole if it holds their hunks.** Build the commit in a temporary index (`GIT_INDEX_FILE`,
  `read-tree HEAD`, `hash-object -w` + `update-index --cacheinfo` with only your hunks,
  `commit-tree`), create the merge with `commit-tree -p main -p <branch>`, move `main` with
  `update-ref` (giving the old value), then `git reset -q -- <your paths>`. Their edits stay
  uncommitted and untouched (zailc, 2026-10-08, commit `b01f05d`).
- **Commit messages go through a file** (`git commit -F <file>`) written with the file tools, never
  a heredoc or a double-quoted `-m`. Every message ends with the session's attribution line.
- **Merged branches are KEPT, never deleted** (owner, 2026-10-08: "keep the branches"): each
  one is the record of a piece of work, next to its `--no-ff` merge.
- **Prefer a new commit over `--amend`.** **Nothing is pushed unless the owner says so.**
- **A re-baseline (a new reference hash or oracle output) goes in its OWN commit**, with the reason
  in the message (binaryang).
- **Nothing is ever written into a sibling repo (zilc, binaryang) from this one.** Draft the note
  for it and hand it over. Verify a sibling from a scratch copy (binaryang).
- Release rules: [releasing.md](releasing.md).

## 8. The workspace ★ rules (copied verbatim)

The convergent rules of the workspace this repo sits in (owner, 2026-09-20: every repo carries
them; workspace letter H26). They are copied, never edited here: a change is made in the
canonical file and re-copied. Section numbers are the canonical file's; the gaps are its non-★
rules, which are not copied. Proof of the copy: a text comparison of all 28 rules (number +
normalized text), not a count. Where a rule repeats one in §§ 1–7 above, both stand: the ones
above carry zailc's and zilc's own incidents.

Copied from synapticforge1/cmem/best-practices.md on 2026-10-27

### §1 Evidence and measurement

- **1.1 ★ An exit code is not evidence; diff the OUTPUT counts, per file.** Exit-0 runs silently
  dropped passes in four repos; binaryen-ts's serious defects were valid wasm with the wrong value;
  wabt-ts's `wat2wasm` silently deleted an instruction. [wabt-ts + binaryen-ts + wazmrt + wasmtk + wasmrt]
- **1.2 ★ A green suite is evidence about the tests, not the code.** The fuzzer had zero `makeLoad`
  / `makeBreak`; `deno test tests/` collected 513 of 908 and exited 0. [binaryen-ts + wabt-ts]
- **1.3 ★ Re-derive before quoting any number; a count in prose is a dated claim.** Counts were
  cited eight days stale; artifacts doubled while "smallest binary" was the goal; three commit
  messages contradicted their own diffs. [every repo]
- **1.4 ★ When the corpus can move, the denominator is a measurement, and a comparison must print
  it.** The failure total matched on both sides by coincidence after +4 files; four totals were
  computed over zero modules because `--enable-all` is not a `wasm-opt` flag. [wasmrt + binaryang]
- **1.11 ★ Validate the harness against a known positive; an extreme number is evidence about the
  harness, and a broken harness can score BETTER.** 1937/1937 failing; give it an input it must
  fail on. [wabt-ts + binaryen-ts]

### §2 Gates and tests

- **2.1 ★ A new test that has never failed has not been shown to test anything: invert it and
  watch it fail for the RIGHT reason.** A baseline probe appended a WAT comment and could not fire;
  deleting the release guard left twelve tests green; a mutant caught by a different check is a bad
  mutant. [wazmrt + wabt-ts + binaryen-ts + binaryang + wasmtk]
- **2.3 ★ A gate that cannot fail is decoration; a gate with no trigger, a goal with no gate, a
  gate that only prints, and a property asserted in a doc comment are all preferences.** `| tail`
  swallowed the oracle monitor's status; `check-bridge-corpus.ts` exited 0 either way; "exhaustive
  over `Op`" ended in `_ => return None` and shipped four ungated ops. [wazmrt + wasmrt + binaryang]
- **2.4 ★ The local gate must BE CI's gate: read the steps from the workflow file.** 65 unpushed
  commits were red by CI's standard; `tasks.md` went binary to grep from NUL bytes because the
  hygiene gate was scoped to what the compiler reads, not what the workflow reads. [binaryang + wabt-ts]
- **2.16 ★ A change's own new surface is the one place the audit that produced it will not look —
  re-run the governing audit against the new members before landing.** The `--update-baseline` path
  OOMed; the day's own suites passed throughout six silent CLI regressions. [wazmrt + wasmrt + wasmtk]

### §3 Producer/consumer pairs and oracles

- **3.1 ★ A round trip proves agreement with yourself; when a bug is visible only to a third party
  the test has to BE a third party — hand the bytes to an outside reader as a GATE, not a habit.**
  Legacy EH: wabt-ts parsed it, V8 ran it, wasi 417/417 green, wasmtime rejected all ten modules;
  `(ref any)` emitted as an internal tag byte and `try_table`'s label off by one in assembler,
  validator and interpreter alike — wasmtime refused both in one afternoon. [wazmrt + binaryen-ts + wabt-ts + wasmrt + wasmtk]
- **3.2 ★ Agreement between components that learned the convention from each other is not
  evidence, and there can be three.** Decoder and encoder shared a catch-depth off-by-one; every
  round trip was byte-identical and green. [binaryen-ts + wabt-ts + wazmrt + wasmrt]
- **3.3 ★ Producer/consumer pairs are the recurring blind spot; fix the gap, not a post-process
  workaround, and pin both directions.** T13.22 cancelling off-by-ones across a repo boundary,
  invisible for four releases; fixing one direction turned silent accept into loud reject. [binaryang + wazmrt + wabt-ts]
- **3.8 ★ A stale vendored snapshot is indistinguishable from live data without recorded
  provenance: stamp source + date in the change that creates it, and never let a check read an
  artifact it did not just produce.** A 2020 `proposals/threads/` snapshot was filed against us; a
  frozen 272-file copy filed seven "invalid" modules that run clean; a size gate read yesterday's
  artifact. [wabt-ts + wasmtk + wasmrt + wazmrt]
- **3.10 ★ A claim about another project's code is a hypothesis until you grep their source; a
  stated BENEFIT is a hypothesis about someone else's code.** "wabt-ts accepts try_table" (the
  writer could not encode it); the wasm-c-api "drop-in" payoff never existed — the loaders use
  `wasmtime_*`. [wasmtk + wasmrt + wazmrt]

### §4 Where defects hide

- **4.1 ★ One authoritative enumeration; a second copy drifts into silence; one reader per grammar
  production, and a production has more than one site.** `deepCopy` covered 29 of 79 kinds; the heap
  type table existed three times; a private `skip_const_expr` refused two valid modules; reftype was
  read as valtype at the table-type site for the project's whole life. [binaryen-ts + wabt-ts + wasmrt + wazmrt]
- **4.2 ★ A value read and discarded is a decision; a wrong decode made harmless by a guard in
  another file is a load-bearing coincidence.** `r.readU32(); // table index`; three reserved bytes;
  `br_on_cast` flags, the elemkind byte, element flags `8`. [binaryen-ts + wabt-ts + wasmrt]
- **4.3 ★ Silent-wrong output is the worst class and where every serious defect has been: ask "what
  would a wrong answer look like?" first, and prefer a hard error over a stub.** A feature can be
  decoded, validated, printed and never execute (the start function, five releases). [wasmrt + wasmtk + wabt-ts]
- **4.16 ★ A rationale expires; the code it justified does not: a comment justifying a deviation
  names the authority it defers to; "by design" and "out of scope" age badly by definition; a stale
  rationale is worse than none.** "Mirroring the oracle" survived the oracle's retirement five weeks;
  the `import.meta.main` ban's reason expired while the rule stayed right for another reason.
  [wasmrt + wazmrt + binaryang]

### §5 Investigating

- **5.1 ★ Prove, do not assume: prove the REASON, not just the answer; UNVERIFIED is a legitimate
  status.** Four read-not-verify claims were wrong when run; a `--features` alias rationale was
  right by luck. [wazmrt + wasmrt]
- **5.2 ★ Identify the LAYER before naming a cause; the stage that REPORTS a failure is usually
  not the stage that caused it; finding a real defect at a layer is not evidence it causes your
  symptom — vary one thing.** "Memory-grow ordering" was decoder reordering; a symptom caused by the
  development drive's FILESYSTEM (exFAT) was diagnosed wrong three times. [wazmrt + binaryen-ts + wasmtk + wasmrt]

### §6 Recording and claims

- **6.1 ★ A written result is a CLAIM: a commit message, a status line, a doc of a safety guard, a
  contract row verified by reading. Compare it to the artifact; put a pin where the tool enforces
  it.** `8d9ba0cb9` (was `b8fafaa3f` before binaryang's 2026-10-23 purge; corrected here 2026-10-26, ledger C8) said "pin to 132" and left 116; prose has no failure mode. [binaryang + wabt-ts + wasmrt]
- **6.2 ★ Write down the thing you only said out loud; write the negatives (what was varied, what
  held fixed), the calibration, and what you did NOT check; distinguish clean / measured /
  UNMEASURED.** Knowledge that exists only in a conversation is operationally identical to
  knowledge nobody has. [wabt-ts + binaryang]
- **6.3 ★ Record findings that were WRONG so they are not fixed again; a retraction re-checks the
  REASONING, not the requirement; a correction is a dated claim too; a reopen condition is not
  self-checking.** [wazmrt + wasmtk + binaryen-ts + wabt-ts]

### §7 Tooling that lies

- **7.1 ★ Do not author file CONTENT through a shell heredoc; scripts go in files, always; commit
  messages through `-F <file>`.** Four corruption modes (escapes eaten, long commands truncated,
  backticks substituted, `$$` templates), five corruptions including a NUL byte in `.gitattributes`;
  broken five times by the rule's own author. [binaryang + wasmtk + wazmrt + wasmrt]
- **7.2 ★ When the exit code IS the measurement, do not pipe.** `deno fmt --check | tail -1`
  committed a failing check; `| tail -20` swallowed the oracle monitor. [wasmtk + wasmrt + wabt-ts]
- **7.3 ★ A change that silently does nothing is indistinguishable from one that worked: prefer
  "fail if absent" over "act if present"; edit scripts assert each match exactly once; read back;
  omission is not reset.** Seven no-ops in one register (replace without asserting the target, an
  omitted workspace key, a `--dry-run` that bumped). [binaryang + wazmrt + wasmrt]
- **7.6 ★ Line endings: pin in `.gitattributes` wildcard-first; measure with a positive control;
  never fix with `git config`; test inputs whose bytes feed a digest are never whitespace-trimmed.**
  `grep -c '\r'`=140, `grep -c $'\r'`=0, `grep -cU $'\r'`=184 on the same file. [wasmtk + binaryang + wazmrt + wasmrt]

### §8 Working across repos

- **8.1 ★ Read freely, write never: nothing is written into a sibling's tree — not its source, not
  its `cmem/`, not its copy of the contract — unless the owner directs that write, and then it is
  logged in both memories.** Two destructive overwrites on 2026-08-19; a commit that laundered
  authorship. [wasmrt + wazmrt + binaryang + wabt-ts]
