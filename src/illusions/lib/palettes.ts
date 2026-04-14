const PALETTES: Record<string, [string, string]> = {
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
  if (palette === "Custom" || !PALETTES[palette]) {
    return [customC1, customC2];
  }
  return PALETTES[palette];
}
