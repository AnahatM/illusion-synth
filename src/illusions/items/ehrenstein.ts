import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/ehrenstein.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#000000", "#ffffff"] },
  { name: "Indigo", colors: ["#330066", "#ffffff"] },
  { name: "Crimson", colors: ["#660000", "#ffffff"] },
  { name: "Forest", colors: ["#003300", "#ffffff"] },
  { name: "Inverse", colors: ["#ffffff", "#000000"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const ehrensteinIllusion: IllusionConfig = {
  id: "ehrenstein",
  name: "Ehrenstein Illusion",
  category: "Luminance",
  tintThumbnail: true,
  description:
    "Radial lines converge toward a central gap, creating an illusory bright disc at the center that appears brighter than the background — even though the brightness is uniform.",
  howTo:
    "Look at the center where the lines end. You should perceive a glowing bright disc, even though there is nothing there but the same black background. The illusory brightness is created by the line endings.",
  params: [
    {
      key: "lineCount",
      label: "Line Count",
      type: "slider",
      default: 8,
      min: 4,
      max: 12,
      step: 1,
    },
    {
      key: "gapSize",
      label: "Gap Size",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 5,
      min: 2,
      max: 8,
      step: 1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#000000",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#ffffff",
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
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: params.lineCount },
        uGapSize: { value: params.gapSize },
        uLineWidth: { value: params.lineWidth },
        uGridSize: { value: params.gridSize },
        uLineColor: { value: hexToVec3(c1) },
        uBgColor: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uGapSize.value = params.gapSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uGridSize.value = params.gridSize;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material.uniforms.uLineColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default ehrensteinIllusion;
