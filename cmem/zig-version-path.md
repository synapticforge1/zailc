# zig-version-path.md — which Zig zailc builds on, and the rule for every Zig move

Last verified: 2026-11-19. Moved from `design-decisions.md` § "Forward path" on 2026-11-19 (letter
H38), verbatim, ID kept. The pins in force are in `upstream.md`.

- **DD-49 · 2026-10-27** — 🧭 **Develop zail on Zig 0.15.2 until zail is cross-platform; then move the base to
  Zig 0.17.0** (owner: "our current path is to develop zail on 0.15.2 until we are cross platform, then we
  will move to zig 0.17.0 base as that is the latest version … record that … so that it is forward looking").
  Extends the 2026-10-05 pin (0.15.2 until zailc produces the same as zilc): that proof comes first, the
  cross-platform work follows on 0.15.2, then the move
  *Why, and what it implies:* 0.15.2 shares LLVM 20 with Fil-C 0.686, so every piece stays checkable against
  upstream and zilc while the platforms are built. "0.17.0 is the latest" is the owner's statement of
  2026-10-27; **it bundles LLVM 22.1.8** (owner, confirmed in Zig's 0.17.0 release notes the same day: "This
  release of Zig upgrades to LLVM 22.1.8"). ⚠️ **Loop vectorization is DISABLED in Zig 0.17.0** (owner;
  release notes: "we were forced to disable a key LLVM optimization pass—loop vectorization—to work around a
  miscompilation", llvm/llvm-project#186922; the fix, PR #187023, is merged in LLVM's main branch but not in
  LLVM 22; "Zig 0.18.0 will upgrade to LLVM 23, so will allow us to re-enable this optimization pass"). For
  zailc this costs SPEED, not safety (reasoning, not measured: Fil-C's checks are inserted by the pass before
  LLVM's optimisers, and a vectorizer only reshapes code that already carries them). Two consequences:
  loop-heavy numeric code on the 0.17.0 base runs unvectorized, so any speed comparison across the move
  (0.15.2 vs 0.17.0, or zailc vs zilc) must name the Zig version and is not like-for-like; and Zig 0.18.0 is
  the release that restores it. **Owner, the same day: "lets plan on 0.17.0 for now since it just released"**
  — 0.17.0 stays the planned base despite the vectorizer; 0.18.0 is not awaited. 🔒 **Standing practice for
  every Zig move (owner): "I always wait until the zls is released before moving to the next version"** —
  zailc moves to a Zig version only once ZLS, the Zig Language Server, has a release for that version; the
  0.17.0 move included. 🔁 **Update 2026-11-05 (owner: "zig has been updated to 0.17.1"): the planned base is
  now Zig 0.17.1**, the latest 0.17 patch — released 2026-11-02 per Zig's download index
  (`ziglang.org/download/index.json`, read 2026-11-05; 0.17.0 was 2026-10-01, `master` is 0.18.0-dev). Whether
  0.17.1 changes the bundled LLVM (22.1.8 in 0.17.0) or re-enables loop vectorization is UNVERIFIED — read its
  release notes before the move; the ZLS rule applies to 0.17.1. 🔁 **Update 2026-11-05 (owner): "the zig
  0.17.1 move will start with the first nightly version"** — the move no longer waits for cross-platform: the
  first nightly is built on Zig 0.17.1 (ZLS for 0.17.1 permitting; its release is UNVERIFIED here). ⚠️ That
  puts the hard part first: Zig 0.17.1 emits LLVM 22 IR (if 0.17.0's LLVM is kept), and Fil-C 0.687's pass —
  the one zilc runs — reads LLVM 20; zilc's pass in Zig (Z2) is not started and targets zilc's LLVM. So the
  first nightly needs a Fil-C pass that accepts LLVM 22 IR: Fil-C's pass rebuilt against LLVM 22, or zailc's
  own pass in Zig taking zilc's Z2 to LLVM 22. Neither is scoped yet. **What the move will need:** two LLVM
  majors past Fil-C 0.686's LLVM 20 (Zig 0.16 already emits LLVM 21 IR that Fil-C 0.686 cannot read), so by
  then zailc's own pass (step 3) must accept LLVM 22 IR, or zilc's oracle must have a Fil-C on the matching
  LLVM; the generated `build.zig` / `build.zig.zon` follow the new build API (regenerated, `zail.json`
  unchanged); the compatibility gate's surface will show the change. "Cross-platform" means the platform list
  in `roadmap.md` § "What the platform scope … leave for zailc" — exactly which of those must work before the
  move is to be stated
