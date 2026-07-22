# Word Review Package Specification — v1.7.1

## Stable format
`cmmc-l2-ssp-word-review-v1`

## Compatibility
The format is unchanged from v1.6. A genuine v1.6-generated package is included and tested in v1.7.1.

## Traceability
Each package contains a Review Package ID, source SSP document version, application/schema metadata, source values, and field mappings. The ID appears first in the filename.

## Security
Only `.docx` is accepted. Macro/ActiveX content, embedded objects, unsafe paths, malformed XML, oversized packages, and foreign Word documents are rejected before a review queue is created.
