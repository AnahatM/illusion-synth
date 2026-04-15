import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/peripheral-curves.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#888888", "#cc2222"] },
  { name: "Steel & Amber", colors: ["#667788", "#ffaa44"] },
  { name: "Forest & Red", colors: ["#336633", "#dd2222"] },
  { name: "Ice & Navy", colors: ["#aaccff", "#001166"] },
  { name: "Ash & Violet", colors: ["#999999", "#8833cc"] },
];

const peripheralCurvedLines: IllusionConfig = {
  id: "peripheral-curved-lines",
  name: "Peripheral Curved Lines",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Perfectly straight horizontal lines appear to curve or bow when viewed against a background of radial and concentric patterns. The surrounding context distorts the perceived geometry of the test lines.",
  howTo:
    "Focus on the centre of the pattern and observe the horizontal lines — they appear to bend. Now cover the surrounding radial pattern with your hand and see that the lines are perfectly straight. Adjust the curvature context strength to modulate the effect.",
  params: [
    {
      key: "lineCount",
      label: "Test Lines",
      type: "slider",
      default: 6,
      min: 2,
      max: 12,
      step: 1,
    },
    {
      key: "curvature",
      label: "Context Strength",
      type: "slider",
      default: 1.0,
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 1.0,
      step: 0.05,
    },
    {
      key: "color1",
      label: "Context Color",
      type: "color",
      default: "#888888",
    },
    { key: "color2", label: "Line Color", type: "color", default: "#cc2222" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: params.lineCount },
        uCurvature: { value: params.curvature },
        uLineWidth: { value: params.lineWidth },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uCurvature.value = params.curvature;
    material.uniforms.uLineWidth.value = params.lineWidth;
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default peripheralCurvedLines;
