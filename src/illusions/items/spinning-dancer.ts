import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spinning-dancer.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Silver", colors: ["#d9d9d9"] },
  { name: "Blue", colors: ["#4488ff"] },
  { name: "Gold", colors: ["#ffcc00"] },
  { name: "Red", colors: ["#ff4444"] },
  { name: "Violet", colors: ["#cc44ff"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const spinningDancer: IllusionConfig = {
  id: "spinning-dancer",
  name: "Spinning Dancer",
  category: "Cognitive",
  description:
    "A silhouette figure that can be perceived as spinning either clockwise or counter-clockwise — the ambiguity comes from the lack of depth cues in the 2D projection.",
  howTo:
    "Watch the figure rotate. Try to see it spinning clockwise, then try counter-clockwise. Most people can switch at will by focusing on the feet. The direction you see depends on your brain's depth assumption.",
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
      key: "detail",
      label: "Detail",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    { key: "color", label: "Figure Color", type: "color", default: "#d9d9d9" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Silver",
      options: getPaletteOptions(PALETTES),
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
        uDetail: { value: params.detail },
        uColor: { value: hexToVec3(c1) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDetail.value = params.detail;
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default spinningDancer;
