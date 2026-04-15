import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/vortex-warp.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic B&W", colors: ["#000000", "#ffffff"] },
  { name: "Indigo Twist", colors: ["#000022", "#6644ff"] },
  { name: "Red Vortex", colors: ["#220000", "#ff4422"] },
  { name: "Teal Warp", colors: ["#001111", "#44ffdd"] },
  { name: "Gold Flash", colors: ["#110600", "#ffcc00"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const vortexWarp: IllusionConfig = {
  id: "vortex-warp",
  name: "Vortex Warp",
  category: "Pattern",
  description:
    "A twisting distortion field that warps space into a hypnotic vortex.",
  howTo:
    "Focus on the center and let the twisted spiral arms draw your eye inward. After 30 seconds, look at a flat surface — you should see a strong warping aftereffect.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    {
      key: "twist",
      label: "Twist",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 3,
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
        uTwist: { value: params.twist },
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
    material.uniforms.uTwist.value = params.twist;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default vortexWarp;
