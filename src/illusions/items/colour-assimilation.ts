import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/colour-assimilation.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

// 3 colors: base, stripe-left, stripe-right
const PALETTES: IllusionPalette[] = [
  { name: "Red & Blue", colors: ["#cccccc", "#ff3333", "#3333ff"] },
  { name: "Orange & Green", colors: ["#cccccc", "#ff8800", "#33aa33"] },
  { name: "Purple & Yellow", colors: ["#cccccc", "#9922cc", "#ccaa00"] },
  { name: "Cyan & Magenta", colors: ["#cccccc", "#00aacc", "#cc0077"] },
  { name: "Warm & Cool", colors: ["#bbbbbb", "#dd4422", "#2244dd"] },
];

const colourAssimilation: IllusionConfig = {
  id: "colour-assimilation",
  name: "Colour Assimilation",
  category: "Colour",
  description:
    "Thin colored stripes overlaid on a uniform background cause the background to appear tinted toward the stripe color — the opposite of simultaneous contrast. The same gray background takes on different hues depending on the overlaid stripe color.",
  howTo:
    "Both halves have the same base color, but the left half has stripes of one color and the right half has stripes of another. The base color appears to shift toward each stripe color, demonstrating colour assimilation (the Von Bezold spreading effect).",
  params: [
    {
      key: "stripeCount",
      label: "Stripe Count",
      type: "slider",
      default: 30,
      min: 10,
      max: 60,
      step: 1,
    },
    {
      key: "stripeWidth",
      label: "Stripe Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "baseColor",
      label: "Base Color",
      type: "color",
      default: "#cccccc",
    },
    {
      key: "stripeColor1",
      label: "Left Stripe",
      type: "color",
      default: "#ff3333",
    },
    {
      key: "stripeColor2",
      label: "Right Stripe",
      type: "color",
      default: "#3333ff",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Red & Blue",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [
      params.baseColor,
      params.stripeColor1,
      params.stripeColor2,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uStripeCount: { value: params.stripeCount },
        uStripeWidth: { value: params.stripeWidth },
        uBaseColor: { value: hexToVec3(c1) },
        uStripeColor1: { value: hexToVec3(c2) },
        uStripeColor2: { value: hexToVec3(c3) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uStripeCount.value = params.stripeCount;
    material.uniforms.uStripeWidth.value = params.stripeWidth;
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [
      params.baseColor,
      params.stripeColor1,
      params.stripeColor2,
    ]);
    material.uniforms.uBaseColor.value = hexToVec3(c1);
    material.uniforms.uStripeColor1.value = hexToVec3(c2);
    material.uniforms.uStripeColor2.value = hexToVec3(c3);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default colourAssimilation;
