import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/fibonacci-spiral.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic B&W", colors: ["#000000", "#ffffff"] },
  { name: "Indigo Glow", colors: ["#080030", "#8844ff"] },
  { name: "Crimson Night", colors: ["#110000", "#ff4444"] },
  { name: "Forest", colors: ["#001100", "#44cc66"] },
  { name: "Gold Night", colors: ["#080600", "#ffcc00"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const fibonacciSpiral: IllusionConfig = {
  id: "fibonacci-spiral",
  name: "Fibonacci Spiral",
  category: "Pattern",
  description:
    "A golden-ratio spiral with a pulsing effect inspired by the Fibonacci sequence.",
  howTo:
    "Focus on the center and let your peripheral vision absorb the pulsing pattern. The golden ratio creates naturally pleasing proportions that enhance the hypnotic effect.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "zoom",
      label: "Zoom",
      type: "slider",
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffffff" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic B&W",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uZoom: { value: params.zoom },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uZoom.value = params.zoom;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default fibonacciSpiral;
