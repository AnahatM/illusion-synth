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
import impossibleShapes from "./items/impossible-shapes";
import mccolloughEffect from "./items/mccollough-effect";
import spinningDots from "./items/spinning-dots";
import neckerCube from "./items/necker-cube";
import rubinsVase from "./items/rubins-vase";
import wireframeSphere from "./items/wireframe-sphere";
import wireframeTorus from "./items/wireframe-torus";

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
  impossibleShapes,
  mccolloughEffect,
  spinningDots,
  neckerCube,
  rubinsVase,
  wireframeSphere,
  wireframeTorus,
];

export const categories = [...new Set(illusions.map((i) => i.category))];

export function getIllusionById(id: string): IllusionConfig | undefined {
  return illusions.find((i) => i.id === id);
}
