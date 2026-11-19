# Roadmap

> Started 2026-10-08. Step 1 is zilc. Sizes and evidence: `scope.md`.
>
> 🔁 **2026-10-27 (owner; recorded 2026-11-05): steps 2 and 3 MOVED TO zilc** as its "pure-Zig
> track" (Z1, Z2 in `../zilc/cmem/roadmap.md`), faithful to each Fil-C release, Linux x86_64. The
> step 2 and step 3 sections below are zailc's record of its 0.686 work, closed; zilc continues
> them. What zailc owns now: the next section. (`design-decisions.md`, the split row.)

## 🧱 The approach: a clean slate in the latest Zig, with zilc as the corpus (owner, 2026-11-05)

zailc / zail is a **new implementation written entirely in Zig on the latest Zig** (0.17.1). It
takes none of zilc's code or history. **zilc is the reference corpus**, read and never written:

- **Tests:** zilc's test programs and examples are translated from Zig 0.15.2 into the latest Zig
  and become zailc's tests. A translation counts only once it gives zilc's result.
- **Parity is the same result, not the same bytes** (zilc's rule too): same output, exit code and
  safety traps; binaries from two Zig versions are never compared byte for byte.
- **zilc keeps moving with Fil-C**: each Fil-C release zilc takes brings new tests and results
  for zailc to translate and match.
- **Notes to start from:** zilc's `Fil-C.md`, `Zig.md`, `platforms.md`, `filc-abi.md`.

What the clean slate makes larger (`design-decisions.md`, the clean-slate row):

1. **The pass in Zig for LLVM 22 is zailc's own** — nothing existing reads Zig 0.17.1's IR — and
   the first nightly depends on it.
2. **The runtime and Fil-C's C libraries** (musl, libc++: very large) are eventually zailc's in
   Zig; the MVP must say which are rewritten and which are compiled from C by zailc.
3. **Translating tests is porting**: Zig's standard library and build API changed between 0.15.2
   and 0.17.1.

zailc's existing 0.686 code (`src/gen/`, `src/runtime/`, `tools/`) is history, not a base: the
fresh implementation arrives as new commits, with no history rewrite.

## ▶️ The order of work (owner, 2026-11-05)

Releases: **nightlies until the MVP; the MVP is the first release, `0.0.1`**.

1. **The x86-64 version first**: zail on Linux x86_64, zilc's platform (and so zilc as the
   oracle for every piece); other targets follow it.
2. **A runtime written in Zig** (below, zilc's former P3).
3. **zail's grammar is TypeScript's syntax** (the zail section below).
4. **The Zig 0.17.1 move starts with the first nightly** (the version path below) — which makes
   a pass that reads LLVM 22 IR the first hard problem.

### The development stages (owner, 2026-11-05)

Each stage is done when its examples compile with zailc and give **zilc's results** (the same
output, exit code and safety traps — `oracle.md`); only then does the next one start.

- ****1**** — **Build the zailc compiler** (Linux x86-64, Zig 0.17.1): front ends, zailc's own pass in Zig for
  LLVM 22 IR, LLVM's code generator
  *its reference:* —
  *what it first pulls in:* the pass (nothing existing reads LLVM 22 IR)

- ****2**** — **C**: zilc's C examples, translated as needed, compile and match zilc
  *its reference:* zilc's C corpus (78 programs as of 2026-10-08)
  *what it first pulls in:* ⚠️ zailc's C front end must produce what Fil-C's clang produces where it differs
  from stock clang — varargs (else musl's `printf` family breaks), unions containing pointers, pointer atomics
  (`scope.md` § Step 3, risk 2); the Fil-C runtime; the first libc functions (measured from these examples'
  undefined symbols)

- ****3**** — **C++**: the same for C++ examples
  *its reference:* ⚠️ zilc's corpus had no C++ as last recorded (78 C + 78 Zig) — check zilc's current tree;
  otherwise Fil-C's own C++ tests run through stock Fil-C, or C++ examples run through zilc's toolchain
  *what it first pulls in:* libc++ / libc++abi, exceptions and unwinding

- ****4**** — **Zig**: zilc's Zig examples, translated from Zig 0.15.2 into 0.17.1
  *its reference:* zilc's Zig corpus (78 programs as of 2026-10-08)
  *what it first pulls in:* Zig's standard library through the pass; Zig language fidelity (zilc's former P4)

- ****5**** — **TypeScript / zail**: then the zail language (TypeScript's syntax)
  *its reference:* the zail section below
  *what it first pulls in:* the zail front end, `zail.json`, `zail-modules`

A stage 6 for Go (TinyGo, Gollvm or LLGo) was considered and dropped on 2026-11-05 (owner);
the reasons are in `design-decisions.md`.

The order of work above stays: the runtime in Zig is built as stages 2–4 need it, and the libc
grows function by function from what their examples call.

## What zailc owns (owner, 2026-10-27)

zilc keeps the faithful Fil-C-in-Zig track ("the corpus of truth"); zailc, a clean-slate
implementation that reads it (section above), owns everything that departs from it or goes
beyond it — the latest Zig, other platforms:

- **Departures from upstream**, each a recorded decision with its why. Today exactly one:
  **W-10**, `_Float16` converted correctly (`workarounds.md`).
- **Cross-platform, all of it — Linux aarch64 included** (zilc stays Linux x86_64). zilc's
  `platforms.md` and its P6 are the measured record to start from: Linux aarch64's four small gaps;
  Fil-C's cosmo mode for macOS and x86_64 Windows (`statx` missing from the cosmo runtime, real
  Windows unverified); aarch64 Windows, iOS and Android last. Details: the platform section at
  the end of this file.
- **A runtime written in Zig** (zilc's former P3): replace Fil-C's C runtime piece by piece behind
  the ABI the pass calls, each piece checked against Fil-C's under the same gate.
- **A libc in Zig, translated from musl function by function — only the functions used**
  (owner, 2026-11-05). One checked top (the C API, C ABI, through zailc's pass) for every
  platform, over a per-OS bottom: system calls on Linux/Android, Win32 on Windows, `libSystem`
  on Apple. What to translate next is measured from the undefined libc symbols of what zailc
  builds (zilc's translated tests first); the source is Zig's bundled musl, plus Fil-C's musl
  adaptations where its user libc differs. Linux x86-64 first. It reaches programs through the
  project's `zail-modules` folder (`zail init` / `zail add`, below), which must cover every libc
  function a project's C code calls — translated, or its musl original compiled through the pass
  until it is (`design-decisions.md` DD-36; `zail-language.md` DD-39).
- **Compiling needs no libraries; linking and running do.** zailc compiles with its front ends,
  the pass, LLVM's code generator and, for C/C++, the headers. The programs it produces link the
  Fil-C runtime (every program), the libc (C/C++ code, and Zig/zail code that calls C) and
  libc++ (C++), all compiled by zailc, from `zail-modules`.
- **Zig language fidelity** (zilc's former P4): how Zig's pointer kinds (slices, many-pointers,
  optionals, `allowzero`, `@ptrCast`, `@intFromPtr`/`@ptrFromInt`) map onto Fil-C's capabilities.
- **C++ and polish** (zilc's former P5): libc++/libc++abi, exceptions, threads, performance.
- **Newer Zig** past zilc's (zilc stays on the Zig whose LLVM matches Fil-C's): the version path
  below.
- **The zail language**: the last section of this file.

zilc's `roadmap.md` P3–P6, `filc-abi.md` and `tools/p3/` probes are the record inherited
(read there; nothing is copied). **Start from zilc's `Fil-C.md` and `Zig.md`** (owner,
2026-10-27: "our notes on how we got to base versus zig pure parity for the zail project to build
on"): the base and its workarounds, then the pure-Zig route piece by piece (recipe, Zig build,
oracle, allowed differences, status). For linking yolo musl's shared half, zilc's W-11 records
three facts (`zig ld.lld` because `zig cc` refuses `--exclude-libs`/`--dynamic-list`;
`--exclude-libs=libyolort.a` when linking it as an archive; LLD's extra `PHDR` and GCC's
`GNU_PROPERTY` allowed by name).

## Step 2 — `zig build` compiles Fil-C's runtime from source (🔁 moved to zilc, 2026-10-27)

Everything here is checked against the oracle (`oracle.md`): same bytes where a file is generated,
same objects or same behaviour where code is compiled.

- [x] **The forwarder generator in Zig** (2026-10-08): `src/gen/`, byte-identical to Ruby for
      v0.686 (`testing.md`).
- [x] **`find_clang_include_dir.rb`**: not ported; `build.zig` will use Zig's own `lib/include`
      (DD-08, `archive/decisions-0.686.md`).
- [x] **musl's header install in Zig** (2026-10-08): `zailc-gen musl-headers` writes the
      `yolo-include` tree byte-identical to `make install-headers` (219 files; `testing.md`).
- [x] **libpas's stock half, `filc_crt.o`, `filc_mincrt.o`, `libyolounwind.a` through
      `build.zig`** (2026-10-08): `zig build libpas -Dfilc-src=… -Dpizfix=…`, upstream's flags under
      Zig's clang (`-W -Werror` clean), 178 objects; every object defines exactly upstream's
      global symbols (`tools/runtime/verify-libpas.ts`; one undefined-symbol difference, W-4).
      The quirks zilc found: `x86_64_v2` is the CPU model; `x86_64-linux-none` keeps Zig's musl
      headers out; `__cpu_indicator_init` is a LINK-time need (compiler-rt), next item.
- [x] **Link and run, C and C++** (2026-10-08): `tools/runtime/link-run.ts` links each program
      in `tests/link/` statically twice with the driver's own link line, against upstream's runtime
      and against ours (our 178 libpas objects + the tarball's five `fil-pizlo-*.o`, our
      `filc_crt.o` and `libyolounwind.a`; the tarball's libc, `libyolort` and crt files as
      scaffolding). 9 programs, 10 variants, all identical to stock: startup, stdio, heap and
      stack out-of-bounds and use-after-free traps (exit 133), allocator stress, GC, threads,
      signals, setjmp, C++ exceptions. Found and fixed on the way: the runtime's `__FILE__`
      paths (W-6). Found in upstream: a C++ exception panic at -O1 (W-7), reduced and pinned by
      `tests/link/eh_dtor_writes_global.cpp` (12/12 variants identical after it).
- [x] **zilc's corpus against our runtime** (2026-10-08): `tools/runtime/corpus-run.ts` builds
      zilc's `tests/basics` with zilc (ReleaseSafe, zilc's patched Fil-C clang, from a copy),
      takes the objects from zilc's final link line and links them against upstream's runtime and
      ours: **156/156 programs** (78 C, 78 Zig): 137 identical, 19 that vary by themselves
      (times, random numbers, thread order) with the same shape; 0 differ.
- [x] **yolo musl's static half through `build.zig`** (2026-10-09): `zig build yolomusl` builds
      `libyoloc.a` (1,343 members), `crt1.o`, `Scrt1.o`, `rcrt1.o`, `crti.o`, `crtn.o` and
      the empty `libyolom.a`. `import-yolomusl-sources.ts` evaluates the Makefile's rules (the
      member list matches upstream's name by name, in order) and takes the flags from musl's
      configure run with `zig cc`. Oracle (`verify-yolomusl.ts`): every member and crt object
      defines upstream's symbols, binding included, and has upstream's compile-unit names; the
      GCC-vs-clang residue is W-8, ratcheted. In the two-runtime oracle: `link-run.ts` 12/12 and
      zilc's corpus (`testing.md`) with our `libyoloc.a`, `libyolom.a`, `rcrt1.o`, `crti.o`,
      `crtn.o`.
- [→ zilc, ✅ there 2026-10-27 on 0.687, 1,653 exports equal] **yolo musl's shared half**: `libyoloc.so` (LOBJS + LDSO_OBJS `dlstart`/`dynlink`, linked
      `-nostdlib -shared -Wl,-e,_dlstart` with LDFLAGS_AUTO and `LIBCC` = libyolort) and
      `ld-fil1-x86_64.so` (a link to it). Needs libyolort (next item) for `LIBCC`. Oracle: the
      tarball's `libyoloc.so` (dynamic symbols) and a dynamically linked Fil-C program.
- [x] **compiler-rt through `build.zig`** (2026-10-09): `zig build compiler-rt` builds `libyolort.a`
      (167 members: upstream's names, in upstream's order), `crtbegin.o`, `crtend.o`. The sources
      and flags are compiler-rt's CMake's for Zig's clang (`import-compiler-rt-sources.ts`). Oracle:
      `verify-compiler-rt.ts` (W-8's GCC-vs-clang residue ratcheted). In the overlay: `link-run.ts`
      13/13, and zilc's corpus (`testing.md`). Fixed on the way: Fil-C's `_Float16` defect (W-10, a
      recorded departure).
- [→ zilc Z1] **The three Fil-C-compiled pieces** (`filc/src` ~2.5k lines, user libc ~102k, libc++ /
      libc++abi): through Fil-C's clang inside `zig build` as a development bridge only; they
      ship compiled by zailc's own pass (step 3). Nothing upstream-built ships (owner, 2026-10-08,
      DD-16, `archive/decisions-0.686.md`).
- [→ zilc Z1] **A Fil-C program linked entirely from `zig build`'s outputs** runs, traps out-of-bounds,
      and zilc's corpus passes against it as it does against the prebuilt runtime.
- [→ zilc Z1] **Fil-C's own test suite** against the `zig build` runtime (zilc's `run-filc-tests.ts`).

## Step 3 — the pass in Zig (🔁 moved to zilc as Z2, 2026-10-27; never started here)

All four items below are zilc's now. zailc still needs the result for the Zig move (the
DD-49 in `zig-version-path.md`): a pass that accepts the newer Zig's LLVM IR.

- [→ zilc Z2] An LLVM IR text model in Zig (parser, use lists, RAUW, retyping, printer, DataLayout),
      covering what Zig 0.15.2 and clang 20 emit, debug metadata included (~8–12k lines).
- [→ zilc Z2] The pass itself (`FilPizlonator.cpp`, 17.5k lines → ~15–20k lines of Zig), inline-asm
      allowlists and AVX-512 tables deferred (reject instead).
- [→ zilc Z2] The analyses the pass needs (DominatorTree, mem2reg, splitting, LoopInfo) plus KillUB and
      the MANDATORY DeleteRedundantPollchecks.
- [→ zilc Z2] Oracle: the same Zig module through zilc (Fil-C's pass) and through zailc's pass, compared
      as IR after the pass and as program behaviour.

## The Zig version path (owner, 2026-10-27)

> 🔁 **2026-11-05 (owner): "the zig 0.17.1 move will start with the first nightly version."**
> The move no longer waits for cross-platform: item 1 ends when the first nightly is built, and
> that nightly is on Zig 0.17.1. Needs first: a Fil-C pass that accepts LLVM 22 IR (Fil-C 0.687's
> reads LLVM 20; zilc's Zig pass is not started) — `zig-version-path.md` (DD-49).

1. **Zig 0.15.2** (LLVM 20, the LLVM of Fil-C 0.686 and 0.687; zilc's Zig): the Zig of zailc's
   existing 0.686 code and of the zilc tests zailc translates. Since the clean slate
   (2026-11-05) **the new implementation is written for the latest Zig from its first line**;
   0.15.2 is the side its tests are translated FROM. (First written as "develop on 0.15.2 until
   zail is cross-platform", 2026-10-27; then "until the first nightly".)
2. **Then the base moves to Zig 0.17.0 (now 0.17.1), with the first nightly** ("the latest version", owner), which bundles **LLVM
   22.1.8** (owner). Needs zailc's own pass to accept LLVM 22 IR, two majors past Fil-C 0.686's
   LLVM 20 (Zig 0.16 already emits LLVM 21 IR that Fil-C 0.686 cannot read). ⚠️ Zig 0.17.0
   ships with LLVM's loop vectorization DISABLED (a miscompilation workaround,
   llvm/llvm-project#186922; Zig's release notes say 0.18.0 and LLVM 23 restore it): slower
   loop-heavy code, not less safe; speed comparisons across the move must name the Zig version.
   0.17.0 stays the plan (owner: "since it just released"); 0.18.0 is not awaited.
   **Update 2026-11-05: the target is Zig 0.17.1** (owner; released 2026-11-02), the latest
   0.17 patch. The LLVM and vectorizer facts above are 0.17.0's; 0.17.1's are unchecked — read
   its release notes before the move.
3. **Every Zig move waits for ZLS** (owner's standing practice): zailc moves to a Zig version
   only once ZLS, the Zig Language Server, has a release for it.
   Details: `zig-version-path.md` (DD-49).

## The zail language (owner, 2026-10-27; first release `0.0.1` decided 2026-11-05)

Goals in the owner's words, recorded as given; nothing here is scoped, sized or started. (The
heading was "Beyond the first release" until 2026-11-05, when zail's own `0.0.1` MVP became the
first release.) zailc becomes the compiler for a language, **zail**:

- **TypeScript's syntax** (owner, 2026-11-05: "zail grammar/syntax will be typescript syntax";
  first stated 2026-10-27 as "similar to TypeScript and Zig"). Proposed, pending the owner: the
  type and operator decisions below stay as zail's additions to it (`int`/`float` and Zig's
  sized types; `\`). Source file extension **`.zail`** (first stated as
  `.zls`; changed the same day to avoid ZLS, the Zig Language Server — `zail-language.md` DD-27).
- **Classes, one `string` type, and numbers merged from C, C++, Zig and TypeScript**: inferred
  `int` (i64) and `float` (f64) for everyday code, the full Zig/C set when needed, no casts in
  loops or indexes, `/` always true division and `\` integer division (decided 2026-10-27,
  `zail-language.md` DD-28).
- **String and array functions like TypeScript's** (its standard methods on strings and arrays).
- **Compiles a mix of project files — C, C++, Zig and zail (`.zail`) — with Fil-C's safety
  guarantees** across all of them.
- **One `zail.json`, as in Bun and Deno** (decided 2026-10-27; first stated as "uses pixi"):
  manifest and build description in one file, with comments and `tasks`; `zail add` /
  `remove` / `update` edit it, `zail.lock` pins versions and hashes, and the toolchain generates
  `build.zig` / `build.zig.zon` into `.zail/`. Packages come from URLs and Git repositories, as
  Zig's do, and every dependency is built from source by zailc (`zail-language.md` DD-29, DD-30).
- **`zail-modules`, per project** (decided 2026-11-05): the libraries a program links — the Fil-C
  runtime, the libc, libc++, and every dependency — placed there by `zail init` / `zail add`
  (the role `node_modules` has for Bun and Deno), built from source by zailc, pinned by
  `zail.lock`, never committed.

No zail question is open as of 2026-10-27. Steps 2 and 3 above are the foundation: the runtime and the pass are what give
`.zail` code, like Zig and C, Fil-C's guarantees.

## What the platform scope and the cosmo evaluation leave for zailc (from zilc's `platforms.md`)

- Linux x86_64 is the host and target of everything above; Linux aarch64 next (four small gaps in
  zilc; the runtime builds for aarch64 upstream).
- Fil-C's **cosmo mode** (one APE binary for Linux, macOS and x86_64 Windows, Linux x86_64's C
  ABI) was evaluated in zilc 2026-10-05/08: Fil-C's suite passes in it, Zig programs run through
  it as ELF, as APE and under Wine; gaps: `statx` missing from the cosmo runtime; real Windows
  unverified (and not to be tried on the development machine). It is the candidate route for
  macOS and x86_64 Windows once the runtime builds from `zig build`.
- aarch64 Windows, iOS and Android are outside cosmo's reach; a native per-OS runtime remains the
  only route there, last.
- **WebAssembly (planned 2026-11-05, after the five stages).** Zig and LLVM already emit
  `wasm32-wasi`, and the pass works before the back end, so the checks come for free; the work
  is the runtime: wasm's stack cannot be read (live pointers on a shadow stack in linear memory),
  threads are optional, there are no signals and no page protection, the pass's few lines of
  x86/ARM assembly need wasm equivalents, and `setjmp`/exceptions need wasm's exception
  handling. It fits the libc design as one more per-OS bottom (WASI; Zig bundles wasi-libc). The
  gain: memory safety INSIDE the sandbox, which wasm alone does not give. Its output would run on
  this workspace's own wasm runtimes (wasmrt, wazmrt) — a cross-project item when it starts.
  Open design points: `zail-language.md` § Open.

## zail's memory model (2026-11-05): faster where safety allows

From a reviewed web discussion of the Goose memory model (`zail-language.md` DD-42, the memory-model
row). C, C++ and Zig keep Fil-C's per-object checks and collector. zail's own values use cheaper
strategies where TypeScript semantics allow — each one MEASURED against plain Fil-C objects
before it is kept:

| value | strategy | why it is safe | status |
| --- | --- | --- | --- |
| compile-time constants | static data, no allocator | live as long as the program | decided |
| strings | frozen at construction, built through a builder; exact size, packing, interning | immutable in TypeScript; reads stay bounds-checked | 🗓️ confirm |
| short values | inline, then a Fil-C object when they outgrow it (`StackFallbackAllocator` over Fil-C's `malloc`) | the large case is a full Fil-C object | default proposed |
| values that never leave their scope | arena or fixed buffer, with the library's slice checks | only if zailc can prove the scope | 🗓️ open |
| readonly arrays and objects | the string strategy, only if readonly can be made solely by freezing a builder | no writable reference survives | 🗓️ to explore |
| general objects, arrays, closures | Fil-C objects, per-object checks, collector | shared by reference in TypeScript | decided |
