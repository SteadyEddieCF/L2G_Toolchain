# L2G Playwright QA

The initial QA foundation covers all current module HTML files through:

- HTTP-origin runtime smoke tests
- offline/network-request checks
- localStorage probes
- axe-core WCAG A/AA scans
- Playwright landing-page visual baselines
- Windows `file://` startup and persistence smoke tests

## Accessibility gate

The bootstrap gate fails on critical axe violations and publishes the complete axe result as a test attachment. Serious, moderate, and minor findings remain visible in the report and should be promoted into stricter release gates after the existing baselines are triaged.

## Visual baselines

When no committed PNG baseline exists, CI creates missing baselines and uploads them as the `visual-baseline-candidates` artifact. After review, the accepted PNG files are committed under the Playwright snapshot directory. Later runs compare against the committed baselines and fail on unexpected differences.

Never update snapshots automatically during an ordinary feature PR without reviewing expected, actual, and diff images.
