import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/pyramid-illusion.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Stone", colors: ["#111111", "#eeeeee"] },
  { name: "Indigo", colors: ["#04001a", "#ccbbff"] },
  { name: "Brass", colors: ["#1a0c00", "#ffd066"] },
  { name: "Teal & Ice", colors: ["#001a1a", "#c0ffff"] },
  { name: "Blood & Bone", colors: ["#1a0000", "#ffe8e8"] },
];

const pyramidIllusion: IllusionConfig = {
  id: "pyramid-illusion",
  name: "Pyramid Illusion",
  category: "Luminance",
  description:
    "Victor Vasarely's nested-square pattern: concentric diamond-shaped bands with alternating gradient directions create the impression of a stepped 3D pyramid surface, even on a flat screen.",
  howTo:
    "Look at the nested diamond shapes. Each band has a gradual brightness gradient, but adjacent bands reverse the gradient direction. This creates a vivid 3D pyramid appearance. The perceived depth is entirely illusory.",
  params: [
    {
      key: "levels",
      label: "Levels",
      type: "slider",
      default: 6,
      min: 2,
      max: 12,
      step: 1,
    },
    { key: "color1", label: "Dark Color", type: "color", default: "#111111" },
    { key: "color2", label: "Light Color", type: "color", default: "#eeeeee" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Stone",
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
        uLevels: { value: params.levels },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLevels.value = params.levels;
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

export default pyramidIllusion;
