import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/pinna-brelstaff.frag";
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
  { name: "Deep Indigo", colors: ["#050a20", "#c8d8ff"] },
  { name: "Dark Amber", colors: ["#140500", "#ffcc44"] },
  { name: "Forest Night", colors: ["#020c02", "#88ee44"] },
  { name: "Obsidian & Crimson", colors: ["#0a0004", "#ee2244"] },
];

const pinnaBrelstaff: IllusionConfig = {
  id: "pinna-brelstaff",
  name: "Pinna-Brelstaff Illusion",
  category: "Motion",
  description:
    "Concentric rings of tilted micropatterns create a vivid illusion of spiralling motion when you move toward or away from the fixation point, even though the rings are perfectly circular.",
  howTo:
    "Fixate on the red center dot, then move your head toward and away from the screen (or scroll to zoom). The rings will appear to rotate — one direction when approaching, the opposite when retreating. The rotating animation simulates this approach/retreat.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 3,
      step: 0.1,
    },
    {
      key: "ringCount",
      label: "Ring Count",
      type: "slider",
      default: 6,
      min: 3,
      max: 8,
      step: 1,
    },
    {
      key: "tilt",
      label: "Tilt Amount",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 2,
      step: 0.1,
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
        uRingCount: { value: params.ringCount },
        uTilt: { value: params.tilt },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.45, 0.45, 0.45) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uRingCount.value = params.ringCount;
    material.uniforms.uTilt.value = params.tilt;
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

export default pinnaBrelstaff;
