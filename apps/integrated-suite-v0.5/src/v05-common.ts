namespace L2G {
  export type V05AssertedBy = PresentationProfile | "migration" | "system" | "import";
  export type V05Confidence = "not-evaluated" | "low" | "medium" | "high";

  export interface V05Provenance {
    source_kind: string;
    source_id: string;
    source_label?: string;
    source_location_ref: string | null;
    asserted_at: string;
    asserted_by: V05AssertedBy;
    confidence: V05Confidence;
  }

  export const V05_VISIBILITIES: readonly Visibility[] = Object.freeze([
    "advisor-only",
    "client-safe",
    "approved-for-client-presentation"
  ]);

  export const V05_REVIEW_STATES = Object.freeze([
    "not-requested",
    "pending",
    "in-review",
    "reviewed",
    "changes-requested",
    "closed"
  ] as const);

  export function createV05Provenance(
    sourceKind: string,
    sourceId: string,
    timestamp = nowIso(),
    assertedBy: V05AssertedBy = "system",
    confidence: V05Confidence = "not-evaluated",
    sourceLabel?: string,
    sourceLocationRef: string | null = null
  ): V05Provenance {
    const output: V05Provenance = {
      source_kind: sanitizePlainText(sourceKind, 120),
      source_id: sanitizePlainText(sourceId, 300),
      source_location_ref: sourceLocationRef === null ? null : sanitizePlainText(sourceLocationRef, 300),
      asserted_at: timestamp,
      asserted_by: assertedBy,
      confidence
    };
    if (sourceLabel !== undefined) output.source_label = sanitizePlainText(sourceLabel, 300);
    validateV05Provenance(output, "Provenance");
    return output;
  }

  export function canViewV05(visibility: Visibility, profile: PresentationProfile): boolean {
    if (profile === "advisor" || profile === "reviewer") return true;
    return visibility === "client-safe" || visibility === "approved-for-client-presentation";
  }

  export function deepFreezeV05<T>(value: T): T {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreezeV05(child);
    return value;
  }

  export function assertV05ExactKeys(value: unknown, expected: readonly string[], label: string): asserts value is Record<string, unknown> {
    if (!isRecord(value)) throw new Error(`${label} must be an object.`);
    const actual = Object.keys(value).sort();
    const wanted = [...expected].sort();
    if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
      throw new Error(`${label} contains missing or unsupported fields.`);
    }
  }

  export function requireV05Record(value: unknown, label: string): Record<string, unknown> {
    if (!isRecord(value)) throw new Error(`${label} must be an object.`);
    return value;
  }

  export function requireV05Array(value: unknown, label: string, maxItems: number): unknown[] {
    if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
    if (value.length > maxItems) throw new Error(`${label} exceeds the v0.5 collection limit.`);
    return value;
  }

  export function requireV05String(value: unknown, label: string, maxLength: number, allowEmpty = false): string {
    if (typeof value !== "string") throw new Error(`${label} must be a string.`);
    const cleaned = sanitizePlainText(value, maxLength);
    if (cleaned !== value) throw new Error(`${label} contains unsupported control characters or exceeds its limit.`);
    if (!allowEmpty && cleaned.trim().length === 0) throw new Error(`${label} is required.`);
    return cleaned;
  }

  export function requireV05NullableString(value: unknown, label: string, maxLength: number): string | null {
    if (value === null) return null;
    return requireV05String(value, label, maxLength, true);
  }

  export function requireV05Id(value: unknown, prefix: string, label: string): string {
    const text = requireV05String(value, label, 160);
    if (!new RegExp(`^${prefix}_[A-Za-z0-9][A-Za-z0-9_-]{0,140}$`).test(text)) throw new Error(`${label} is not a valid ${prefix} identifier.`);
    return text;
  }

  export function requireV05Iso(value: unknown, label: string): string {
    const text = requireV05String(value, label, 40);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(text) || Number.isNaN(Date.parse(text))) throw new Error(`${label} must be an ISO-8601 UTC timestamp.`);
    return text;
  }

  export function requireV05Date(value: unknown, label: string, allowEmpty = true): string {
    const text = requireV05String(value, label, 10, allowEmpty);
    if (text === "" && allowEmpty) return text;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(`${text}T00:00:00Z`))) throw new Error(`${label} must be a YYYY-MM-DD date.`);
    return text;
  }

  export function requireV05Integer(value: unknown, label: string, minimum: number, maximum: number): number {
    if (typeof value !== "number" || !Number.isInteger(value) || value < minimum || value > maximum) throw new Error(`${label} must be an integer from ${minimum} through ${maximum}.`);
    return value;
  }

  export function requireV05Enum<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
    if (typeof value !== "string" || !allowed.includes(value as T)) throw new Error(`${label} contains an unsupported value.`);
    return value as T;
  }

  export function requireV05Boolean(value: unknown, label: string): boolean {
    if (typeof value !== "boolean") throw new Error(`${label} must be a boolean.`);
    return value;
  }

  export function requireV05StringArray(value: unknown, label: string, maximum: number, itemLimit = 300): string[] {
    const items = requireV05Array(value, label, maximum);
    const output = items.map((item, index) => requireV05String(item, `${label}[${index}]`, itemLimit));
    ensureV05Unique(output, label);
    return output;
  }

  export function ensureV05Unique(values: readonly string[], label: string): void {
    if (new Set(values).size !== values.length) throw new Error(`${label} contains duplicate values.`);
  }

  export function validateV05Visibility(value: unknown, label: string): Visibility {
    return requireV05Enum(value, V05_VISIBILITIES, label);
  }

  export function validateV05Provenance(value: unknown, label: string): asserts value is V05Provenance {
    const record = requireV05Record(value, label);
    const allowed = ["source_kind", "source_id", "source_label", "source_location_ref", "asserted_at", "asserted_by", "confidence"];
    const required = ["source_kind", "source_id", "source_location_ref", "asserted_at", "asserted_by", "confidence"];
    const keys = Object.keys(record);
    if (keys.some(key => !allowed.includes(key)) || required.some(key => !(key in record))) throw new Error(`${label} contains missing or unsupported fields.`);
    requireV05String(record.source_kind, `${label}.source_kind`, 120);
    requireV05String(record.source_id, `${label}.source_id`, 300);
    if (record.source_label !== undefined) requireV05String(record.source_label, `${label}.source_label`, 300, true);
    requireV05NullableString(record.source_location_ref, `${label}.source_location_ref`, 300);
    requireV05Iso(record.asserted_at, `${label}.asserted_at`);
    requireV05Enum(record.asserted_by, ["advisor", "client", "reviewer", "migration", "system", "import"] as const, `${label}.asserted_by`);
    requireV05Enum(record.confidence, ["not-evaluated", "low", "medium", "high"] as const, `${label}.confidence`);
  }

  export function validateV05ReferenceArray(value: unknown, label: string, maximum = 200): string[] {
    const refs = requireV05StringArray(value, label, maximum, 160);
    for (const ref of refs) {
      if (!/^[A-Za-z][A-Za-z0-9_-]*_[A-Za-z0-9][A-Za-z0-9_-]{0,140}$/.test(ref)) throw new Error(`${label} contains an invalid typed reference.`);
    }
    return refs;
  }

  export function validateV05ScalarFields(value: unknown, label: string): Record<string, string> {
    const record = requireV05Record(value, label);
    const keys = Object.keys(record);
    if (keys.length > 100) throw new Error(`${label} exceeds the v0.5 scalar-field limit.`);
    const output: Record<string, string> = Object.create(null) as Record<string, string>;
    for (const key of keys) {
      const cleanKey = requireV05String(key, `${label} field name`, 100);
      if (["__proto__", "prototype", "constructor"].includes(cleanKey)) throw new Error(`${label} contains a forbidden field name.`);
      output[cleanKey] = requireV05String(record[key], `${label}.${cleanKey}`, 8000, true);
    }
    if (utf8(stableStringify(output, 0)).byteLength > 64 * 1024) throw new Error(`${label} exceeds the v0.5 serialized-field limit.`);
    return output;
  }

  export function v05SortedByOrder<T extends { order: number }>(records: readonly T[]): T[] {
    return [...records].sort((left, right) => left.order - right.order);
  }

  export function assertV05UniqueRecordIds(records: readonly Record<string, unknown>[], idField: string, label: string): void {
    const ids = records.map((record, index) => requireV05String(record[idField], `${label}[${index}].${idField}`, 160));
    ensureV05Unique(ids, `${label} identifiers`);
  }

  export function isV05Overdue(date: string, asOfIso: string): boolean {
    if (!date) return false;
    return Date.parse(`${date}T23:59:59Z`) < Date.parse(asOfIso);
  }
}
