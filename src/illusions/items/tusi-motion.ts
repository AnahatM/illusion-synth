import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/tusi-motion.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Blue & Red", colors: ["#2255cc", "#ee4422"] },
  { name: "Gold & Teal", colors: ["#ddaa00", "#00aacc"] },
  { name: "Purple & Green", colors: ["#8822cc", "#22cc44"] },
  { name: "Ghost", colors: ["#99aacc", "#cc9988"] },
  { name: "Classic B&W", colors: ["#eeeeee", "#222222"] },
];

const tusiMotion: IllusionConfig = {
  id: "tusi-motion",
  name: "Tusi Motion (Tusi Couple)",
  category: "Motion",
  tintThumbnail: true,
  description:
    "Multiple dots each oscillate back and forth along a straight diameter of a circle, but their collective motion creates the striking illusion of a single circle of dots rotating smoothly — the Tusi couple.",
  howTo:
    "Watch the ring of coloured dots. Each dot actually moves in a straight line through the centre, but because of their staggered phases they appear to orbit in a perfect circle.",
  params: [
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 16,
      min: 4,
      max: 32,
      step: 1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 2.5,
      step: 0.1,
    },
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.5,
      min: 0.3,
      max: 4.0,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#2255cc" },
    { key: "color2", label: "Color 2", type: "color", default: "#ee4422" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Blue & Red",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDotCount: { value: params.dotCount },
        uDotSize: { value: params.dotSize },
        uSpeed: { value: params.speed },
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
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uDotSize.value = params.dotSize;
    material.uniforms.uSpeed.value = params.speed;
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default tusiMotion;
