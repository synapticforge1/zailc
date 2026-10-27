# tools/

Developer tooling for zailc. Build logic stays in `build.zig`; everything else is here. **Every
tool is a Bun script** (owner rule: Bun only, never Deno, Python or shell; Deno was dropped on
2026-10-22), run the same way from Windows and from Linux:

```
bun run tools/<group>/<tool>.ts [args]
```

The tools use Bun's built-ins and `node:` modules only, so running one needs no install. The
type-check (`dev/typecheck.ts`) is the one exception: `package.json` and `bun.lock` pin TypeScript
and `@types/bun` for it, and it installs them into a copy in `$WORK`, never into this checkout.

Tools whose work needs Linux call `linuxOnly()` from `lib/tool.ts` first; on Windows that re-runs
the tool inside WSL. **Nothing a tool builds is ever executed on the Windows host**
(`cmem/best-practices.md`).

| tool | what |
| --- | --- |
| `lib/tool.ts` | the shared helper: repo root, `$WORK` (`~/zailc-work`), Zig 0.15.2 and the Fil-C source tree lookups, `run`/`must`/`show`, `linuxOnly` |
| `dev/typecheck.ts` | type-checks every tool (`tsc`, versions from `bun.lock`) on a copy in `$WORK/tools-check`; a CI step, and the same command locally |
| `gen/import-signatures.ts` | derives `src/gen/signatures.zig` from upstream's `generate_pizlonated_forwarders.rb`; re-run on an upstream change |
| `gen/verify-forwarders.ts` | runs Ruby and `zailc-gen` and compares the two outputs byte for byte |
| `gen/verify-musl-headers.ts` | runs musl's `./configure && make install-headers` (the oracle) and `zailc-gen musl-headers`, then `diff -r` |
| `runtime/import-libpas-sources.ts` | derives `src/runtime/libpas_sources.zig` from `libpas/common.mk`; re-run when the pin moves |
| `runtime/import-yolomusl-sources.ts` | derives `src/runtime/yolomusl_sources.zig`: yolomusl's Makefile rules evaluated over the tree, flags from musl's configure run with `zig cc` in a scratch copy; re-run when the pin moves |
| `runtime/verify-yolomusl.ts` | `zig build yolomusl`, then libyoloc.a member by member in order (symbols with binding, W-8's allowed undefined differences, compile-unit names) and the crt objects against the release tarball |
| `runtime/lib/objects.ts` | what the object oracles compare: archive members in order, `nm` symbol sets, source paths, compile-unit names |
| `runtime/import-compiler-rt-sources.ts` | derives `src/runtime/compiler_rt_sources.zig`: compiler-rt's CMake configure (build_compiler_rt.sh's options, zig cc) in a scratch build dir, read from build.ninja; re-run when the pin moves |
| `runtime/verify-compiler-rt.ts` | `zig build compiler-rt`, then libyolort.a member by member in order and crtbegin.o/crtend.o against the release tarball (W-8's sets, W-10's departure) |
| `runtime/verify-libpas.ts` | `zig build libpas` against the Fil-C tree, then compares every object's defined global symbols with the release tarball's `libpizlo.a`, `filc_crt.o`, `filc_mincrt.o`, `libyolounwind.a`; undefined-symbol differences must be exactly `KNOWN_UNDEF_DIFFS`, and every upstream object must have one of ours |
| `runtime/link-run.ts` | links every `tests/link/` program statically against upstream's runtime and against ours with the driver's own link line, proves from the link map which runtime each got, and compares output and exit code (`[name ...]` runs a subset) |
| `runtime/corpus-run.ts` | builds zilc's `tests/basics` (Zig and C) with zilc from a copy, links each against upstream's runtime and ours, and runs both as zilc-check.ts runs its programs (`["c zig"] [name ...]`; MODE, JOBS) |
| `runtime/lib/two-runtimes.ts` | the runtime oracle's shared half: the overlay, the two static links with the link-map proof, the panic normaliser |
| `release/gate.ts` | prints the release gate's state (`.github/release-gate`): `open` or `closed`, exit 1 on anything else; the one reader, used by `auto-tag.yml`, `publish.yml` and `bump.ts` |
| `release/bump.ts` | bumps `.version` in `build.zig.zon` (`patch` default, `minor`, `major`; SemVer, no cap, nothing carries; `--dry-run`), but only at or above the floor the surface diff from the last release tag sets, and only when `surface.txt` matches the source. Edits only; pushing the bump to `main` releases it (`cmem/releasing.md`) |
| `release/surface.ts` | zailc's public surface extracted from the source; `--check` (CI), `--write` (a re-baseline, its own commit), `--release-check <tag>` (`publish.yml`: the step from the previous tag meets the floor). Snapshot: `release/surface.txt` |

Environment: `ZAILC_ZIG` (Zig 0.15.2 binary), `ZAILC_FILC_SRC` (a full Fil-C checkout at the
pinned commit), `ZAILC_FILC_PREBUILT` (the unpacked Fil-C release tarball, the oracle for
objects), `WORK` (the Linux work area). Defaults in `lib/tool.ts`.
