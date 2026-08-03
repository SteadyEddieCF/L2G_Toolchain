interface Window {
  __L2G_RELEASE__: L2G.AppReleaseInfo;
  __L2G_CONTRACT_REGISTRY__: L2G.ContractRegistry;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;
}

namespace L2G {
  export const WORKSPACES: Array<{ id: WorkspaceId; label: string; icon: string; description: string }> = [
    { id: "overview", label: "Overview", icon: "⌂", description: "Factual engagement awareness, next work, and local project state." },
    { id: "pre-engagement", label: "Pre-Engagement", icon: "◫", description: "Low-authority engagement identity, objectives, and participants." },
    { id: "evidence", label: "Evidence", icon: "▤", description: "Foundation shell only. Production ingestion and OCR are intentionally excluded." },
    { id: "scope", label: "Scope", icon: "◇", description: "Foundation shell only. No authoritative scope decisions are created in this release." },
    { id: "practice-review", label: "Practice Review", icon: "☑", description: "Foundation shell only. No CMMC conclusions or evidence-sufficiency decisions are calculated." },
    { id: "ssp", label: "SSP", icon: "▣", description: "Foundation shell only. Governed SSP content remains in the standalone SSP release." },
    { id: "deliverables", label: "Deliverables", icon: "⇩", description: "Read-only compatibility catalog and future output boundary." },
    { id: "reviews-actions", label: "Reviews & Actions", icon: "!", description: "Synthetic review-transition examples and append-oriented history." }
  ];

  export function field(label: string, name: string, value: string, disabled: string): string {
    return `<label class="field"><span>${escapeHtml(label)}</span><input data-engagement-field="${name}" value="${escapeAttribute(value)}" ${disabled} maxlength="160" /></label>`;
  }

  export function byId(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Required UI element is missing: ${id}`);
    return element;
  }

  export function findId(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  }

  export function escapeAttribute(value: string): string {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  export function formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }

  export function safeFilename(value: string): string {
    const result = value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_").trim().slice(0, 100);
    return result || "L2G_Project";
  }

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

  export function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
