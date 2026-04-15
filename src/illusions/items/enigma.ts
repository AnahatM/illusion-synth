import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/enigma.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Navy & Crimson", colors: ["#2244aa", "#cc2244"] },
  { name: "Cobalt & Amber", colors: ["#1144cc", "#dd8800"] },
  { name: "Emerald & Purple", colors: ["#007744", "#882299"] },
  { name: "Deep Monochrome", colors: ["#333333", "#cccccc"] },
  { name: "Teal & Rose", colors: ["#007788", "#cc3366"] },
];

const enigma: IllusionConfig = {
  id: "enigma",
  name: "Enigma",
  category: "Motion",
  description:
    "Isia Leviant's Enigma: concentric colored rings crossed by radial spokes produce a vivid illusion of scintillating rotary motion within the ring gaps, even though nothing actually moves.",
  howTo:
    "Fixate on the central red dot. After a moment, you should perceive shimmering or flowing motion within the spaces between the concentric rings, especially near the radial spoke intersections. The effect is strongest with steady fixation.",
  params: [
    {
      key: "speed",
      label: "Shimmer Speed",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 4,
      step: 0.1,
    },
    {
      key: "ringCount",
      label: "Ring Count",
      type: "slider",
      default: 6,
      min: 3,
      max: 12,
      step: 1,
    },
    { key: "color1", label: "Ring Color 1", type: "color", default: "#2244aa" },
    { key: "color2", label: "Ring Color 2", type: "color", default: "#cc2244" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Navy & Crimson",
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
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
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

export default enigma;
