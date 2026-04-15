import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/troxler-fading.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Purple", colors: ["#aa44cc"] },
  { name: "Red", colors: ["#cc4444"] },
  { name: "Blue", colors: ["#4466cc"] },
  { name: "Teal", colors: ["#44aaaa"] },
  { name: "Pink", colors: ["#dd44aa"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const troxlerFading: IllusionConfig = {
  id: "troxler-fading",
  name: "Troxler's Fading",
  category: "Cognitive",
  description:
    "When you fixate on the center cross, the soft colored blobs in your peripheral vision gradually fade and disappear — your brain stops processing unchanging stimuli.",
  howTo:
    "Stare steadily at the black cross in the center without moving your eyes. After 10-20 seconds the colored blobs around the ring will start to fade into the gray background. Any eye movement brings them back instantly.",
  params: [
    {
      key: "ringRadius",
      label: "Ring Radius",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "dotCount",
      label: "Blob Count",
      type: "slider",
      default: 12,
      min: 4,
      max: 20,
      step: 1,
    },
    {
      key: "softness",
      label: "Softness",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 3,
      step: 0.1,
    },
    {
      key: "color",
      label: "Blob Color",
      type: "color",
      default: "#aa44cc",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Purple",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRingRadius: { value: params.ringRadius },
        uDotCount: { value: params.dotCount },
        uSoftness: { value: params.softness },
        uColor: { value: hexToVec3(c1) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRingRadius.value = params.ringRadius;
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uSoftness.value = params.softness;
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default troxlerFading;
