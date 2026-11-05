# Vision

## In the owner's words (2026-10-05)

> A complete departure from Zig in that I will use AI in the development and we will zag where
> they zig. We will fix what they did not and cleanup what they left a mess of.

**zailc = Zig + AI + Fil-C** (owner, 2026-10-08: "the punch line states it all in one go"; it was
"Zaig" for its first three days, `design-decisions.md`). It is a new project built on Zig +
Fil-C that takes the best parts of both. It grows out of
zilc, which proved (2026-09 to 2026-10) that Zig code can go through Fil-C's pass and runtime
unchanged except for a two-line IR rewrite, and that a Zig program and a C library compiled that
way panic correctly, at a named source line, on out-of-bounds and use-after-free.

## The goal

**A toolchain whose user installs ONLY Zig and runs `zig build`, and gets Fil-C's memory safety
for Zig, C and C++.** Reached by replacing Fil-C's dependencies with Zig step by step, the way
binaryang replaced wabt and binaryen:

| step | what | state |
| --- | --- | --- |
| 1 | Zig IR → Fil-C's clang (pass + codegen) → Fil-C's prebuilt runtime | done in zilc (`0.15.2-0.686.1`; now `0.15.2-0.687.1`) |
| 2 | `zig build` compiles Fil-C's runtime from source | started in zailc 2026-10-08 (0.686); **🔁 zilc's since 2026-10-27** (its Z1, on 0.687) |
| 3 | the pass in Zig, compiled by Zig's own LLVM | scoped here (`scope.md`); **🔁 zilc's since 2026-10-27** (its Z2) |

🔁 **The split (owner, 2026-10-27):** zilc builds the faithful Fil-C-in-Zig ("the corpus of
truth"); zailc builds on it with what departs from it or goes beyond it — its departures, the
platforms beyond Linux x86_64, a runtime written in Zig, Zig language fidelity, C++, newer Zig,
and the zail language (`roadmap.md` § "What zailc owns").

**zailc becomes the compiler for zail** (owner, 2026-10-27), a language with **TypeScript's
syntax** (owner, 2026-11-05; `.zail` files), compiling projects that mix C, C++, Zig and zail with
Fil-C's guarantees; one `zail.json` (as in Bun and Deno) describes the project, and the zail
toolchain generates the `build.zig` / `build.zig.zon` that Zig needs. **zail's first release is
`0.0.1`, the MVP; nightlies come before it** (owner, 2026-11-05). The goals: `roadmap.md` § "The
zail language"; the order of work: `roadmap.md` § "The order of work".

## How zailc differs from zilc

| | zilc | zailc |
| --- | --- | --- |
| purpose | the stable, upstream-faithful reference; follows Fil-C releases and the Zig whose LLVM matches; Linux x86_64 only; since 2026-10-27 also the faithful pure-Zig build | builds on zilc's result: fixes and clean-ups where upstream left them, other platforms, newer Zig, the zail language |
| version line | `<Zig>-<Fil-C>.<release>`, moves with upstream | **Zig 0.15.2 until the first nightly, which moves to a Zig 0.17.1 base** (owner, 2026-10-27; 0.17.0 → 0.17.1 and "from the first nightly" on 2026-11-05); releases: nightlies, then `0.0.1` (the MVP) |
| role in testing | the oracle: its outputs are what zailc must reproduce | the subject |
| the pass | ported to Zig (its Z2, since 2026-10-27) | uses zilc's Zig pass; must take it to newer Zig's LLVM |
| development | | AI-assisted, with every decision and its why recorded in `cmem/` |

"Zag where they zig" is a licence to depart from upstream's design where it is a mess, not from
its behaviour: a departure is allowed once the faithful version exists and is proven against the
oracle, and each one is recorded in `design-decisions.md` with what it fixes.
