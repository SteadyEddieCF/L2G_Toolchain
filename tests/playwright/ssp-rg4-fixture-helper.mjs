import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const V1916_RUNTIME_FILE = path.resolve(
  process.cwd(),
  'modules/ssp/releases/v1.9.16/CMMC_L2_SSP_Modern_Editable_v1.9.16.html',
);
export const SIDECAR_FIXTURE_ROOT = path.resolve(
  process.cwd(),
  'modules/ssp/releases/v1.9.17/tests/fixtures',
);
export const CURRENT_IDENTITY = {
  size: 79843,
  sha256: '3a124539c41057f88591c06076b21590d30ccf5eea55b078bf4531cedf005642',
  sourceFingerprint: '84e151b810224ea2f3a6a6121bc0d168b44f68641f749c0846258e2ebea90c8c',
};
export const CHANGED_IDENTITY = {
  size: 80037,
  sha256: '36d86ce025183757050f9157b9bbed59e752d0a24fa7480884962e3d37090c7a',
  sourceFingerprint: 'c4320e890630b90830b9c0d71b7ea35e0803e6a74cb4f6a86e1f54a73e90eaeb',
};
export const BLOCKED_IDENTITY = {
  size: 79880,
  sha256: '93165e9527bf69caf055a4069ab4b3400c3e0706e3748e2f86c6f72311bece38',
};

export const hashBytes = (data) => crypto.createHash('sha256').update(data).digest('hex');
export const readSidecar = (fileName) => JSON.parse(
  fs.readFileSync(path.join(SIDECAR_FIXTURE_ROOT, fileName), 'utf8'),
);

const canonical = (value) => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
    .join(',')}}`;
};
const digest = (value) => crypto.createHash('sha256').update(canonical(value), 'utf8').digest('hex');

export function recomputeSidecar(value) {
  const sidecar = structuredClone(value);
  delete sidecar.sidecar_id;
  delete sidecar.package_fingerprint;
  sidecar.sidecar_id = `sha256:${digest(sidecar)}`;
  const fingerprintInput = structuredClone(sidecar);
  delete fingerprintInput.package_fingerprint;
  sidecar.package_fingerprint = digest(fingerprintInput);
  return sidecar;
}

export function adaptSidecarArtifact(value, docxPath, options = {}) {
  const sidecar = structuredClone(value);
  const bytes = fs.readFileSync(docxPath);
  const identity = { size: bytes.length, sha256: hashBytes(bytes) };
  sidecar.artifact.file_name = options.fileName || path.basename(docxPath);
  sidecar.artifact.size_bytes = identity.size;
  sidecar.artifact.sha256 = identity.sha256;
  for (const check of sidecar.checks || []) {
    check.evidence_refs = (check.evidence_refs || []).map((ref) => {
      if (String(ref).startsWith('artifact:sha256=')) return `artifact:sha256=${identity.sha256}`;
      if (String(ref).startsWith('artifact:size_bytes=')) return `artifact:size_bytes=${identity.size}`;
      return ref;
    });
  }
  if (Object.prototype.hasOwnProperty.call(options, 'supersedesSidecarId')) {
    sidecar.lineage.supersedes_sidecar_id = options.supersedesSidecarId;
  }
  return recomputeSidecar(sidecar);
}

async function installOpaqueOriginShims(page) {
  await page.evaluate(() => {
    if (!crypto.subtle) {
      Object.defineProperty(crypto, 'subtle', {
        configurable: true,
        value: {
          digest: async (algorithm, input) => {
            const name = typeof algorithm === 'string' ? algorithm : algorithm?.name;
            if (String(name).toUpperCase() !== 'SHA-256') throw new Error('Only SHA-256 is supported.');
            const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
            const hex = window.__sspTestHooks.portfolioDeliverySha256Bytes(bytes);
            const out = new Uint8Array(32);
            for (let i = 0; i < 32; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
            return out.buffer;
          },
        },
      });
    }
    try {
      localStorage.setItem('__rg4_probe__', 'ok');
      localStorage.removeItem('__rg4_probe__');
    } catch {
      const store = new Map();
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: {
          getItem: (key) => (store.has(String(key)) ? store.get(String(key)) : null),
          setItem: (key, value) => store.set(String(key), String(value)),
          removeItem: (key) => store.delete(String(key)),
          clear: () => store.clear(),
          key: (index) => [...store.keys()][index] ?? null,
          get length() { return store.size; },
        },
      });
    }
  });
}

async function prepareDeterministicSource(page, variant) {
  await page.evaluate(({ variant: selectedVariant }) => {
    const hooks = window.__sspTestHooks;
    const data = hooks.collectData(false);
    data.statuses = {};
    document.querySelectorAll('.control-card').forEach((card) => {
      data.statuses[card.dataset.controlId] = 'implemented';
    });
    hooks.applyData(data);

    const exact = {
      CLIENT_NAME: 'Example Organization',
      ORGANIZATION_NAME: 'Example Organization',
      SYSTEM_NAME: 'Atlas Test System',
      SYSTEM_NAME_FULL: 'Atlas Test System',
      DOCUMENT_VERSION: '1.0',
      DOCUMENT_DATE: '2026-07-30',
      SYSTEM_UNIQUE_IDENTIFIER: 'RG4-FIXTURE-SYS-001',
      ASSESSMENT_SCOPE_IDENTIFIER: 'RG4-FIXTURE-SCOPE-001',
      SYSTEM_PURPOSE_AND_FUNCTION: selectedVariant === 'changed_source'
        ? 'Atlas Test System is a de-identified deterministic fixture used only for local RG-4 Word artifact testing. Controlled revision B adds deterministic audit-report generation to the governed system purpose.'
        : 'Atlas Test System is a de-identified deterministic fixture used only for local RG-4 Word artifact testing.',
      DOCUMENT_OWNER: 'Synthetic SSP Owner Role',
      APPROVAL_AUTHORITY: 'Synthetic Approval Role',
      SSP_REVIEW_FREQUENCY: 'Annual or upon significant governed change.',
      DISTRIBUTION_AND_HANDLING: 'Synthetic fixture; no CUI, PII, client data, credentials, signatures, or authenticated identities.',
    };
    const generic = (token) => {
      if (/EMAIL/.test(token)) return 'fixture@example.invalid';
      if (/PHONE/.test(token)) return '555-0100';
      if (/ADDRESS/.test(token)) return '100 Fixture Avenue, Example City, SC 00000';
      if (/DATE/.test(token)) return '2026-07-30';
      if (/VERSION/.test(token)) return '1.0';
      if (/NAME/.test(token)) return 'Synthetic Role Holder';
      if (/TITLE/.test(token)) return 'Synthetic Role';
      if (/IDENTIFIER|_ID$/.test(token)) return `RG4-FIXTURE-${token.slice(0, 40)}`;
      return `De-identified deterministic fixture value for ${token}.`;
    };

    document.querySelectorAll('[data-token]').forEach((element) => {
      const token = element.dataset.token || '';
      if (/^(TEMPLATE_CONTROL|REQUIREMENT_TEXT|ASSESSMENT_OBJECTIVE)_/.test(token)) return;
      let value = exact[token];
      const current = (element.matches('input,textarea,select') ? element.value : element.textContent || '').trim();
      if (value === undefined && /^\{[^}]+\}$/.test(current)) value = generic(token);
      if (value === undefined) return;
      if (element.matches('select')) {
        const option = [...element.options].find(
          (candidate) => candidate.value === value || candidate.textContent.trim() === value,
        ) || [...element.options].find(
          (candidate) => candidate.value && !/^\{/.test(candidate.textContent.trim()),
        );
        if (option) element.value = option.value;
      } else if (element.matches('input,textarea')) {
        element.value = value;
      } else {
        element.textContent = value;
      }
      element.classList.remove('placeholder-token');
    });

    document.querySelectorAll('tbody td[contenteditable="true"],tbody th[contenteditable="true"]').forEach((element, index) => {
      const current = (element.textContent || '').trim();
      if (!current || /^\{[^}]+\}$/.test(current)) {
        element.textContent = `Deterministic table value ${String(index + 1).padStart(3, '0')}`;
      }
    });
    document.querySelectorAll('[data-control-status][value="implemented"]').forEach((element) => {
      element.checked = true;
    });
  }, { variant });
}

async function captureGovernedSnapshot(page) {
  return page.evaluate(() => {
    const data = window.__sspTestHooks.collectData(false);
    delete data.savedAt;
    delete data.migration;
    delete data.reviewGateConfiguration;
    delete data.reviewGateRuns;
    delete data.reviewStageRuns;
    delete data.reviewCorrectiveActions;
    delete data.wordReviewInspections;
    delete data.wordQaSidecarEvidence;
    if (data.portfolioFoundation?.changeHistory) {
      data.portfolioFoundation.changeHistory = data.portfolioFoundation.changeHistory.filter(
        (entry) => !String(entry?.eventType || '').startsWith('review-gate:')
          && entry?.source !== 'SSP v1.9.9 local staged-review orchestration',
      );
    }
    return data;
  });
}

export async function generateWordFixture(browser, variant, outputPath) {
  const fixedTime = variant === 'changed_source'
    ? '2026-07-30T13:35:00Z'
    : '2026-07-30T13:30:00Z';
  const expected = variant === 'changed_source' ? CHANGED_IDENTITY : CURRENT_IDENTITY;
  const context = await browser.newContext({
    acceptDownloads: true,
    locale: 'en-US',
    timezoneId: 'UTC',
    viewport: { width: 1440, height: 900 },
  });
  await context.addInitScript(({ fixedTime: selectedTime }) => {
    const RealDate = Date;
    const fixed = RealDate.parse(selectedTime);
    class FixedDate extends RealDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    FixedDate.parse = RealDate.parse;
    FixedDate.UTC = RealDate.UTC;
    Object.setPrototypeOf(FixedDate, RealDate);
    window.Date = FixedDate;
    Math.random = () => 0.123456789;
  }, { fixedTime });

  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => pageErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    if (/^https?:/i.test(request.url())) externalRequests.push(request.url());
  });

  await page.setContent(fs.readFileSync(V1916_RUNTIME_FILE, 'utf8'), {
    waitUntil: 'load',
    timeout: 120000,
  });
  await page.waitForTimeout(250);
  await installOpaqueOriginShims(page);
  await prepareDeterministicSource(page, variant);
  const snapshot = await captureGovernedSnapshot(page);
  const pending = page.waitForEvent('download');
  await page.evaluate(() => document.querySelector('#exportWordReviewBtn').click());
  const download = await pending;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await download.saveAs(outputPath);
  await context.close();

  const bytes = fs.readFileSync(outputPath);
  const actual = { size: bytes.length, sha256: hashBytes(bytes) };
  if (pageErrors.length || consoleErrors.length || externalRequests.length) {
    throw new Error(`fixture generation errors: ${JSON.stringify({ pageErrors, consoleErrors, externalRequests })}`);
  }
  return {
    path: outputPath,
    snapshot,
    sha256: actual.sha256,
    size: actual.size,
    expected,
    exactIdentityMatch: actual.size === expected.size && actual.sha256 === expected.sha256,
  };
}

function patchCentralDirectoryPermissions(buffer) {
  const out = Buffer.from(buffer);
  const signature = Buffer.from([0x50, 0x4b, 0x01, 0x02]);
  let offset = 0;
  while ((offset = out.indexOf(signature, offset)) >= 0) {
    const nameLength = out.readUInt16LE(offset + 28);
    const extraLength = out.readUInt16LE(offset + 30);
    const commentLength = out.readUInt16LE(offset + 32);
    const name = out.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    out.writeUInt32LE(name.endsWith('/') ? 16 : 0x01800000, offset + 38);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return out;
}

export async function createBlockedDocx(browser, currentDocxPath, outputPath) {
  const context = await browser.newContext({ timezoneId: 'UTC' });
  const page = await context.newPage();
  await page.setContent(fs.readFileSync(V1916_RUNTIME_FILE, 'utf8'), { waitUntil: 'load' });
  const encoded = await page.evaluate(async (base64) => {
    const zip = await JSZip.loadAsync(base64, { base64: true });
    let xml = await zip.file('word/document.xml').async('string');
    xml = xml.replace(
      '</w:body></w:document>',
      '<w:p><w:r><w:t>{{UNRESOLVED_SSP_TOKEN}}</w:t></w:r></w:p></w:body></w:document>',
    );
    zip.file('word/document.xml', xml, { date: new Date(2026, 6, 30, 13, 30, 0) });
    return zip.generateAsync({ type: 'base64', compression: 'DEFLATE', platform: 'DOS' });
  }, fs.readFileSync(currentDocxPath).toString('base64'));
  await context.close();
  const bytes = patchCentralDirectoryPermissions(Buffer.from(encoded, 'base64'));
  fs.writeFileSync(outputPath, bytes);
  const actualSha = hashBytes(bytes);
  return {
    path: outputPath,
    size: bytes.length,
    sha256: actualSha,
    expected: BLOCKED_IDENTITY,
    exactIdentityMatch: bytes.length === BLOCKED_IDENTITY.size && actualSha === BLOCKED_IDENTITY.sha256,
  };
}

export function createNegativeDocxFixtures(root) {
  const malformed = path.join(root, 'malformed_package.docx');
  const traversal = path.join(root, 'path_traversal.docx');
  fs.writeFileSync(malformed, Buffer.from('bm90IGFuIE9wZW4gWE1MIHBhY2thZ2U=', 'base64'));
  fs.writeFileSync(
    traversal,
    Buffer.from(
      'UEsDBBQAAAAAAPGQ/lyDFtyMAQAAAAEAAAANAAAALi4vZXNjYXBlLnR4dHhQSwMEFAAAAAAA8ZD+XMccFzwIAAAACAAAABMAAABbQ29udGVudF9UeXBlc10ueG1sPFR5cGVzLz5QSwECFAMUAAAAAADxkP5cgxbcjAEAAAABAAAADQAAAAAAAAAAAAAAgAEAAAAALi4vZXNjYXBlLnR4dFBLAQIUAxQAAAAAAPGQ/lzHHBc8CAAAAAgAAAATAAAAAAAAAAAAAACAASwAAABbQ29udGVudF9UeXBlc10ueG1sUEsFBgAAAAACAAIAfAAAAGUAAAAAAA==',
      'base64',
    ),
  );
  return { malformed, traversal };
}
