import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/scintillating-grid.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#0d0d0d", "#ffffff"] },
  { name: "Blue Storm", colors: ["#00001a", "#aaddff"] },
  { name: "Red Storm", colors: ["#1a0000", "#ffaaaa"] },
  { name: "Forest", colors: ["#001100", "#aaffaa"] },
  { name: "Violet Storm", colors: ["#110022", "#ddaaff"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const scintillatingGrid: IllusionConfig = {
  id: "scintillating-grid",
  name: "Scintillating Grid",
  category: "Geometric",
  description:
    "White dots at grid intersections appear to flash and scintillate. Dark spots seem to appear and disappear rapidly in your peripheral vision.",
  howTo:
    "Scan your eyes across the grid. White dots at intersections will seem to blink on and off. The effect is a variant of the Hermann Grid with added luminance contrast at the intersections.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 3,
      max: 16,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 2.5,
      min: 1,
      max: 5,
      step: 0.1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    { key: "color1", label: "Background", type: "color", default: "#0d0d0d" },
    { key: "color2", label: "Lines / Dots", type: "color", default: "#ffffff" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
        uDotSize: { value: params.dotSize },
        uTime: { value: 0 },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uDotSize.value = params.dotSize;
    material.uniforms.uTime.value = time;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default scintillatingGrid;
