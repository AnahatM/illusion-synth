import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/reverse-phi.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic B&W", colors: ["#111111", "#eeeeee"] },
  { name: "Deep Blue & Cream", colors: ["#050d22", "#ffe8cc"] },
  { name: "Forest & Lime", colors: ["#060f00", "#88ff44"] },
  { name: "Night Purple", colors: ["#0d0622", "#ddaaff"] },
  { name: "Obsidian & Gold", colors: ["#080600", "#ffcc33"] },
];

const reversePhi: IllusionConfig = {
  id: "reverse-phi",
  name: "Reverse Phi Motion",
  category: "Motion",
  description:
    "When a pattern moves in one direction but its contrast simultaneously inverts, the perceived motion direction reverses. Discovered by Anstis & Rogers, this challenges simple motion detection models.",
  howTo:
    "Watch the vertical stripes. The pattern physically shifts to the right each frame, but because the contrast inverts with each shift, you perceive leftward motion. This is the reverse-phi illusion — contrast reversal fools your motion detectors.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 2,
      min: 0.5,
      max: 6,
      step: 0.1,
    },
    {
      key: "stripeCount",
      label: "Stripes",
      type: "slider",
      default: 8,
      min: 3,
      max: 20,
      step: 1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#111111" },
    { key: "color2", label: "Color 2", type: "color", default: "#eeeeee" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic B&W",
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
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uStripeCount: { value: params.stripeCount },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uStripeCount.value = params.stripeCount;
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

  tintThumbnail: true,
};

export default reversePhi;
