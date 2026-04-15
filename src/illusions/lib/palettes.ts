// ─── New per-illusion palette API ────────────────────────────────────────────

export interface IllusionPalette {
  name: string;
  /** One color per customisable slot in the illusion (1, 2 or 3 entries). */
  colors: string[];
}

/** Returns the string[] suitable for a param's `options` field. */
export function getPaletteOptions(palettes: IllusionPalette[]): string[] {
  return ["Custom", ...palettes.map((p) => p.name)];
}

/**
 * Resolves the active palette colors.
 * @param paletteName  The currently-selected palette name (or "Custom").
 * @param palettes     The illusion's own curated palette list.
 * @param customColors The current per-color param values as a fallback.
 * @returns            An array of hex strings, one per color slot.
 */
export function resolvePaletteColors(
  paletteName: string,
  palettes: IllusionPalette[],
  customColors: string[],
): string[] {
  if (paletteName === "Custom") return customColors;
  const found = palettes.find((p) => p.name === paletteName);
  if (!found) return customColors;
  // Pad with custom fall-backs if the palette entry is shorter than expected
  const resolved = [...found.colors];
  for (let i = resolved.length; i < customColors.length; i++) {
    resolved.push(customColors[i]);
  }
  return resolved;
}

// ─── Legacy 2-color palette API (kept for existing illusions) ─────────────────

const LEGACY_PALETTES: Record<string, [string, string]> = {
  "B/W": ["#ffffff", "#000000"],
  "Blue & Gold": ["#1a2a6c", "#e8b830"],
  "Red & Cyan": ["#cc2233", "#22cccc"],
  "Purple & Lime": ["#5b2a8c", "#88dd22"],
  Sunset: ["#2d1b4e", "#ff6633"],
};

export function resolvePalette(
  palette: string,
  customC1: string,
  customC2: string,
): [string, string] {
  if (palette === "Custom" || !LEGACY_PALETTES[palette]) {
    return [customC1, customC2];
  }
  return LEGACY_PALETTES[palette];
}
