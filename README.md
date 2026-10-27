# zailc

**Zig + AI + Fil-C.**: Fil-C's memory safety for Zig, C and C++, translated into Zig step by step,
with AI-assisted development. Zig's tool chain and language syntax backbone, with AI-assisted bug
fixes and security hardening. Open book editing of the upstream tools so the upstream projects
can see what was fixed and the reasons why.

> **Status (2026-10-27): step 2 in progress, nothing released yet.** zailc grows out of
> [zilc](https://github.com/synapticforge1/zilc), which compiles Zig and C through Fil-C's pass
> and runtime and stays the stable, upstream-faithful reference and zailc's test oracle. zailc's
> first release is a toolchain whose user installs ONLY Zig and runs `zig build`. It stays on
> **Zig 0.15.2** (LLVM 20, the LLVM Fil-C 0.686 uses) until it is proven to produce the same
> output as zilc and works across platforms; the base then moves to **Zig 0.17.0**, once ZLS
> supports it.
>
> **Beyond that:** zailc becomes the compiler for **zail**, a language with TypeScript- and
> Zig-like syntax (`.zail` files) that builds projects mixing C, C++, Zig and zail with Fil-C's
> guarantees, described by one `zail.json` as in Bun and Deno. The plan: `cmem/roadmap.md`.

## What exists today

Step 2 of the brief (`cmem/scope.md`): `zig build` compiles Fil-C's runtime from upstream's
sources, starting with the pieces built by an ordinary C compiler. Fil-C's runtime build needs
two Ruby generators; a user's `zig build` may rely on Zig alone, so they become Zig.

- `src/gen/`: **the forwarder generator**, a port of Fil-C's
  `generate_pizlonated_forwarders.rb`. It writes `filc_native.h` (45 KB) and
  `filc_native_forwarders.c` (977 KB), **byte-identical to Ruby's output** for Fil-C v0.686.
  The signature tables are not typed by hand: `tools/gen/import-signatures.ts` derives them from
  upstream's file, so an upstream change is a re-run, not a transcription.
- `zig build test` proves the bytes (SHA-256 of both outputs against Ruby's);
  `bun run tools/gen/verify-forwarders.ts` proves them again against a live Ruby run.
- `zailc-gen musl-headers`: **musl's `make install-headers` in Zig** (the `yolo-include` tree
  libpas compiles against), byte-identical to upstream's, 219 files.
- `zig build libpas -Dfilc-src=<Fil-C tree>`: **the stock-compiled half of Fil-C's runtime from
  upstream's sources**, with upstream's flags, under Zig's clang: `libpizlo-stock.a` (178 objects),
  `filc_crt.o`, `filc_mincrt.o`, `libyolounwind.a`. Every object defines exactly the global
  symbols of upstream's own build (`tools/runtime/verify-libpas.ts`). Nothing is copied from or
  written into the Fil-C tree.
- `zig build yolomusl`: **yolo musl's static libraries**, `libyoloc.a` (1,343 members, upstream's
  names in upstream's order), the crt objects and `libyolom.a`
  (`tools/runtime/verify-yolomusl.ts`).
- `zig build compiler-rt`: **compiler-rt's builtins**, `libyolort.a` (167 members), `crtbegin.o`,
  `crtend.o` (`tools/runtime/verify-compiler-rt.ts`). Fil-C 0.686's `_Float16` conversions are
  wrong in upstream's build; zailc keeps the fix (`UPSTREAM-ISSUES.md`).
- In a static link every stock-compiled runtime piece is now zailc's; programs behave as with
  upstream's runtime (`tests/link` 13/13, zilc's 156-program corpus). Not yet built here: yolo
  musl's shared library, and the pieces Fil-C's own clang compiles (`filc/src`, the user libc,
  libc++).

### ⚠️ Breaking Changes

Nothing released yet. A release that removes or changes anything in zailc's surface
(`tools/release/surface.txt`: `zailc-gen`'s commands, `zig build` steps and options, the
libraries it installs, `ZAILC_*` variables, generated output) gets a row here, written when the
change lands (`_next release_` until it ships).

| Version | What changed | How to migrate |
| --- | --- | --- |

## How to run

Everything runs inside Linux (WSL2 on the development machine; nothing built here is ever
executed on the Windows host, see `cmem/best-practices.md`).

```sh
# Zig 0.15.2 is required (`zig version`).
zig build            # builds zig-out/bin/zailc-gen
zig build test       # the byte-identity tests
zig build gen -- header out/filc_native.h
zig build gen -- forwarders out/filc_native_forwarders.c
bun run tools/gen/verify-forwarders.ts       # diff against Ruby (needs ruby and a Fil-C source tree)
```

## Layout

```text
zailc/
├── build.zig, build.zig.zon   # Zig 0.15.2
├── src/gen/                   # the generators (step 2): sig.zig, signatures.zig (imported), forwarders.zig, main.zig
├── tools/                     # Bun tools: lib/tool.ts (shared), gen/import-signatures.ts, gen/verify-forwarders.ts
├── tests/link/                # programs linked against upstream's runtime and ours (tools/runtime/link-run.ts)
├── tests/upstream/            # one reproduction per upstream defect found (UPSTREAM-ISSUES.md)
├── cmem/                      # portable project memory: start at cmem/INDEX.md
├── UPSTREAM-ISSUES.md         # defects found in Fil-C, Zig or zilc, for their maintainers
└── third_party/               # staged upstream licences and the Component Ledger
```

## License

`Apache-2.0 WITH LLVM-exception OR MIT` for zailc's own code. Translated upstream code keeps its
own licence: see `NOTICE` and `third_party/LICENSES.md`.
