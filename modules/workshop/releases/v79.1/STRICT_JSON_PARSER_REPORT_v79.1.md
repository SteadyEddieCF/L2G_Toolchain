# Strict JSON Parser Report — Workshop v79.1

The v79.1 parser scans JSON recursively before ordinary package interpretation. It maintains a per-object key set and rejects duplicate keys at the top level or any nested object. It also rejects malformed tokens, invalid escapes, non-finite numbers, trailing content, unescaped control characters, and incomplete objects/arrays.

Validated rejection cases:

- duplicate top-level `package_version`;
- duplicate nested `Practice_ID`;
- malformed/truncated JSON;
- unsupported, missing, or downgraded package version;
- incorrect package kind;
- unknown top-level property.

Every rejected input produces a blocked, untrusted preview object and leaves governed Workshop state unchanged. Script-like and traversal-like strings in declared content fields remain inert text and do not execute or trigger path access.
