// @ts-nocheck
var L2G;
(function (L2G) {
    const LOCAL_SIGNATURE = 0x04034b50;
    const CENTRAL_SIGNATURE = 0x02014b50;
    const END_SIGNATURE = 0x06054b50;
    const UTF8_FLAG = 0x0800;
    const DOS_DATE_1980_01_01 = 33;
    function createStoredZip(inputEntries) {
        if (inputEntries.length > L2G.ARCHIVE_LIMITS.maxEntries)
            throw new Error("Archive contains too many entries.");
        const paths = new Set();
        let expanded = 0;
        const entries = inputEntries.map(entry => ({ path: entry.path, data: entry.data.slice() })).sort((left, right) => left.path.localeCompare(right.path));
        for (const entry of entries) {
            L2G.validateArchivePath(entry.path);
            if (paths.has(entry.path))
                throw new Error(`Duplicate archive path: ${entry.path}`);
            paths.add(entry.path);
            if (entry.data.length > L2G.ARCHIVE_LIMITS.maxEntryBytes)
                throw new Error(`Archive entry exceeds limit: ${entry.path}`);
            expanded += entry.data.length;
            if (expanded > L2G.ARCHIVE_LIMITS.maxExpandedBytes)
                throw new Error("Archive expanded size exceeds limit.");
        }
        const localParts = [];
        const centralParts = [];
        let offset = 0;
        for (const entry of entries) {
            const name = L2G.utf8(entry.path);
            const crc = L2G.crc32(entry.data);
            const local = new Uint8Array(30 + name.length + entry.data.length);
            const localView = new DataView(local.buffer);
            localView.setUint32(0, LOCAL_SIGNATURE, true);
            localView.setUint16(4, 20, true);
            localView.setUint16(6, UTF8_FLAG, true);
            localView.setUint16(8, 0, true);
            localView.setUint16(10, 0, true);
            localView.setUint16(12, DOS_DATE_1980_01_01, true);
            localView.setUint32(14, crc, true);
            localView.setUint32(18, entry.data.length, true);
            localView.setUint32(22, entry.data.length, true);
            localView.setUint16(26, name.length, true);
            localView.setUint16(28, 0, true);
            local.set(name, 30);
            local.set(entry.data, 30 + name.length);
            localParts.push(local);
            const central = new Uint8Array(46 + name.length);
            const centralView = new DataView(central.buffer);
            centralView.setUint32(0, CENTRAL_SIGNATURE, true);
            centralView.setUint16(4, 20, true);
            centralView.setUint16(6, 20, true);
            centralView.setUint16(8, UTF8_FLAG, true);
            centralView.setUint16(10, 0, true);
            centralView.setUint16(12, 0, true);
            centralView.setUint16(14, DOS_DATE_1980_01_01, true);
            centralView.setUint32(16, crc, true);
            centralView.setUint32(20, entry.data.length, true);
            centralView.setUint32(24, entry.data.length, true);
            centralView.setUint16(28, name.length, true);
            centralView.setUint16(30, 0, true);
            centralView.setUint16(32, 0, true);
            centralView.setUint16(34, 0, true);
            centralView.setUint16(36, 0, true);
            centralView.setUint32(38, 0, true);
            centralView.setUint32(42, offset, true);
            central.set(name, 46);
            centralParts.push(central);
            offset += local.length;
        }
        const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
        const end = new Uint8Array(22);
        const endView = new DataView(end.buffer);
        endView.setUint32(0, END_SIGNATURE, true);
        endView.setUint16(4, 0, true);
        endView.setUint16(6, 0, true);
        endView.setUint16(8, entries.length, true);
        endView.setUint16(10, entries.length, true);
        endView.setUint32(12, centralSize, true);
        endView.setUint32(16, offset, true);
        endView.setUint16(20, 0, true);
        return L2G.concatBytes([...localParts, ...centralParts, end]);
    }
    L2G.createStoredZip = createStoredZip;
    function readStoredZip(data) {
        if (data.length < 22)
            throw new Error("Archive is too small.");
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        let endOffset = -1;
        for (let offset = data.length - 22; offset >= Math.max(0, data.length - 65557); offset -= 1) {
            if (view.getUint32(offset, true) === END_SIGNATURE) {
                endOffset = offset;
                break;
            }
        }
        if (endOffset < 0)
            throw new Error("ZIP end record missing.");
        const entryCount = view.getUint16(endOffset + 10, true);
        const centralSize = view.getUint32(endOffset + 12, true);
        const centralOffset = view.getUint32(endOffset + 16, true);
        const commentLength = view.getUint16(endOffset + 20, true);
        if (endOffset + 22 + commentLength !== data.length)
            throw new Error("Unexpected trailing archive content.");
        if (entryCount > L2G.ARCHIVE_LIMITS.maxEntries || centralOffset + centralSize > endOffset)
            throw new Error("Archive directory is invalid.");
        const paths = new Set();
        const output = [];
        let cursor = centralOffset;
        let expanded = 0;
        for (let index = 0; index < entryCount; index += 1) {
            if (cursor + 46 > data.length || view.getUint32(cursor, true) !== CENTRAL_SIGNATURE)
                throw new Error("Invalid central directory.");
            const flags = view.getUint16(cursor + 8, true);
            const method = view.getUint16(cursor + 10, true);
            const expectedCrc = view.getUint32(cursor + 16, true);
            const compressedSize = view.getUint32(cursor + 20, true);
            const payloadSize = view.getUint32(cursor + 24, true);
            const nameLength = view.getUint16(cursor + 28, true);
            const extraLength = view.getUint16(cursor + 30, true);
            const fileCommentLength = view.getUint16(cursor + 32, true);
            const localOffset = view.getUint32(cursor + 42, true);
            if ((flags & 1) !== 0 || method !== 0 || compressedSize !== payloadSize)
                throw new Error("Compressed or encrypted ZIP entries are rejected.");
            const nameStart = cursor + 46;
            const nameEnd = nameStart + nameLength;
            if (nameEnd + extraLength + fileCommentLength > data.length)
                throw new Error("Truncated central directory.");
            const path = L2G.decodeUtf8(data.subarray(nameStart, nameEnd));
            L2G.validateArchivePath(path);
            if (paths.has(path))
                throw new Error(`Duplicate archive path: ${path}`);
            paths.add(path);
            expanded += payloadSize;
            if (expanded > L2G.ARCHIVE_LIMITS.maxExpandedBytes || payloadSize > L2G.ARCHIVE_LIMITS.maxEntryBytes)
                throw new Error("Archive payload exceeds limit.");
            if (localOffset + 30 > data.length || view.getUint32(localOffset, true) !== LOCAL_SIGNATURE)
                throw new Error(`Invalid local header: ${path}`);
            const localNameLength = view.getUint16(localOffset + 26, true);
            const localExtraLength = view.getUint16(localOffset + 28, true);
            const localNameStart = localOffset + 30;
            const localNameEnd = localNameStart + localNameLength;
            const localPath = L2G.decodeUtf8(data.subarray(localNameStart, localNameEnd));
            if (localPath !== path)
                throw new Error(`Header path mismatch: ${path}`);
            const payloadStart = localNameEnd + localExtraLength;
            const payloadEnd = payloadStart + compressedSize;
            if (payloadEnd > data.length)
                throw new Error(`Truncated payload: ${path}`);
            const payload = data.slice(payloadStart, payloadEnd);
            if (L2G.crc32(payload) !== expectedCrc)
                throw new Error(`CRC mismatch: ${path}`);
            output.push({ path, data: payload });
            cursor = nameEnd + extraLength + fileCommentLength;
        }
        if (cursor !== centralOffset + centralSize)
            throw new Error("Central directory size mismatch.");
        return output.sort((left, right) => left.path.localeCompare(right.path));
    }
    L2G.readStoredZip = readStoredZip;
})(L2G || (L2G = {}));
