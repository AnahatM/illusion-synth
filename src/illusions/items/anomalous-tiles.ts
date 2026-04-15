import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/anomalous-tiles.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Purple & Yellow", colors: ["#cc44cc", "#dddd00"] },
  { name: "Blue & Orange", colors: ["#2244cc", "#ff8833"] },
  { name: "Red & Cyan", colors: ["#cc2222", "#00ccdd"] },
  { name: "Green & Magenta", colors: ["#22cc44", "#cc22cc"] },
  { name: "Classic B&W", colors: ["#222222", "#eeeeee"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const anomalousTiles: IllusionConfig = {
  id: "anomalous-tiles",
  name: "Checkerboard Eyefall",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "A checkerboard of coloured tiles with small inset corner squares creates the illusion that perfectly straight rows are slanting diagonally.",
  howTo:
    "Look at the grid — each tile has two small squares of the opposite colour inset near the corners on one side. The side alternates per row, tricking your visual system into seeing diagonal slant across a perfectly square grid.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 4,
      max: 16,
      step: 1,
    },
    {
      key: "dotSize",
      label: "Corner Size",
      type: "slider",
      default: 0.25,
      min: 0.1,
      max: 0.4,
      step: 0.05,
    },
    { key: "color1", label: "Color A", type: "color", default: "#cc44cc" },
    { key: "color2", label: "Color B", type: "color", default: "#dddd00" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Purple & Yellow",
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
        uDotSize: { value: params.dotSize },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uDotSize.value = params.dotSize;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default anomalousTiles;
