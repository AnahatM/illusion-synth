import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/shaded-diamond.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#222222", "#eeeeee"] },
  { name: "Cool", colors: ["#161630", "#e4e8ff"] },
  { name: "Warm", colors: ["#200e00", "#fff0e0"] },
  { name: "Emerald Room", colors: ["#041004", "#d8ffd8"] },
  { name: "Twilight", colors: ["#14001a", "#faddff"] },
];

const shadedDiamond: IllusionConfig = {
  id: "shaded-diamond",
  name: "Shaded Diamond Illusion",
  category: "Luminance",
  description:
    "A diamond of uniform brightness placed on a vertically graded background appears to have a brightness gradient itself — the top looks darker and the bottom lighter — even though it is perfectly uniform.",
  howTo:
    "Look at the diamond shape. It appears to have a gradient — darker at the top and lighter at the bottom. But the diamond is actually a single uniform shade. Cover the background to verify. The surrounding gradient induces the illusion via simultaneous contrast.",
  params: [
    {
      key: "gradientStrength",
      label: "Gradient Strength",
      type: "slider",
      default: 1,
      min: 0,
      max: 2,
      step: 0.1,
    },
    { key: "color1", label: "Dark Color", type: "color", default: "#222222" },
    { key: "color2", label: "Light Color", type: "color", default: "#eeeeee" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
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
        uGradientStrength: { value: params.gradientStrength },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGradientStrength.value = params.gradientStrength;
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

export default shadedDiamond;
