import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/vanishing-dots.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#111111", "#888888"] },
  { name: "Night Vision", colors: ["#00ee66", "#003322"] },
  { name: "Deep Sea", colors: ["#001155", "#4499cc"] },
  { name: "Ember", colors: ["#331100", "#cc8833"] },
  { name: "Monochrome", colors: ["#222222", "#aaaaaa"] },
];

const vanishingDots: IllusionConfig = {
  id: "vanishing-dots",
  name: "12 Vanishing Dots",
  category: "Cognitive",
  description:
    "Twelve dark dots are placed at intersections of a gray grid, but your visual system cannot perceive all twelve at once — most seem to vanish from peripheral vision.",
  howTo:
    "Try to see all 12 black dots at the same time. You'll find it impossible — dots in your peripheral vision seem to disappear. This is due to lateral inhibition and the limits of peripheral resolution.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 5,
      min: 3,
      max: 8,
      step: 1,
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
    { key: "dotColor", label: "Dot Color", type: "color", default: "#111111" },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#888888",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.dotColor,
      params.lineColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uDotSize: { value: params.dotSize },
        uDotColor: { value: hexToVec3(c1) },
        uLineColor: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.7, 0.7, 0.7) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uDotSize.value = params.dotSize;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.dotColor,
      params.lineColor,
    ]);
    material.uniforms.uDotColor.value = hexToVec3(c1);
    material.uniforms.uLineColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default vanishingDots;
