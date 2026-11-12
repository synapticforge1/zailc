# Upstream

## The clean slate's pins (owner, 2026-11-05)

| upstream | pinned | its role |
| --- | --- | --- |
| **Fil-C** | **v0.687**, tag `v0.687` = `2db72c6` (released 2026-10-23; LLVM 20.1.8) | the source zailc's pass, runtime and libc translate; the release zilc's tests and results describe |
| **Zig** | **0.17.1** (released 2026-11-02; 0.17.0 bundled LLVM 22.1.8 with loop vectorization off — 0.17.1's unchecked) | the Zig the clean-slate implementation is written for; the move waits for ZLS (`design-decisions.md` § "Forward path"); its bundled musl (`lib/libc/musl`) is the libc's translation source |
| **zilc** | **`v0.15.2-0.687.1`** (released 2026-10-27) | the reference corpus: tests and examples translated into Zig 0.17.1, results to match (`oracle.md`) |

Nothing of the clean slate is written yet, so nothing in the tree reads these pins yet. A move of
any of them is recorded here with its date.

**What Zig 0.17 breaks, measured by loader-zig on its move to 0.17.1** (workspace item C37,
2026-11-08; `../cmem/handoffs.md`, loader-zig's notes; loader-zig `f417f71`): five removed APIs and
their 0.17 forms — `@cImport` → `b.addTranslateC` (module import `"c"`); `b.args` →
`Run.addPassthruArgs()`; `Run.addPathDir` → the run's env map (`getEnvMap` +
`setEnvironmentVariable("PATH", …)`); `b.pathFromRoot` → `b.root.joinString`; `@typeInfo`
records → `field_names` / `field_types`, `decl_names`, `param_types`, `attrs`, `error_names`,
`field_values`. Also: **code after a comptime-known `return` is analyzed in 0.17**, so a trailing
`@compileError` fires. For zailc: the clean slate is written for 0.17.1 from its first line, so
these matter where zilc's 0.15.2 tests and zailc's `build.zig` code are translated; and **a gate
that builds an OLD tag with today's toolchain** (the compatibility gate's previous-release tests,
`releasing.md`) can fail because the old tag no longer builds — not because anything regressed.

## The 0.686 code's pins (the existing tree)

| upstream | pinned | why this one | where |
| --- | --- | --- | --- |
| **Fil-C** | **v0.686**, commit `163fae598eaf249b74065b0156f3a7e7ba8c0e5a` | the release zilc `0.15.2-0.686.1` is built on; LLVM 20.1.8 | `tools/lib/tool.ts` `FILC_VERSION` / `FILC_SHA`; trees listed in `oracle.md` |
| **Zig** | **0.15.2** | bundles LLVM 20.1.2, the same major as Fil-C 0.686, so IR is exchangeable; owner: pinned until zailc is proven equal to zilc | `build.zig.zon` `minimum_zig_version`; binary in `oracle.md` |
| **zilc** | `main` at or after `ba4d72b` (2026-10-08, a pre-purge id: zilc rewrote its history 2026-10-27, map `../zilc/cmem/history-map-2026-10-27.md`) | the reference; its `cmem/` holds the history zailc's brief came from; since 2026-10-27 also the faithful pure-Zig build zailc builds on | sibling folder `../zilc` |

**Fil-C 0.687** (released 2026-10-23, tag `v0.687` = `2db72c6`, the same LLVM 20.1.8) is zilc's
release since 2026-10-27 (`v0.15.2-0.687.1`; workspace C23). zailc's pin above stays 0.686: its
step-2 code and results are the 0.686 record, and new runtime work against Fil-C releases happens
in zilc's track. The clean slate uses 0.687 (the table above); these 0.686 pins stay until the
0.686 code leaves the tree.

## Moving the pins

- **Fil-C:** in this order, all inside WSL:
  1. Change `FILC_VERSION` and `FILC_SHA` (`tools/lib/tool.ts`) together; point
     `ZAILC_FILC_SRC` and `ZAILC_FILC_PREBUILT` at the new tree and the new release tarball.
  2. Re-run the importers: `tools/gen/import-signatures.ts` (`src/gen/signatures.zig`) and
     `tools/runtime/import-libpas-sources.ts` (`src/runtime/libpas_sources.zig`, from
     `common.mk`), `tools/runtime/import-compiler-rt-sources.ts` (`src/runtime/compiler_rt_sources.zig`;
     it also fails if build_compiler_rt.sh's options changed) and
     `tools/runtime/import-yolomusl-sources.ts` (`src/runtime/yolomusl_sources.zig`:
     it also fails loudly if the Makefile rules it evaluates changed). Review the diffs: they are
     upstream's changes.
  3. (No cache clear needed since 2026-10-09: the `musl-headers` step declares the musl tree's
     files as inputs, so a new tree reruns it; `workarounds.md` W-5.)
  4. Re-measure the reference hashes in `oracle.md` and `src/gen/forwarders.zig` (a re-baseline
     is its own commit), then run every oracle gate: `tools/gen/verify-forwarders.ts`,
     `tools/gen/verify-musl-headers.ts`, `tools/runtime/verify-libpas.ts`,
     `tools/runtime/verify-yolomusl.ts`, `tools/runtime/verify-compiler-rt.ts`, then `link-run.ts`
     and `corpus-run.ts`. Re-check every recorded departure (W-10): a new release may have fixed it.
  5. Revisit `verify-libpas.ts`'s `KNOWN_UNDEF_DIFFS`. The ratchet fails on any new or vanished
     undefined-symbol difference; give each new one a `workarounds.md` entry before listing it.

  Upstream's generator and tables change between releases (0.686 added `zsys_clock_adjtime`,
  `zsys_abort` and the keyctl family, per zilc's review of 0.686).
- **Zig:** not before the owner's condition is met (zailc produces the same as zilc). Zig 0.16 moves
  to LLVM 21 IR, which Fil-C 0.686 cannot read, so a Zig move implies step 3 done or Fil-C on
  LLVM 21 (zilc's `design-decisions.md`, 2026-10-05). 🧭 **The path (owner, 2026-10-27):** stay
  on 0.15.2 until the first nightly (2026-11-05; first "until zail is cross-platform"), which
  moves the base to **Zig 0.17.1** (0.17.0 bundled LLVM 22.1.8; 0.17.1, released 2026-11-02, the target since 2026-11-05) (`design-decisions.md`
  § "Forward path").

## What upstream's files look like, for the pieces ported so far

- `libpas/src/libpas/generate_pizlonated_forwarders.rb` (852 lines): a signature table (`addSig`,
  `addOutSig`) and two emitters chosen by `ARGV[0]`, which must be exactly
  `src/libpas/filc_native.h` or `src/libpas/filc_native_forwarders.c` (it writes to that relative
  path). `common.mk` runs it twice per build; `filc_runtime.o` and `filc_start_program.o` depend on
  the header. Dead code in it: `unsignedType`, `canonicalArgType` (never called). Quirk kept:
  the header's `#endif` comes before `PAS_END_EXTERN_C;`.
- `libpas/find_clang_include_dir.rb` (54 lines): touches `fake_c_file.c`, runs
  `clang -### -c fake_c_file.c`, prints the first `-isystem`-style path containing `stddef.h`.
  Used only as `HOST_CLANG_EXTRA_FLAGS = -isystem ...` in `libpas/Makefile`.
