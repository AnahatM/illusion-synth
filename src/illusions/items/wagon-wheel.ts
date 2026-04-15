import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/wagon-wheel.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Steel Night", colors: ["#cccccc", "#1a1a2e"] },
  { name: "Brass & Void", colors: ["#cc9944", "#0a0800"] },
  { name: "Neon Green", colors: ["#44ff88", "#060e06"] },
  { name: "Ghost Blue", colors: ["#aaббff", "#080814"] },
  { name: "Copper Dark", colors: ["#dd7733", "#0e0800"] },
];

const wagonWheel: IllusionConfig = {
  id: "wagon-wheel",
  name: "Wagon-Wheel Effect",
  category: "Motion",
  description:
    "A rotating spoked wheel can appear to slow down, stop, or even reverse direction at certain speeds — an effect normally seen with stroboscopic lighting but which also occurs in continuous viewing.",
  howTo:
    "Adjust the speed and watch the wheel. At certain rates the spokes will appear to rotate backwards or stand still. This temporal aliasing effect occurs because your visual system samples motion in discrete snapshots.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 3,
      min: 0.5,
      max: 10,
      step: 0.1,
    },
    {
      key: "spokeCount",
      label: "Spokes",
      type: "slider",
      default: 12,
      min: 4,
      max: 24,
      step: 1,
    },
    {
      key: "spokeColor",
      label: "Spoke Color",
      type: "color",
      default: "#cccccc",
    },
    { key: "bgColor", label: "Background", type: "color", default: "#1a1a2e" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Steel Night",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.spokeColor,
      params.bgColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uSpokeCount: { value: params.spokeCount },
        uSpokeColor: { value: hexToVec3(c1) },
        uBgColor: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uSpokeCount.value = params.spokeCount;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.spokeColor,
      params.bgColor,
    ]);
    material.uniforms.uSpokeColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default wagonWheel;
