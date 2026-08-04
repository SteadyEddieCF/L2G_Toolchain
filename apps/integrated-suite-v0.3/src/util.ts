// @ts-nocheck
"use strict";
var L2G;
(function (L2G) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    L2G.ARCHIVE_LIMITS = Object.freeze({ maxEntries: 64, maxEntryBytes: 4 * 1024 * 1024, maxExpandedBytes: 12 * 1024 * 1024, maxPathLength: 240 });
    L2G.ENCRYPTED_LIMITS = Object.freeze({ maxOuterBytes: 16 * 1024 * 1024, minPassphraseUnits: 12, maxPassphraseBytes: 256 });
    function utf8(text) { return encoder.encode(text); }
    L2G.utf8 = utf8;
    function decodeUtf8(data) { return decoder.decode(data); }
    L2G.decodeUtf8 = decodeUtf8;
    function nowIso() { return new Date().toISOString(); }
    L2G.nowIso = nowIso;
    function newId(prefix) {
        const value = typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
        return `${prefix}_${value}`;
    }
    L2G.newId = newId;
    function deepClone(value) { return structuredClone(value); }
    L2G.deepClone = deepClone;
    function sanitizePlainText(value, maxLength = 10000) {
        return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, maxLength);
    }
    L2G.sanitizePlainText = sanitizePlainText;
    function stableStringify(value, indent = 2) { return `${JSON.stringify(normalize(value), null, indent)}\n`; }
    L2G.stableStringify = stableStringify;
    function normalize(value) {
        if (Array.isArray(value))
            return value.map(normalize);
        if (value && typeof value === "object") {
            const source = value;
            const output = {};
            for (const key of Object.keys(source).sort())
                output[key] = normalize(source[key]);
            return output;
        }
        return value;
    }
    async function sha256Hex(data) {
        const digest = await crypto.subtle.digest("SHA-256", data.slice().buffer);
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    }
    L2G.sha256Hex = sha256Hex;
    function bytesToB64(data) {
        let binary = "";
        for (let index = 0; index < data.length; index += 0x8000)
            binary += String.fromCharCode(...data.subarray(index, index + 0x8000));
        return btoa(binary);
    }
    L2G.bytesToB64 = bytesToB64;
    function b64ToBytes(value, expectedLength) {
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0)
            throw new Error("Encrypted metadata contains invalid base64.");
        const output = Uint8Array.from(atob(value), character => character.charCodeAt(0));
        if (expectedLength !== undefined && output.length !== expectedLength)
            throw new Error("Encrypted metadata contains an invalid byte length.");
        return output;
    }
    L2G.b64ToBytes = b64ToBytes;
    function randomBytes(length) {
        const output = new Uint8Array(length);
        crypto.getRandomValues(output);
        return output;
    }
    L2G.randomBytes = randomBytes;
    function validatePassphrase(passphrase) {
        if (passphrase.length < L2G.ENCRYPTED_LIMITS.minPassphraseUnits)
            throw new Error("Passphrase must contain at least 12 characters.");
        if (utf8(passphrase).byteLength > L2G.ENCRYPTED_LIMITS.maxPassphraseBytes)
            throw new Error("Passphrase is too long.");
    }
    L2G.validatePassphrase = validatePassphrase;
    function validateArchivePath(path) {
        if (!path || path.length > L2G.ARCHIVE_LIMITS.maxPathLength || path.includes("\\") || path.startsWith("/") || /^[A-Za-z]:/.test(path))
            throw new Error(`Unsafe archive path: ${path || "(empty)"}`);
        const parts = path.split("/");
        if (parts.some(part => !part || part === "." || part === ".."))
            throw new Error(`Unsafe archive path: ${path}`);
    }
    L2G.validateArchivePath = validateArchivePath;
    function crc32(data) {
        let crc = 0xffffffff;
        for (const byte of data) {
            crc ^= byte;
            for (let bit = 0; bit < 8; bit += 1)
                crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
        }
        return (crc ^ 0xffffffff) >>> 0;
    }
    L2G.crc32 = crc32;
    function parseStrictJson(text) { return new StrictJsonParser(text).parse(); }
    L2G.parseStrictJson = parseStrictJson;
    class StrictJsonParser {
        source;
        position = 0;
        constructor(source) {
            this.source = source;
        }
        parse() {
            this.skipWhitespace();
            const value = this.parseValue();
            this.skipWhitespace();
            if (this.position !== this.source.length)
                this.fail("Unexpected trailing content");
            return value;
        }
        parseValue() {
            this.skipWhitespace();
            const current = this.source[this.position];
            if (current === "{")
                return this.parseObject();
            if (current === "[")
                return this.parseArray();
            if (current === '"')
                return this.parseString();
            if (this.source.startsWith("true", this.position))
                return this.parseLiteral("true", true);
            if (this.source.startsWith("false", this.position))
                return this.parseLiteral("false", false);
            if (this.source.startsWith("null", this.position))
                return this.parseLiteral("null", null);
            if (current === "-" || (current !== undefined && /\d/.test(current)))
                return this.parseNumber();
            this.fail("Expected a JSON value");
        }
        parseObject() {
            this.expect("{");
            const output = Object.create(null);
            const keys = new Set();
            this.skipWhitespace();
            if (this.peek("}")) {
                this.position += 1;
                return output;
            }
            while (true) {
                this.skipWhitespace();
                const key = this.parseString();
                if (keys.has(key))
                    this.fail(`Duplicate JSON key: ${key}`);
                if (["__proto__", "prototype", "constructor"].includes(key))
                    this.fail(`Forbidden JSON key: ${key}`);
                keys.add(key);
                this.skipWhitespace();
                this.expect(":");
                output[key] = this.parseValue();
                this.skipWhitespace();
                if (this.peek("}")) {
                    this.position += 1;
                    return output;
                }
                this.expect(",");
            }
        }
        parseArray() {
            this.expect("[");
            const output = [];
            this.skipWhitespace();
            if (this.peek("]")) {
                this.position += 1;
                return output;
            }
            while (true) {
                output.push(this.parseValue());
                this.skipWhitespace();
                if (this.peek("]")) {
                    this.position += 1;
                    return output;
                }
                this.expect(",");
            }
        }
        parseString() {
            this.expect('"');
            let output = "";
            while (this.position < this.source.length) {
                const current = this.source[this.position++];
                if (current === '"')
                    return output;
                if (current === "\\") {
                    const escape = this.source[this.position++];
                    const map = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" };
                    if (escape === "u") {
                        const hex = this.source.slice(this.position, this.position + 4);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex))
                            this.fail("Invalid Unicode escape");
                        output += String.fromCharCode(Number.parseInt(hex, 16));
                        this.position += 4;
                    }
                    else if (escape !== undefined && Object.prototype.hasOwnProperty.call(map, escape)) {
                        output += map[escape];
                    }
                    else {
                        this.fail("Invalid escape sequence");
                    }
                }
                else {
                    if (current === undefined || current.charCodeAt(0) < 0x20)
                        this.fail("Unescaped control character");
                    output += current;
                }
            }
            this.fail("Unterminated string");
        }
        parseNumber() {
            const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(this.source.slice(this.position));
            if (!match)
                this.fail("Invalid number");
            this.position += match[0].length;
            const value = Number(match[0]);
            if (!Number.isFinite(value))
                this.fail("Number out of range");
            return value;
        }
        parseLiteral(word, value) { this.position += word.length; return value; }
        skipWhitespace() { while (/\s/.test(this.source[this.position] ?? ""))
            this.position += 1; }
        peek(value) { return this.source[this.position] === value; }
        expect(value) { if (!this.peek(value))
            this.fail(`Expected ${value}`); this.position += 1; }
        fail(message) { throw new Error(`${message} at character ${this.position}.`); }
    }
    function isRecord(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
    L2G.isRecord = isRecord;
    function escapeHtml(value) { return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character])); }
    L2G.escapeHtml = escapeHtml;
    function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
    L2G.escapeAttr = escapeAttr;
    function safeFilename(projectId, backup = false) { return `L2G_Project_${projectId.replace(/^project_/, "").slice(0, 8)}${backup ? ".backup" : ""}.l2g`; }
    L2G.safeFilename = safeFilename;
    function triggerDownload(blob, filename) {
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
    L2G.triggerDownload = triggerDownload;
    function errorMessage(error) { return error instanceof Error ? error.message : String(error); }
    L2G.errorMessage = errorMessage;
    function concatBytes(parts) {
        const size = parts.reduce((total, part) => total + part.length, 0);
        const output = new Uint8Array(size);
        let offset = 0;
        for (const part of parts) {
            output.set(part, offset);
            offset += part.length;
        }
        return output;
    }
    L2G.concatBytes = concatBytes;
})(L2G || (L2G = {}));
