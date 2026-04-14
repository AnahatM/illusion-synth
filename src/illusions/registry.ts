import type { IllusionConfig } from "./types";
import hypnoticSpiral from "./items/hypnotic-spiral";
import fibonacciSpiral from "./items/fibonacci-spiral";
import concentricMoire from "./items/concentric-moire";
import gridMoire from "./items/grid-moire";
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
import wireframeSphere from "./items/wireframe-sphere";
import wireframeTorus from "./items/wireframe-torus";
// Easy
import hermannGrid from "./items/hermann-grid";
import scintillatingGrid from "./items/scintillating-grid";
import kanizsaTriangle from "./items/kanizsa-triangle";
import ebbinghausIllusion from "./items/ebbinghaus";
import troxlerFading from "./items/troxler-fading";
import opArtWaves from "./items/op-art-waves";
import lilacChaser from "./items/lilac-chaser";
// Medium
import simultaneousContrast from "./items/simultaneous-contrast";
import munkerWhite from "./items/munker-white";
import zollnerIllusion from "./items/zollner";
import heringIllusion from "./items/hering";
import checkerShadow from "./items/checker-shadow";
import phiPhenomenon from "./items/phi-phenomenon";
import fraserSpiral from "./items/fraser-spiral";
// Hard
import poggendorffIllusion from "./items/poggendorff";
import chromaticAdaptation from "./items/chromatic-adaptation";
import steppingFeet from "./items/stepping-feet";
import motionAftereffect from "./items/motion-aftereffect";
import spinningDancer from "./items/spinning-dancer";
import amesRoom from "./items/ames-room";
import hollowFace from "./items/hollow-face";

export const illusions: IllusionConfig[] = [
  hypnoticSpiral,
  fibonacciSpiral,
  concentricMoire,
  gridMoire,
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
  wireframeSphere,
  wireframeTorus,
  // Easy
  hermannGrid,
  scintillatingGrid,
  kanizsaTriangle,
  ebbinghausIllusion,
  troxlerFading,
  opArtWaves,
  lilacChaser,
  // Medium
  simultaneousContrast,
  munkerWhite,
  zollnerIllusion,
  heringIllusion,
  checkerShadow,
  phiPhenomenon,
  fraserSpiral,
  // Hard
  poggendorffIllusion,
  chromaticAdaptation,
  steppingFeet,
  motionAftereffect,
  spinningDancer,
  amesRoom,
  hollowFace,
];

export const categories = [...new Set(illusions.map((i) => i.category))];

export function getIllusionById(id: string): IllusionConfig | undefined {
  return illusions.find((i) => i.id === id);
}
