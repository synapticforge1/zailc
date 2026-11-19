# zail-language.md — the zail language: its decisions and open questions

Last verified: 2026-11-19. What zail is as a language (files, types, syntax, packages, memory),
as the owner decided it. Moved from `design-decisions.md` on 2026-11-19 (letter H38), IDs kept.
The goals and the order of work are in `roadmap.md` § "The zail language".

## Decisions

- **DD-27 · 2026-10-27** — 🔒 **zail source files are `.zail`** (owner: "I agree with .zail"), not `.zls` as
  first stated
  *Why:* "zls" is widely known as the Zig Language Server (ZLS), installed by nearly every Zig editor setup;
  `.zls` would be confused with it in editors, search and bug reports

- **DD-28 · 2026-10-27** — 🔒 **zail's types: one `string`; numbers merged from C, C++, Zig and TypeScript
  without casts in loops and indexes** (owner: "String is decided, that is the only type I want in zail"; "I
  agree with 1-4"). (1) **Two everyday types, inferred**: whole-number literals and counters are `int` (i64),
  anything with a fraction is `float` (f64). (2) **The full exact set when needed**, Zig's names: `i8`–`i128`,
  `u8`–`u64`, `isize`/`usize`, `f16`–`f128`, C's `c_int`/`c_long`/`c_char`/…; C, C++ and Zig declarations keep
  their true types (a C `u64` hash stays `u64`). (3) **No casts in loops and indexes**: literals adapt to
  their use (Zig's compile-time integers; an out-of-range literal is a compile error); a loop counter takes
  its type from its start and bound (`i = 0; i < arr.length` → `int`); indexing accepts any integer type, and
  a whole-valued `float` checked at run time (`2.5` traps); lossless widening is automatic; `int` mixed with
  `float` gives `float`. (4) **Explicit only for lossy conversions outside indexing**, via a checked form such
  as `int(x)` that traps; overflow traps; wrapping operators (Zig's `+%`) for hashes. **`/` is always true
  division** (`7 / 2` = `3.5`; owner: "the / for float result"); **`\` is integer division** (Visual Basic's
  operator; owner: "that would be much better"): truncating (`7 \ 2` = `3`, `-7 \ 2` = `-3`, matching `%` in
  TS, C and Zig), division by zero traps. Supersedes the same day's "`number` = f64" row and the "all
  calculations in float" idea: real integers keep exact i64 math, so there is no ±2^53 limit
  *Why:* Merges the four languages' numeric types through Zig's, which already covers C's and C++'s and shares
  zailc's LLVM. Python 3 (PEP 238), Lua, Dart and Julia all made `/` always true division after C-style
  integer `/` caused bugs; TypeScript does the same. Indexing stays safe because Fil-C bounds-checks every
  access. Integer division alternatives rejected (same day): `//` (the comment syntax of TS, C, C++ and Zig —
  `let half = total // 2` reads as both); `./` for float with `/` for integer (reverses TypeScript's `/`
  silently, Python 2's bug class; `./` is element-wise division in MATLAB/Julia); `~/` (Dart; the runner-up).
  `\` is one character, unused as an operator in TS, C, C++ and Zig, and keeps `/` as TypeScript users expect

- **DD-29 · 2026-10-27** — 🔒 **One `zail.json` is both the package manifest and the build description, as
  `deno.json` / `package.json` are; the zail toolchain GENERATES `build.zig` and `build.zig.zon`** (owner:
  "maybe build.zail and zail.json maybe the better way … using the zail toolchain to make the proper
  conversions to what zig and filc need"; then "A single zail.json can do both jobs just as it does for bun
  and deno"). The goal: "let the user add to the build.zig and build.zig.zon automatically instead of
  manually". `zail.json` holds name, version, sources, targets, dependencies, C/C++ flags and a `tasks`
  section for custom steps (Deno's `tasks`, `package.json`'s `scripts`); **comments allowed** (as
  `tsconfig.json` / `deno.jsonc`). `zail add` / `remove` / `update` / `install` edit `zail.json`;
  **`zail.lock`** holds exact versions and content hashes (`bun.lock`, `deno.lock`). The generated `build.zig`
  / `build.zig.zon` go in **`.zail/`**, regenerated on every build and never committed; they are written to
  the package root only when publishing, so plain Zig projects can consume a zail package. No `build.zail`
  *Why:* The toolchain decides how each file is compiled — Zig and zail through zailc's pass, C/C++ through
  the Fil-C front end with the right flags — instead of trusting each dependency's `build.zig`. One format
  TypeScript users know; generated files are output, never hand-edited. Superseded the same day (summary; full
  text `git show 66bf68f:cmem/design-decisions.md`): "uses pixi", then "`build.zig.zon` and `build.zig` stay
  the standard, with a generated `zail.deps.zig`" — which needed the `zig` running `zig build` to be a
  modified one, because a standard `build.zig` gives zail no say over how C is compiled. **Consequences:** (1)
  every dependency is built FROM SOURCE by zailc: Fil-C code cannot link ordinary prebuilt C libraries (its
  own pointer representation and ABI); (2) a plain Zig dependency's sources and C files are read by zail, not
  built by running its `build.zig` unchanged (that would compile its C with the stock compiler); (3) the
  generated Zig follows the pinned Zig's build API and is regenerated when the pin moves; (4) errors point at
  `zail.json`, not at generated lines; (5) two copies of one C library in a link can clash — `zail add` warns

- **DD-30 · 2026-10-27** — 🔒 **zail packages come from URLs and Git repositories, as Zig's do** (owner: "they
  will come from url and git repos just as zig does"). `zail add <url>` fetches the source, records it in
  `zail.json` and its content hash in `zail.lock`. No named registry is part of the decision
  *Why:* Zig's model: no central service to run or trust, and the content hash makes any URL safe to pin. A
  named registry (`zail add zlib`, like JSR/npm) was the alternative; it is not planned. Since zail reads a
  dependency's sources itself (row above), a C/C++ library needs no `build.zig` wrapper of its own

- **DD-34 · 2026-11-05** — 🔒 **zail's grammar/syntax is TypeScript's syntax** (owner: "zail grammar/syntax
  will be typescript syntax"). Supersedes the 2026-10-27 goal "syntax similar to TypeScript and Zig"
  *Why:* A TypeScript parser's grammar is the starting point, and TypeScript code reads as zail. **Proposed
  (agent, pending owner):** the type and operator decisions of 2026-10-27 stay as zail's additions to that
  syntax — `int`/`float` and Zig's sized types in type positions, and `\` for integer division (not a
  TypeScript operator; `/` stays TypeScript's)

- **DD-39 · 2026-11-05** — 🔒 **The libraries programs link against live in a per-project `zail-modules`
  folder, placed there by `zail init` / `zail add`** (owner: "libraries that programs could and would
  reference would need to be included in the zail-modules folder for use. That would be part of the zail
  init/zail add sytem that we will develop"). **Compiling needs no libraries; linking and running do**
  (explained to the owner the same day): zailc, like Fil-C's modified clang/LLVM, turns C, C++, Zig and zail
  into checked object code with only its front ends, the pass, LLVM's code generator and, for C/C++, the
  HEADERS (declarations). The program it produces calls code that is not in its source: **the Fil-C runtime**
  (~90 `filc_*` functions the pass inserts calls to — allocation, GC, checks, threads, signals; every program
  needs it), **the libc** (for C/C++ code and for Zig/zail code that calls C), **libc++** (for C++). These
  must themselves be compiled by zailc — Fil-C code cannot call an ordinary library (another pointer
  representation and calling convention) and an ordinary library would run unchecked — so, as Fil-C ships its
  compiler WITH a runtime, a musl and a libc++ built by it, zailc's programs get theirs from `zail-modules`.
  Closes the same day's open question on untranslated libc functions: what a program references is brought
  into `zail-modules` by the package system
  *Why:* `zail-modules` is `node_modules`'s role for zail: per project, filled from `zail.json` and pinned by
  `zail.lock`, built from source by zailc (the 2026-10-27 rule), regenerated rather than committed. The
  function-by-function Zig libc is what fills its libc module; Zig and zail code may need no libc at all (on
  Linux it can call the runtime's system-call layer directly). **Consequence to design when `zail init` /
  `zail add` are built (agent, recorded, not an owner question):** a C program can call ANY libc function, so
  the libc module a project gets must cover every function its C code references — translated ones, and until
  a function is translated, its musl original compiled through the pass — and `zail add` can report which
  functions a project uses that are not yet translated

- **DD-42 · 2026-11-05** — 🔒 **zail's memory model: choose the FASTER allocation wherever safety allows;
  every speed-up is measured, not assumed** (owner: "yes. especially if it will speed up the code produced"),
  after reviewing a web discussion of the Goose memory model (pasted by the owner 2026-11-05; written when
  zailc was still "Zaig"). Goose avoids a collector altogether — no heap, data stacks freed at scope exit,
  compile-time "root inference" that no reference outlives its owner — but only by forbidding pointer
  arithmetic, escaping closures, function pointers and dynamic dispatch, so **it cannot apply to existing C,
  C++ or Zig**, which keep Fil-C's checks and collector. **For zail itself** its ideas fit where zail's
  TypeScript semantics allow them: **strings** (immutable in TypeScript: frozen at construction, built through
  a separate builder; exact-size allocation, interning), **compile-time constants** (static data, no
  allocator), and **scoped scratch inside zail's standard library**. Not general objects and arrays:
  TypeScript shares them by reference, lets closures escape and dispatches class methods dynamically — the
  discussion's own deciding question ("may zail code hold references into zail-managed data?") answers "yes"
  there, which means Fil-C's per-object checks
  *Why:* Where the speed comes from (to be measured against plain Fil-C objects, `best-practices.md` rules on
  benchmarks): fewer Fil-C objects and less collector work — short values kept inline (Zig's
  `StackFallbackAllocator` over Fil-C's `malloc` as the default), arenas for values the compiler proves never
  leave their scope, interned frozen strings, constants without an allocator. The discussion put Fil-C's
  overhead at ~1.5–4× (its figure, not measured here). Open questions below

## Open (to decide with the owner): the memory model

- **DD-44 · 2026-11-05** — 🗓️ **Allocation per value.** The default from the discussion: Zig's
  `StackFallbackAllocator` over Fil-C's `malloc` (short values inline; everything else its own, fully checked
  Fil-C object), arenas only as an explicit standard-library tool for scratch work. Beyond that: can zailc
  PROVE a value never leaves its scope, so it can go to an arena or a fixed buffer (with the library's slice
  checks) instead of the collector?
  *Current lean:* the default first; the scope analysis only if measurements show the collector is the cost

- **DD-45 · 2026-11-05** — 🗓️ **Strings: immutable, through a builder.** TypeScript's strings are immutable,
  so a finished zail `string` is frozen from construction, and building one uses a separate builder type (as
  Goose splits growable builders from finished strings). Gains: exact-size allocation, safe packing, interning
  (no free needed under Fil-C's collector)
  *Current lean:* agent: adopt — it is TypeScript's own rule; confirm

- **DD-46 · 2026-11-05** — 🗓️ **Readonly-by-freeze for arrays and objects.** In TypeScript `const` fixes only
  the binding (`const a = [1]; a.push(2)` is legal), and `readonly T[]` is type-level only — a mutable
  reference may survive. Can a readonly array in zail be made ONLY by freezing a builder, so no writable
  reference exists? If yes, readonly arrays get the string strategy (packing, interning); if no, only strings
  and constants do. The discussion ended agreeing this needs more exploration
  *Current lean:* none — owner call, to explore

- **DD-47 · 2026-11-05** — 🗓️ **Does Fil-C make constant globals read-only memory**, so a write to a string
  literal traps? The discussion believed so but said to check Fil-C's current documentation first; it decides
  whether interned frozen values get page-level protection or only type-level
  *Current lean:* check Fil-C 0.687's docs / source before relying on it

- **DD-48 · 2026-11-05** — 🗓️ **WebAssembly as a later target, and its collector.** Planned after the five
  stages (`roadmap.md`, platform section). Fil-C's collector must find live pointers, but wasm's stack cannot
  be read: C, C++ and Zig code needs a shadow stack in linear memory; zail values on Goose-style data stacks
  in linear memory would be visible to a collector by construction (an idea, not measured). Also open: WasmGC
  or linear memory for Fil-C's capabilities, single-threaded or the threads proposal, and which runtimes (this
  workspace's wasmrt, wazmrt) support what the output needs
  *Current lean:* after the five stages; design then
