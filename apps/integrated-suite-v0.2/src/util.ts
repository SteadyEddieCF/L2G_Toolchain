namespace L2G {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  export const ARCHIVE_LIMITS = Object.freeze({ maxEntries: 64, maxEntryBytes: 4 * 1024 * 1024, maxExpandedBytes: 12 * 1024 * 1024, maxPathLength: 240 });
  export const ENCRYPTED_LIMITS = Object.freeze({ maxOuterBytes: 16 * 1024 * 1024, minPassphraseUnits: 12, maxPassphraseBytes: 256 });

  export function utf8(text: string): Uint8Array { return encoder.encode(text); }
  export function decodeUtf8(data: Uint8Array): string { return decoder.decode(data); }
  export function nowIso(): string { return new Date().toISOString(); }
  export function newId(prefix: string): string {
    const value = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
    return `${prefix}_${value}`;
  }
  export function deepClone<T>(value: T): T { return structuredClone(value); }
  export function sanitizePlainText(value: unknown, maxLength = 10000): string {
    return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, maxLength);
  }
  export function stableStringify(value: unknown, indent = 2): string { return `${JSON.stringify(normalize(value), null, indent)}\n`; }
  function normalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object") {
      const source = value as Record<string, unknown>;
      const output: Record<string, unknown> = {};
      for (const key of Object.keys(source).sort()) output[key] = normalize(source[key]);
      return output;
    }
    return value;
  }
  export async function sha256Hex(data: Uint8Array): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", data.slice().buffer);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  }
  export function bytesToB64(data: Uint8Array): string {
    let binary = "";
    for (let index = 0; index < data.length; index += 0x8000) binary += String.fromCharCode(...data.subarray(index, index + 0x8000));
    return btoa(binary);
  }
  export function b64ToBytes(value: string, expectedLength?: number): Uint8Array {
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0) throw new Error("Encrypted metadata contains invalid base64.");
    const output = Uint8Array.from(atob(value), character => character.charCodeAt(0));
    if (expectedLength !== undefined && output.length !== expectedLength) throw new Error("Encrypted metadata contains an invalid byte length.");
    return output;
  }
  export function randomBytes(length: number): Uint8Array {
    const output = new Uint8Array(length);
    crypto.getRandomValues(output);
    return output;
  }
  export function validatePassphrase(passphrase: string): void {
    if (passphrase.length < ENCRYPTED_LIMITS.minPassphraseUnits) throw new Error("Passphrase must contain at least 12 characters.");
    if (utf8(passphrase).byteLength > ENCRYPTED_LIMITS.maxPassphraseBytes) throw new Error("Passphrase is too long.");
  }
  export function validateArchivePath(path: string): void {
    if (!path || path.length > ARCHIVE_LIMITS.maxPathLength || path.includes("\\") || path.startsWith("/") || /^[A-Za-z]:/.test(path)) throw new Error(`Unsafe archive path: ${path || "(empty)"}`);
    const parts = path.split("/");
    if (parts.some(part => !part || part === "." || part === "..")) throw new Error(`Unsafe archive path: ${path}`);
  }
  export function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  export function parseStrictJson(text: string): unknown { return new StrictJsonParser(text).parse(); }
  class StrictJsonParser {
    private position = 0;
    constructor(private readonly source: string) {}
    parse(): unknown {
      this.skipWhitespace();
      const value = this.parseValue();
      this.skipWhitespace();
      if (this.position !== this.source.length) this.fail("Unexpected trailing content");
      return value;
    }
    private parseValue(): unknown {
      this.skipWhitespace();
      const current = this.source[this.position];
      if (current === "{") return this.parseObject();
      if (current === "[") return this.parseArray();
      if (current === '"') return this.parseString();
      if (this.source.startsWith("true", this.position)) return this.parseLiteral("true", true);
      if (this.source.startsWith("false", this.position)) return this.parseLiteral("false", false);
      if (this.source.startsWith("null", this.position)) return this.parseLiteral("null", null);
      if (current === "-" || (current !== undefined && /\d/.test(current))) return this.parseNumber();
      this.fail("Expected a JSON value");
    }
    private parseObject(): Record<string, unknown> {
      this.expect("{");
      const output: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
      const keys = new Set<string>();
      this.skipWhitespace();
      if (this.peek("}")) { this.position += 1; return output; }
      while (true) {
        this.skipWhitespace();
        const key = this.parseString();
        if (keys.has(key)) this.fail(`Duplicate JSON key: ${key}`);
        if (["__proto__", "prototype", "constructor"].includes(key)) this.fail(`Forbidden JSON key: ${key}`);
        keys.add(key);
        this.skipWhitespace();
        this.expect(":");
        output[key] = this.parseValue();
        this.skipWhitespace();
        if (this.peek("}")) { this.position += 1; return output; }
        this.expect(",");
      }
    }
    private parseArray(): unknown[] {
      this.expect("[");
      const output: unknown[] = [];
      this.skipWhitespace();
      if (this.peek("]")) { this.position += 1; return output; }
      while (true) {
        output.push(this.parseValue());
        this.skipWhitespace();
        if (this.peek("]")) { this.position += 1; return output; }
        this.expect(",");
      }
    }
    private parseString(): string {
      this.expect('"');
      let output = "";
      while (this.position < this.source.length) {
        const current = this.source[this.position++];
        if (current === '"') return output;
        if (current === "\\") {
          const escape = this.source[this.position++];
          const map: Record<string, string> = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
          if (escape === "u") {
            const hex = this.source.slice(this.position, this.position + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) this.fail("Invalid Unicode escape");
            output += String.fromCharCode(Number.parseInt(hex, 16));
            this.position += 4;
          } else if (escape !== undefined && Object.prototype.hasOwnProperty.call(map, escape)) {
            output += map[escape];
          } else {
            this.fail("Invalid escape sequence");
          }
        } else {
          if (current === undefined || current.charCodeAt(0) < 0x20) this.fail("Unescaped control character");
          output += current;
        }
      }
      this.fail("Unterminated string");
    }
    private parseNumber(): number {
      const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(this.source.slice(this.position));
      if (!match) this.fail("Invalid number");
      this.position += match[0].length;
      const value = Number(match[0]);
      if (!Number.isFinite(value)) this.fail("Number out of range");
      return value;
    }
    private parseLiteral<T>(word: string, value: T): T { this.position += word.length; return value; }
    private skipWhitespace(): void { while (/\s/.test(this.source[this.position] ?? "")) this.position += 1; }
    private peek(value: string): boolean { return this.source[this.position] === value; }
    private expect(value: string): void { if (!this.peek(value)) this.fail(`Expected ${value}`); this.position += 1; }
    private fail(message: string): never { throw new Error(`${message} at character ${this.position}.`); }
  }
  export function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
  export function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!)); }
  export function escapeAttr(value: string): string { return escapeHtml(value).replace(/`/g, "&#96;"); }
  export function safeFilename(projectId: string, backup = false): string { return `L2G_Project_${projectId.replace(/^project_/, "").slice(0, 8)}${backup ? ".backup" : ""}.l2g`; }
  export function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  export function errorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }
  export function concatBytes(parts: Uint8Array[]): Uint8Array {
    const size = parts.reduce((total, part) => total + part.length, 0);
    const output = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) { output.set(part, offset); offset += part.length; }
    return output;
  }
}
