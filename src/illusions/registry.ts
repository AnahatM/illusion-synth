import type { IllusionConfig } from "./types";
import hypnoticSpiral from "./items/hypnotic-spiral";
import fibonacciSpiral from "./items/fibonacci-spiral";
import concentricMoire from "./items/concentric-moire";
import gridMoire from "./items/grid-moire";
import afterimageFlash from "./items/afterimage-flash";
import colorDrift from "./items/color-drift";
import breathingSquares from "./items/breathing-squares";
import cafeWall from "./items/cafe-wall";
import rotatingSnakes from "./items/rotating-snakes";
import peripheralDrift from "./items/peripheral-drift";
import infiniteTunnel from "./items/infinite-tunnel";
import vortexWarp from "./items/vortex-warp";
import penroseTriangle from "./items/penrose-triangle";
import impossibleStaircase from "./items/impossible-staircase";

export const illusions: IllusionConfig[] = [
  hypnoticSpiral,
  fibonacciSpiral,
  concentricMoire,
  gridMoire,
  afterimageFlash,
  colorDrift,
  breathingSquares,
  cafeWall,
  rotatingSnakes,
  peripheralDrift,
  infiniteTunnel,
  vortexWarp,
  penroseTriangle,
  impossibleStaircase,
];

export const categories = [...new Set(illusions.map((i) => i.category))];

export function getIllusionById(id: string): IllusionConfig | undefined {
  return illusions.find((i) => i.id === id);
}
