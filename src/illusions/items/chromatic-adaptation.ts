import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/chromatic-adaptation.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Red & Green", colors: ["#cc0000", "#00cc00"] },
  { name: "Cyan & Magenta", colors: ["#00cccc", "#cc00cc"] },
  { name: "Blue & Orange", colors: ["#0044ff", "#ff8800"] },
  { name: "Purple & Yellow", colors: ["#8800ff", "#ffcc00"] },
  { name: "Teal & Red", colors: ["#00aaaa", "#cc2222"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const chromaticAdaptation: IllusionConfig = {
  id: "chromatic-adaptation",
  name: "Chromatic Adaptation",
  category: "Color",
  tintThumbnail: true,
  description:
    "After staring at a strongly colored image, a neutral gray appears tinted with the complementary color — your photoreceptors temporarily recalibrate.",
  howTo:
    "Step 1: Select 'Adapt' and stare at the fixation cross for 15-30 seconds. Step 2: Switch to 'Test (Gray)' — the left half should appear tinted with the complement of the right adaptation color, and vice versa.",
  params: [
    {
      key: "phase",
      label: "Phase",
      type: "select",
      default: "Adapt",
      options: ["Adapt", "Test (Gray)"],
    },
    {
      key: "color1",
      label: "Left Color",
      type: "color",
      default: "#cc0000",
    },
    {
      key: "color2",
      label: "Right Color",
      type: "color",
      default: "#00cc00",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Red & Green",
      options: getPaletteOptions(PALETTES),
    },
    {
      key: "saturation",
      label: "Saturation",
      type: "slider",
      default: 0.9,
      min: 0.3,
      max: 1.0,
      step: 0.05,
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
        uPhase: { value: params.phase === "Adapt" ? 0.0 : 1.0 },
        uLeftColor: { value: hexToVec3(c1) },
        uRightColor: { value: hexToVec3(c2) },
        uSaturation: { value: params.saturation },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uPhase.value = params.phase === "Adapt" ? 0.0 : 1.0;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.color1,
      params.color2,
    ]);
    material.uniforms.uLeftColor.value = hexToVec3(c1);
    material.uniforms.uRightColor.value = hexToVec3(c2);
    material.uniforms.uSaturation.value = params.saturation;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default chromaticAdaptation;
