import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/moire-circles.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "White", colors: ["#ffffff"] },
  { name: "Blue", colors: ["#4488ff"] },
  { name: "Gold", colors: ["#ffcc44"] },
  { name: "Red", colors: ["#ff4444"] },
  { name: "Green", colors: ["#44cc44"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
const concentricMoire: IllusionConfig = {
  id: "concentric-moire",
  name: "Concentric Circles Moiré",
  category: "Pattern",
  description:
    "Two overlapping sets of concentric circles creating shifting moiré interference patterns.",
  howTo:
    "Watch the pattern as the circles overlap. The shimmering interference fringes are not actually in the image — your brain creates them from the interaction of the two grids.",
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
      key: "offset",
      label: "Offset",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "thickness",
      label: "Thickness",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#ffffff" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "White",
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
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uOffset: { value: params.offset },
        uThickness: { value: params.thickness },
        uColor: { value: hexToVec3(c1) },
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
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uThickness.value = params.thickness;
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material.uniforms.uColor.value = hexToVec3(c1);
    material.uniforms.uScale.value = params.scale;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default concentricMoire;
