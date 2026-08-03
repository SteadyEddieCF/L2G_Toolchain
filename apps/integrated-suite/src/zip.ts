namespace L2G {
  const LOCAL_SIGNATURE = 0x04034b50;
  const CENTRAL_SIGNATURE = 0x02014b50;
  const END_SIGNATURE = 0x06054b50;
  const UTF8_FLAG = 0x0800;
  const DOS_DATE_1980_01_01 = 33;

  export function createStoredZip(inputEntries: ZipEntry[]): Uint8Array {
    if (inputEntries.length > ARCHIVE_LIMITS.maxEntries) throw new Error("Archive contains too many entries.");
    const paths = new Set<string>();
    let expanded = 0;
    const entries = inputEntries
      .map(entry => ({ path: entry.path, data: entry.data.slice() }))
      .sort((a, b) => a.path.localeCompare(b.path));

    for (const entry of entries) {
      validateArchivePath(entry.path);
      if (paths.has(entry.path)) throw new Error(`Duplicate archive path: ${entry.path}`);
      paths.add(entry.path);
      if (entry.data.byteLength > ARCHIVE_LIMITS.maxEntryBytes) throw new Error(`Archive entry exceeds the limit: ${entry.path}`);
      expanded += entry.data.byteLength;
      if (expanded > ARCHIVE_LIMITS.maxExpandedBytes) throw new Error("Archive expanded size exceeds the limit.");
    }

    const localParts: Uint8Array[] = [];
    const centralParts: Uint8Array[] = [];
    let offset = 0;

    for (const entry of entries) {
      const name = utf8(entry.path);
      const crc = crc32(entry.data);
      const local = new Uint8Array(30 + name.byteLength + entry.data.byteLength);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, LOCAL_SIGNATURE, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, UTF8_FLAG, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, 0, true);
      localView.setUint16(12, DOS_DATE_1980_01_01, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, entry.data.byteLength, true);
      localView.setUint32(22, entry.data.byteLength, true);
      localView.setUint16(26, name.byteLength, true);
      localView.setUint16(28, 0, true);
      local.set(name, 30);
      local.set(entry.data, 30 + name.byteLength);
      localParts.push(local);

      const central = new Uint8Array(46 + name.byteLength);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, CENTRAL_SIGNATURE, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, UTF8_FLAG, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, 0, true);
      centralView.setUint16(14, DOS_DATE_1980_01_01, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, entry.data.byteLength, true);
      centralView.setUint32(24, entry.data.byteLength, true);
      centralView.setUint16(28, name.byteLength, true);
      centralView.setUint16(30, 0, true);
      centralView.setUint16(32, 0, true);
      centralView.setUint16(34, 0, true);
      centralView.setUint16(36, 0, true);
      centralView.setUint32(38, 0, true);
      centralView.setUint32(42, offset, true);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.byteLength;
    }

    const centralOffset = offset;
    const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, END_SIGNATURE, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, centralOffset, true);
    endView.setUint16(20, 0, true);

    return concatenate([...localParts, ...centralParts, end]);
  }

  export function readStoredZip(data: Uint8Array): ZipEntry[] {
    if (data.byteLength < 22) throw new Error("The project archive is too small.");
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const endOffset = findEndRecord(view);
    const entryCount = view.getUint16(endOffset + 10, true);
    const centralSize = view.getUint32(endOffset + 12, true);
    const centralOffset = view.getUint32(endOffset + 16, true);
    const commentLength = view.getUint16(endOffset + 20, true);
    if (endOffset + 22 + commentLength !== data.byteLength) throw new Error("Unexpected content follows the ZIP end record.");
    if (entryCount > ARCHIVE_LIMITS.maxEntries) throw new Error("Archive contains too many entries.");
    if (centralOffset + centralSize > endOffset) throw new Error("Central directory is outside the archive bounds.");

    const paths = new Set<string>();
    const entries: ZipEntry[] = [];
    let expanded = 0;
    let cursor = centralOffset;

    for (let index = 0; index < entryCount; index += 1) {
      if (cursor + 46 > data.byteLength || view.getUint32(cursor, true) !== CENTRAL_SIGNATURE) throw new Error("Invalid central directory entry.");
      const flags = view.getUint16(cursor + 8, true);
      const method = view.getUint16(cursor + 10, true);
      const expectedCrc = view.getUint32(cursor + 16, true);
      const compressedSize = view.getUint32(cursor + 20, true);
      const expandedSize = view.getUint32(cursor + 24, true);
      const nameLength = view.getUint16(cursor + 28, true);
      const extraLength = view.getUint16(cursor + 30, true);
      const commentLengthEntry = view.getUint16(cursor + 32, true);
      const diskStart = view.getUint16(cursor + 34, true);
      const localOffset = view.getUint32(cursor + 42, true);
      const nameStart = cursor + 46;
      const nameEnd = nameStart + nameLength;
      if (nameEnd + extraLength + commentLengthEntry > data.byteLength) throw new Error("Truncated central directory entry.");
      if (diskStart !== 0) throw new Error("Multi-disk archives are not supported.");
      if ((flags & 0x0001) !== 0) throw new Error("Encrypted ZIP entries are not supported.");
      if (method !== 0) throw new Error("Compressed ZIP entries are rejected by the foundation archive-safety policy.");
      if (compressedSize !== expandedSize) throw new Error("Stored entry sizes do not match.");
      if (expandedSize > ARCHIVE_LIMITS.maxEntryBytes) throw new Error("Archive entry exceeds the expanded-size limit.");
      const path = decodeUtf8(data.subarray(nameStart, nameEnd));
      validateArchivePath(path);
      if (paths.has(path)) throw new Error(`Duplicate archive path: ${path}`);
      paths.add(path);
      expanded += expandedSize;
      if (expanded > ARCHIVE_LIMITS.maxExpandedBytes) throw new Error("Archive expanded size exceeds the limit.");

      if (localOffset + 30 > data.byteLength || view.getUint32(localOffset, true) !== LOCAL_SIGNATURE) throw new Error(`Invalid local header for ${path}.`);
      const localFlags = view.getUint16(localOffset + 6, true);
      const localMethod = view.getUint16(localOffset + 8, true);
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      if (localFlags !== flags || localMethod !== method) throw new Error(`Header mismatch for ${path}.`);
      const localNameStart = localOffset + 30;
      const localNameEnd = localNameStart + localNameLength;
      const localPath = decodeUtf8(data.subarray(localNameStart, localNameEnd));
      if (localPath !== path) throw new Error(`Central/local path mismatch for ${path}.`);
      const payloadStart = localNameEnd + localExtraLength;
      const payloadEnd = payloadStart + compressedSize;
      if (payloadEnd > data.byteLength) throw new Error(`Truncated payload for ${path}.`);
      const payload = data.slice(payloadStart, payloadEnd);
      if (crc32(payload) !== expectedCrc) throw new Error(`CRC mismatch for ${path}.`);
      entries.push({ path, data: payload });
      cursor = nameEnd + extraLength + commentLengthEntry;
    }

    if (cursor !== centralOffset + centralSize) throw new Error("Central directory size does not match its entries.");
    return entries.sort((a, b) => a.path.localeCompare(b.path));
  }

  function findEndRecord(view: DataView): number {
    const minimum = Math.max(0, view.byteLength - 65557);
    for (let offset = view.byteLength - 22; offset >= minimum; offset -= 1) {
      if (view.getUint32(offset, true) === END_SIGNATURE) return offset;
    }
    throw new Error("ZIP end record was not found.");
  }

  function concatenate(parts: Uint8Array[]): Uint8Array {
    const size = parts.reduce((sum, part) => sum + part.byteLength, 0);
    const output = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      output.set(part, offset);
      offset += part.byteLength;
    }
    return output;
  }
}
