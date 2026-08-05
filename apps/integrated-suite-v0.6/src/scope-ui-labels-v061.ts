namespace L2G {
  function v061ReadableWords(value: string): string {
    return value.replace(/[-_]+/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  }

  (globalThis as unknown as { L2G: Record<string, unknown> }).L2G.v06Words = v061ReadableWords;
}
