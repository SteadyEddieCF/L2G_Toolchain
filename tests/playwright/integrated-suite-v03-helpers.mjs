import path from 'node:path';

export const artifactPath = 'apps/integrated-suite-v0.3/dist/L2G_Integrated_Suite_Engagement_Spine_v0.3.0.html';
export const artifactUrl = `/${artifactPath}`;
export const fixtureDir = path.resolve('apps/integrated-suite-v0.3/build/fixtures');
export const PASSPHRASE = 'Synthetic-Test-Passphrase-Only!';

export async function openMenu(page) {
  await page.getByRole('button', { name: 'Open project actions' }).click();
}

export function storedZipNames(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) { end = offset; break; }
  }
  if (end < 0) throw new Error('ZIP end missing');
  const count = view.getUint16(end + 10, true);
  let cursor = view.getUint32(end + 16, true);
  const names = [];
  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error('Central directory invalid');
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    names.push(new TextDecoder().decode(bytes.slice(cursor + 46, cursor + 46 + nameLength)));
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return names.sort();
}
