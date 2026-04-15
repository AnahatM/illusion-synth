import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/wertheimer-koffka.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

// 3 colors: leftBg, rightBg, ring
const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#222222", "#dddddd", "#888888"] },
  { name: "Twilight", colors: ["#1a1a3a", "#f0e0c0", "#9999bb"] },
  { name: "Blood Split", colors: ["#3a0000", "#ffe0e0", "#cc6666"] },
  { name: "Forest Split", colors: ["#003300", "#e0ffe0", "#55cc55"] },
  { name: "Ocean Split", colors: ["#001133", "#e8f4ff", "#5588bb"] },
];

const wertheimerkoffka: IllusionConfig = {
  id: "wertheimer-koffka",
  name: "Wertheimer-Koffka Ring",
  category: "Luminance",
  description:
    "A uniformly colored ring placed on a background split into two different colors appears to change brightness at the boundary — one half of the ring looks lighter and the other darker, even though the ring is one solid color.",
  howTo:
    "Look at the ring spanning the boundary between the two background halves. The ring is a single uniform color, but the half on the dark background appears lighter and the half on the light background appears darker. This is simultaneous contrast in action.",
  params: [
    {
      key: "ringRadius",
      label: "Ring Radius",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    {
      key: "ringWidth",
      label: "Ring Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "leftBg",
      label: "Left Background",
      type: "color",
      default: "#222222",
    },
    {
      key: "rightBg",
      label: "Right Background",
      type: "color",
      default: "#dddddd",
    },
    {
      key: "ringColor",
      label: "Ring Color",
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
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [
      params.leftBg,
      params.rightBg,
      params.ringColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRingRadius: { value: params.ringRadius },
        uRingWidth: { value: params.ringWidth },
        uLeftBg: { value: hexToVec3(c1) },
        uRightBg: { value: hexToVec3(c2) },
        uRingColor: { value: hexToVec3(c3) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRingRadius.value = params.ringRadius;
    material.uniforms.uRingWidth.value = params.ringWidth;
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [
      params.leftBg,
      params.rightBg,
      params.ringColor,
    ]);
    material.uniforms.uLeftBg.value = hexToVec3(c1);
    material.uniforms.uRightBg.value = hexToVec3(c2);
    material.uniforms.uRingColor.value = hexToVec3(c3);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default wertheimerkoffka;
