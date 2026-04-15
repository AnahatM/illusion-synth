import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/dynamic-ebbinghaus.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Orange & Blue", colors: ["#ff8800", "#4488ff"] },
  { name: "Red & Teal", colors: ["#ee2233", "#22ccaa"] },
  { name: "Purple & Gold", colors: ["#aa22ee", "#ddaa00"] },
  { name: "Green & Pink", colors: ["#22cc55", "#ff44aa"] },
  { name: "Coral & Ice", colors: ["#ff6644", "#88ccee"] },
];

const dynamicEbbinghaus: IllusionConfig = {
  id: "dynamic-ebbinghaus",
  name: "Dynamic Ebbinghaus",
  category: "Cognitive",
  description:
    "An animated version of the Ebbinghaus illusion where the surrounding circles continuously change size, making the two identical center circles appear to pulse and change in opposing directions.",
  howTo:
    "Compare the two center circles. They are always the same size, but as the surrounding circles animate — growing on one side while shrinking on the other — the center circles appear to change size in opposite directions.",
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
      key: "surroundSize",
      label: "Surround Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "surroundCount",
      label: "Surround Count",
      type: "slider",
      default: 8,
      min: 4,
      max: 12,
      step: 1,
    },
    {
      key: "centerColor",
      label: "Center Color",
      type: "color",
      default: "#ff8800",
    },
    {
      key: "surroundColor",
      label: "Surround Color",
      type: "color",
      default: "#4488ff",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Orange & Blue",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.centerColor,
      params.surroundColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uSurroundSize: { value: params.surroundSize },
        uSurroundCount: { value: params.surroundCount },
        uCenterColor: { value: hexToVec3(c1) },
        uSurroundColor: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.06, 0.06, 0.08) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uSurroundSize.value = params.surroundSize;
    material.uniforms.uSurroundCount.value = params.surroundCount;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.centerColor,
      params.surroundColor,
    ]);
    material.uniforms.uCenterColor.value = hexToVec3(c1);
    material.uniforms.uSurroundColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default dynamicEbbinghaus;
