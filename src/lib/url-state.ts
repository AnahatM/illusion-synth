import type { IllusionConfig } from "../illusions/types";

export function encodeState(
  illusion: IllusionConfig,
  params: Record<string, any>,
): string {
  const searchParams = new URLSearchParams();
  for (const def of illusion.params) {
    // Never persist startStop state (e.g. autoCycle) in URL
    if (def.type === "startStop") continue;
    const val = params[def.key];
    if (val !== undefined && val !== def.default) {
      if (def.type === "phaseList") {
        searchParams.set(def.key, JSON.stringify(val));
      } else {
        searchParams.set(def.key, String(val));
      }
    }
  }
  const qs = searchParams.toString();
  return `#/illusion/${illusion.id}${qs ? "?" + qs : ""}`;
}

export function decodeState(
  hash: string,
): { id: string; params: Record<string, string> } | null {
  const match = hash.match(/^#\/illusion\/([^?]+)(?:\?(.*))?$/);
  if (!match) return null;
  const id = match[1];
  const params: Record<string, string> = {};
  if (match[2]) {
    const searchParams = new URLSearchParams(match[2]);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }
  return { id, params };
}

export function applyDecodedParams(
  decoded: Record<string, string>,
  paramDefs: import("../illusions/types").ParamDef[],
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const def of paramDefs) {
    if (decoded[def.key] !== undefined) {
      const raw = decoded[def.key];
      if (def.type === "slider") result[def.key] = parseFloat(raw);
      else if (def.type === "toggle") result[def.key] = raw === "true";
      else if (def.type === "startStop") result[def.key] = false;
      else if (def.type === "phaseList") {
        try { result[def.key] = JSON.parse(raw); } catch { result[def.key] = def.default; }
      } else result[def.key] = raw;
    } else {
      result[def.key] = def.default;
    }
  }
  return result;
}
