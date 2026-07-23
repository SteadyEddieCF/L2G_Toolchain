# Module Dependency Visualization and Export Specification — v1.9.5

## Scope

The dependency center derives a read-only graph from locally stored portfolio module parent relationships and requirement inheritance source links.

## Relationships

- `parent`: structural parent-to-child module relationship.
- `inheritance`: source-to-target relationship aggregated across inherited requirement records, including requirement identifiers and recorded inheritance-state counts.

## Exports

The tool exports a SHA-256-fingerprinted JSON snapshot, an edge CSV, and a portable SVG graph. Existing delivery packages include all three artifacts.

## Boundary

The graph represents documented authoring relationships only. It is not network discovery, architecture validation, segmentation testing, evidence sufficiency, control-effectiveness assessment, readiness/risk/compliance scoring, certification, authenticated identity, digital signature, or legal custody.