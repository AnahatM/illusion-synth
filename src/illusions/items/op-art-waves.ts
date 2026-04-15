import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/op-art-waves.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic B&W", colors: ["#000000", "#ffffff"] },
  { name: "Deep Blue", colors: ["#000033", "#4488ff"] },
  { name: "Dark Red", colors: ["#330000", "#ff4422"] },
  { name: "Forest", colors: ["#001100", "#44cc55"] },
  { name: "Violet", colors: ["#110022", "#cc44ff"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const opArtWaves: IllusionConfig = {
  id: "op-art-waves",
  name: "Op Art Waves",
  category: "Pattern",
  description:
    "Animated black and white wave patterns create a powerful pulsing, flowing motion illusion — a hallmark of 1960s Op Art.",
  howTo:
    "Watch the stripes undulate. The wave motion creates vivid apparent movement even though the stripes are just shifting position. Increase amplitude for stronger effect.",
  params: [
    {
      key: "frequency",
      label: "Frequency",
      type: "slider",
      default: 12,
      min: 4,
      max: 30,
      step: 1,
    },
    {
      key: "amplitude",
      label: "Amplitude",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.5,
      min: 0.2,
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
        uFrequency: { value: params.frequency },
        uAmplitude: { value: params.amplitude },
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
    material.uniforms.uFrequency.value = params.frequency;
    material.uniforms.uAmplitude.value = params.amplitude;
    material.uniforms.uSpeed.value = params.speed;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default opArtWaves;
