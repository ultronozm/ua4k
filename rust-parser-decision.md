# Rust Parser Decision Gate

Date: 2026-03-02

## Gate Criteria

Proceed with a Rust parser only if at least one is true:
1. We need standalone static binary distribution.
2. We need materially faster compile throughput at scale.
3. We have an explicit Rust-learning objective for this project.

## Current Decision

Decision: **Do not proceed now** (defer).

Current repository evidence:
- Python compiler is feature-complete for the DSL used by shipped games.
- Golden snapshot checks and diagnostics checks are now in place for safe iteration.
- No active Rust parser source is present in this repo state.
- No demonstrated performance bottleneck in current compiler workflow.

## Revisit Triggers

Re-open this decision if any of the following change:
1. Distribution requirements call for a single static binary.
2. Compile times become a measured bottleneck on target workloads.
3. Project scope explicitly prioritizes Rust implementation/learning.

## If Revisited

Use existing compatibility harnesses as the contract:
- `python3 golden_snapshots.py check`
- `python3 parser_diagnostics.py`

Port incrementally and require parity on fixtures before expanding coverage.
