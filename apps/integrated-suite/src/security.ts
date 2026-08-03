namespace L2G {
  export const ARCHIVE_LIMITS = Object.freeze({
    maxEntries: 64,
    maxEntryBytes: 2 * 1024 * 1024,
    maxExpandedBytes: 8 * 1024 * 1024,
    maxPathLength: 240,
    maxCompressionRatio: 20,
    maxNestedArchives: 0
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8", { fatal: true });

  export function utf8(text: string): Uint8Array {
    return encoder.encode(text);
  }

  export function decodeUtf8(data: Uint8Array): string {
    return decoder.decode(data);
  }

  export function nowIso(): string {
    return new Date().toISOString();
  }

  export function newId(prefix: string): string {
    const random = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, "0")).join("");
    return `${prefix}_${random}`;
  }

  export function deepClone<T>(value: T): T {
    return structuredClone(value);
  }

  export function sanitizePlainText(value: unknown, maxLength = 10000): string {
    const text = typeof value === "string" ? value : String(value ?? "");
    return text
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .slice(0, maxLength);
  }

  export function stableStringify(value: unknown, indent = 2): string {
    const normalized = normalize(value);
    return `${JSON.stringify(normalized, null, indent)}\n`;
  }

  function normalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object") {
      const source = value as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(source).sort()) result[key] = normalize(source[key]);
      return result;
    }
    return value;
  }

  export async function sha256Hex(data: Uint8Array): Promise<string> {
    const bytes = data.slice().buffer;
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  export function validateArchivePath(path: string): void {
    if (!path || path.length > ARCHIVE_LIMITS.maxPathLength) throw new Error("Archive path is empty or too long.");
    if (path.includes("\\") || path.startsWith("/") || /^[A-Za-z]:/.test(path)) throw new Error(`Unsafe archive path: ${path}`);
    const parts = path.split("/");
    if (parts.some(part => part === "" || part === "." || part === "..")) throw new Error(`Unsafe archive path: ${path}`);
    if (/\.(zip|l2g)$/i.test(path)) throw new Error(`Nested archive entries are not permitted in the foundation format: ${path}`);
  }

  export function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  export function parseStrictJson(text: string): unknown {
    return new StrictJsonParser(text).parse();
  }

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
      if (current === "t") return this.parseLiteral("true", true);
      if (current === "f") return this.parseLiteral("false", false);
      if (current === "n") return this.parseLiteral("null", null);
      if (current === "-" || (current !== undefined && current >= "0" && current <= "9")) return this.parseNumber();
      this.fail("Expected a JSON value");
    }

    private parseObject(): Record<string, unknown> {
      this.expect("{");
      const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
      const keys = new Set<string>();
      this.skipWhitespace();
      if (this.peek("}")) {
        this.position += 1;
        return result;
      }
      while (true) {
        this.skipWhitespace();
        if (!this.peek('"')) this.fail("Expected an object key");
        const key = this.parseString();
        if (keys.has(key)) this.fail(`Duplicate JSON key: ${key}`);
        if (key === "__proto__" || key === "prototype" || key === "constructor") this.fail(`Forbidden JSON key: ${key}`);
        keys.add(key);
        this.skipWhitespace();
        this.expect(":");
        result[key] = this.parseValue();
        this.skipWhitespace();
        if (this.peek("}")) {
          this.position += 1;
          return result;
        }
        this.expect(",");
      }
    }

    private parseArray(): unknown[] {
      this.expect("[");
      const result: unknown[] = [];
      this.skipWhitespace();
      if (this.peek("]")) {
        this.position += 1;
        return result;
      }
      while (true) {
        result.push(this.parseValue());
        this.skipWhitespace();
        if (this.peek("]")) {
          this.position += 1;
          return result;
        }
        this.expect(",");
      }
    }

    private parseString(): string {
      this.expect('"');
      let result = "";
      while (this.position < this.source.length) {
        const current = this.source[this.position++];
        if (current === '"') return result;
        if (current === "\\") {
          const escape = this.source[this.position++];
          const map: Record<string, string> = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
          if (escape === "u") {
            const hex = this.source.slice(this.position, this.position + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) this.fail("Invalid Unicode escape");
            result += String.fromCharCode(Number.parseInt(hex, 16));
            this.position += 4;
          } else if (escape !== undefined && Object.prototype.hasOwnProperty.call(map, escape)) {
            result += map[escape];
          } else {
            this.fail("Invalid escape sequence");
          }
        } else {
          if (current === undefined || current.charCodeAt(0) < 0x20) this.fail("Unescaped control character in string");
          result += current;
        }
      }
      this.fail("Unterminated string");
    }

    private parseNumber(): number {
      const remaining = this.source.slice(this.position);
      const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(remaining);
      if (!match) this.fail("Invalid number");
      this.position += match[0].length;
      const value = Number(match[0]);
      if (!Number.isFinite(value)) this.fail("Number is outside the supported range");
      return value;
    }

    private parseLiteral<T>(literal: string, value: T): T {
      if (this.source.slice(this.position, this.position + literal.length) !== literal) this.fail(`Expected ${literal}`);
      this.position += literal.length;
      return value;
    }

    private skipWhitespace(): void {
      while (/\s/.test(this.source[this.position] ?? "")) this.position += 1;
    }

    private peek(value: string): boolean {
      return this.source[this.position] === value;
    }

    private expect(value: string): void {
      if (!this.peek(value)) this.fail(`Expected ${value}`);
      this.position += 1;
    }

    private fail(message: string): never {
      throw new Error(`${message} at character ${this.position}.`);
    }
  }
}
