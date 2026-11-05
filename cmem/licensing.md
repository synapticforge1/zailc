# Licensing

**zailc's own code: `Apache-2.0 WITH LLVM-exception OR MIT`** (`LICENSE-APACHE`, `LICENSE-MIT`,
`NOTICE`), the same dual licence as zilc, for the same reasons (zilc's `cmem/licensing.md`): the
Apache arm is identical to LLVM's and Fil-C's compiler, so pass code moves between the trees
without relicensing; the LLVM exception keeps user binaries free of Apache §4; the MIT arm is
identical to Zig's and musl's.

**Ported code keeps its own licence.** zailc translates Fil-C's runtime (BSD-2-Clause: Apple, Epic
Games, Filip Pizlo), Fil-C's build generators (BSD-2-Clause), Fil-C's musl (MIT) and, in step 3,
the FilPizlonator pass (Apache-2.0 WITH LLVM-exception). Each ported file carries upstream's
notice in its header, and `third_party/LICENSES.md` gets a ledger row with the upstream commit.
A file whose content is *derived* from upstream data (e.g. `src/gen/signatures.zig`, generated
from the Ruby table) is treated the same as a port.

**Binary distributions.** A program linking a runtime built by zailc contains BSD-2 and MIT code,
so its documentation must reproduce those notices; `NOTICE` says so, as zilc's does.

## The clean slate (owner, 2026-11-05)

The framework above stays: zailc is a new implementation, but it TRANSLATES Fil-C, and licences
follow translation, not just copying (`design-decisions.md`, the licensing row).

| component | in the clean slate | the notice |
| --- | --- | --- |
| Fil-C's pass (`FilPizlonator.cpp`) | zailc's own pass in Zig translates it | Apache-2.0 WITH LLVM-exception, Fil-C's `LLVM-LICENSE.txt` |
| Fil-C's runtime (libpas, the filc runtime) | the runtime in Zig ports it | BSD-2-Clause (Apple, Epic Games, Filip Pizlo) |
| musl | the Zig libc translates it function by function, only the functions used (`design-decisions.md`, the libc row) | MIT, **musl's own notice** — Zig's bundled copy carries it in `lib/libc/musl/COPYRIGHT` ("Copyright © 2005-2020 Rich Felker, et al."), separate from Zig's `LICENSE` |
| Fil-C's adaptations of musl | translated where Fil-C's user libc differs from stock musl | Fil-C's notice for those changes |
| Zig | only code copied or adapted from Zig (using Zig as the compiler creates no obligation) | MIT, "Copyright (c) Zig contributors" |
| zilc | tests, examples and notes read and translated (same author) | attribution; a test zilc took from elsewhere keeps its origin's licence |

The old ledger rows (the 0.686 code) move to "Retired" in `third_party/LICENSES.md` when their
files leave the tree, with the removing commit; the files keep their notices in git history.
