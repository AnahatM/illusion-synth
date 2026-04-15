import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/flash-lag.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Blue & Red", colors: ["#44aaff", "#ff4444"] },
  { name: "Green & Yellow", colors: ["#44ff88", "#ffcc00"] },
  { name: "Cyan & Magenta", colors: ["#00ffff", "#ff0088"] },
  { name: "White & Orange", colors: ["#eeeeee", "#ff8800"] },
  { name: "Violet & Lime", colors: ["#cc44ff", "#88ff44"] },
];

const flashLag: IllusionConfig = {
  id: "flash-lag",
  name: "Flash-Lag Effect",
  category: "Motion",
  description:
    "A briefly flashed object appears to lag behind a continuously moving object, even when they are at the same position at the moment of the flash.",
  howTo:
    "Watch the moving dot travel back and forth. A second dot flashes briefly when the moving dot crosses the center. The flash appears to be behind the moving dot, even though they are aligned. This reveals how your brain extrapolates motion.",
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
      key: "flashDuration",
      label: "Flash Duration",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "movingColor",
      label: "Moving Dot",
      type: "color",
      default: "#44aaff",
    },
    {
      key: "flashColor",
      label: "Flash Dot",
      type: "color",
      default: "#ff4444",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Blue & Red",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.movingColor,
      params.flashColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uFlashDuration: { value: params.flashDuration },
        uMovingColor: { value: hexToVec3(c1) },
        uFlashColor: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.05, 0.05, 0.08) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uFlashDuration.value = params.flashDuration;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.movingColor,
      params.flashColor,
    ]);
    material.uniforms.uMovingColor.value = hexToVec3(c1);
    material.uniforms.uFlashColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default flashLag;
