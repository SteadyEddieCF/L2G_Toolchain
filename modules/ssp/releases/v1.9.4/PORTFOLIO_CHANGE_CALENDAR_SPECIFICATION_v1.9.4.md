# Portfolio Change Calendar and Review-Cycle Planning Specification — v1.9.4

## Scope

The calendar derives administrative planning events from locally recorded module update dates, evidence review dates, actions, formal-review submissions, approvals, named baselines, baseline events, and change/decision-register entries.

## Timing states

- `overdue`: a due event is before the selected as-of date.
- `due-soon`: a due event is within the local due-soon window.
- `upcoming`: a due event is within the selected planning horizon.
- `later`: a due event is beyond the planning horizon.
- `historical`: a recorded lifecycle event occurred on or before the as-of date.
- `unscheduled`: no valid date is available.

## Exports

The tool exports a SHA-256-fingerprinted JSON snapshot, an event CSV, and a standards-compatible publish-only ICS file. Delivery packages include all three artifacts.

## Boundary

The calendar is local administrative planning context. It does not create remote calendar events, send notifications, impose regulatory deadlines, execute workflows, determine evidence sufficiency, create assessment findings, score readiness/risk/compliance, or make certification decisions.