import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/zollner.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Gray Tones", colors: ["#cccccc", "#999999"] },
  { name: "Blue Tones", colors: ["#4488cc", "#224488"] },
  { name: "Red Tones", colors: ["#cc4444", "#882222"] },
  { name: "Gold Tones", colors: ["#ccaa44", "#886622"] },
  { name: "Teal Tones", colors: ["#44aaaa", "#226666"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const zollnerIllusion: IllusionConfig = {
  id: "zollner",
  name: "Zöllner Illusion",
  category: "Geometric",
  description:
    "Parallel horizontal lines appear to converge and diverge because of short diagonal crosshatch lines overlaid at alternating angles.",
  howTo:
    "Look at the long horizontal lines — they are perfectly parallel, but the short diagonal hatches make them appear to tilt. Alternating hatch directions on adjacent lines amplifies the effect.",
  params: [
    {
      key: "lineCount",
      label: "Line Count",
      type: "slider",
      default: 10,
      min: 2,
      max: 24,
      step: 1,
    },
    {
      key: "hatchAngle",
      label: "Hatch Angle (°)",
      type: "slider",
      default: 50,
      min: 5,
      max: 90,
      step: 1,
    },
    {
      key: "hatchDensity",
      label: "Hatch Density",
      type: "slider",
      default: 2,
      min: 0.2,
      max: 5,
      step: 0.1,
    },
    { key: "color1", label: "Line Color", type: "color", default: "#cccccc" },
    { key: "color2", label: "Hatch Color", type: "color", default: "#999999" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Gray Tones",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.color1,
      params.color2,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: params.lineCount },
        uHatchAngle: { value: params.hatchAngle },
        uHatchDensity: { value: params.hatchDensity },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uHatchAngle.value = params.hatchAngle;
    material.uniforms.uHatchDensity.value = params.hatchDensity;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.color1,
      params.color2,
    ]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default zollnerIllusion;
