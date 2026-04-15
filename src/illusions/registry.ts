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
import jastrowIllusion from "./items/jastrow";
import perspectiveSize from "./items/perspective-size";
// Circular motion illusions
import kitaokaDrift from "./items/kitaoka-drift";
import anomalousTiles from "./items/anomalous-tiles";
import tiltedSquares from "./items/tilted-squares";
import bulgingCheckerboard from "./items/bulging-checkerboard";
import machBands from "./items/mach-bands";
import mullerLyer from "./items/muller-lyer";
import motionInducedBlindness from "./items/motion-induced-blindness";
import delboeufIllusion from "./items/delboeuf";
import ehrensteinIllusion from "./items/ehrenstein";
import tIllusion from "./items/t-illusion";
import cornsweetIllusion from "./items/cornsweet";
import blindSpot from "./items/blind-spot";
import bourdonIllusion from "./items/bourdon";
import neonSpreading from "./items/neon-spreading";
import tiltIllusion from "./items/tilt-illusion";
import popOut from "./items/pop-out";
// Batch 2 from michaelbach.de
import tusiMotion from "./items/tusi-motion";
import rotatoryMoire from "./items/rotatory-moire";
import chromostereopsis from "./items/chromostereopsis";
import kineticOrbison from "./items/kinetic-orbison";
import spineDrift from "./items/spine-drift";
import leaningTowers from "./items/leaning-towers";
import dottedLinesMotion from "./items/dotted-lines-motion";
import colourFan from "./items/colour-fan";
import stroboscopicMotion from "./items/stroboscopic-motion";
import peripheralCurvedLines from "./items/peripheral-curved-lines";
// Batch 3 – famous & high-ROI illusions
import vanishingDots from "./items/vanishing-dots";
import benhamTop from "./items/benham-top";
import watercolorIllusion from "./items/watercolor";
import wertheimerkoffka from "./items/wertheimer-koffka";
import sineIllusion from "./items/sine-illusion";
import flashLag from "./items/flash-lag";
import dynamicEbbinghaus from "./items/dynamic-ebbinghaus";
import enigma from "./items/enigma";
import pinnaBrelstaff from "./items/pinna-brelstaff";
import wagonWheel from "./items/wagon-wheel";
import colourAssimilation from "./items/colour-assimilation";
import reversePhi from "./items/reverse-phi";
import pyramidIllusion from "./items/pyramid-illusion";
import shepardTables from "./items/shepard-tables";
import shadedDiamond from "./items/shaded-diamond";
import adelsonPlaid from "./items/adelson-plaid";
import hermannGridCurved from "./items/hermann-grid-curved";
import frequencyDoubling from "./items/frequency-doubling";
import ternusDisplay from "./items/ternus-display";
import moonIllusion from "./items/moon-illusion";

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
  jastrowIllusion,
  perspectiveSize,
  // Circular motion illusions
  kitaokaDrift,
  anomalousTiles,
  tiltedSquares,
  bulgingCheckerboard,
  // New from michaelbach.de
  machBands,
  mullerLyer,
  motionInducedBlindness,
  delboeufIllusion,
  ehrensteinIllusion,
  tIllusion,
  cornsweetIllusion,
  blindSpot,
  bourdonIllusion,
  neonSpreading,
  tiltIllusion,
  popOut,
  // Batch 2 from michaelbach.de
  tusiMotion,
  rotatoryMoire,
  chromostereopsis,
  kineticOrbison,
  spineDrift,
  leaningTowers,
  dottedLinesMotion,
  colourFan,
  stroboscopicMotion,
  peripheralCurvedLines,
  // Batch 3 – famous & high-ROI illusions
  vanishingDots,
  benhamTop,
  watercolorIllusion,
  wertheimerkoffka,
  sineIllusion,
  flashLag,
  dynamicEbbinghaus,
  enigma,
  pinnaBrelstaff,
  wagonWheel,
  colourAssimilation,
  reversePhi,
  pyramidIllusion,
  shepardTables,
  shadedDiamond,
  adelsonPlaid,
  hermannGridCurved,
  frequencyDoubling,
  ternusDisplay,
  moonIllusion,
];

export const categories = [...new Set(illusions.map((i) => i.category))];

export function getIllusionById(id: string): IllusionConfig | undefined {
  return illusions.find((i) => i.id === id);
}
