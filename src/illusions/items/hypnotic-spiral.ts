import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spiral.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic B&W", colors: ["#000000", "#ffffff"] },
  { name: "Deep Purple", colors: ["#110022", "#cc88ff"] },
  { name: "Crimson Night", colors: ["#110000", "#ff4444"] },
  { name: "Teal Flash", colors: ["#001111", "#44ffee"] },
  { name: "Gold Night", colors: ["#080600", "#ffcc00"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const hypnoticSpiral: IllusionConfig = {
  id: "hypnotic-spiral",
  name: "Hypnotic Spiral",
  category: "Pattern",
  description:
    "A continuously rotating Archimedes spiral that creates a hypnotic tunnel effect.",
  howTo:
    "Stare at the center of the spiral for 20-30 seconds, then look at a nearby surface. You should see the surroundings appear to warp and breathe.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    {
      key: "direction",
      label: "Direction",
      type: "select",
      default: "CW",
      options: ["CW", "CCW"],
    },
    {
      key: "armCount",
      label: "Arm Count",
      type: "slider",
      default: 3,
      min: 1,
      max: 10,
      step: 1,
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
    {
      key: "scale",
      label: "Scale",
      type: "slider",
      default: 4,
      min: 1,
      max: 10,
      step: 0.5,
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
        uDirection: { value: params.direction === "CW" ? 1.0 : -1.0 },
        uArmCount: { value: params.armCount },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
        uScale: { value: params.scale },
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
    material.uniforms.uDirection.value = params.direction === "CW" ? 1.0 : -1.0;
    material.uniforms.uArmCount.value = params.armCount;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
    material.uniforms.uScale.value = params.scale;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hypnoticSpiral;
