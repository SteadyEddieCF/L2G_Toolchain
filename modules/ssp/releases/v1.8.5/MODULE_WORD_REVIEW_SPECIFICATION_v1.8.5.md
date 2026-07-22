# Module Word Review Specification — v1.8.5

The stable Word container format remains `cmmc-l2-ssp-word-review-v1`. Module packages add `reviewScope=module`, portfolio ID, module ID, module version, and a deterministic source fingerprint.

Editable module metadata and bounded module-requirement fields are mapped through unique content-control tags. Stable IDs, hierarchy, inheritance source, approval metadata, requirement text, and assessment objectives are reference-only. Macro/ActiveX content, embedded objects, unsafe paths, malformed XML, oversized packages, foreign portfolios, and cross-module tags are rejected. Nothing is applied automatically.
