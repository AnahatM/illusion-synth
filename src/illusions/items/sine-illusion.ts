import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/sine-illusion.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Crimson Dark", colors: ["#ff4444", "#1a1a2e"] },
  { name: "Electric", colors: ["#00ffcc", "#080810"] },
  { name: "Gold Night", colors: ["#ffcc00", "#150e00"] },
  { name: "Violet Night", colors: ["#cc44ff", "#0e0816"] },
  { name: "Ice Blue", colors: ["#88ccff", "#050d18"] },
];

const sineIllusion: IllusionConfig = {
  id: "sine-illusion",
  name: "Sine Illusion",
  category: "Geometric",
  description:
    "A row of dots each moving in a straight vertical line appears to trace a sinusoidal wave. The illusion arises from phase offsets between neighboring dots.",
  howTo:
    "Watch the dots move. Each dot moves in a perfectly straight vertical line, but the staggered timing creates the strong impression of a snake-like wave travelling horizontally. Focus on a single dot to see it moves straight.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 16,
      min: 6,
      max: 24,
      step: 1,
    },
    {
      key: "amplitude",
      label: "Amplitude",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    { key: "dotColor", label: "Dot Color", type: "color", default: "#ff4444" },
    { key: "bgColor", label: "Background", type: "color", default: "#1a1a2e" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Crimson Dark",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.dotColor,
      params.bgColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDotCount: { value: params.dotCount },
        uAmplitude: { value: params.amplitude },
        uDotColor: { value: hexToVec3(c1) },
        uBgColor: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uAmplitude.value = params.amplitude;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.dotColor,
      params.bgColor,
    ]);
    material.uniforms.uDotColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default sineIllusion;
