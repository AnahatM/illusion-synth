import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/adelson-plaid.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Charcoal", colors: ["#445566", "#bbccdd"] },
  { name: "Autumn", colors: ["#553322", "#ddcc99"] },
  { name: "Evergreen", colors: ["#1a3322", "#99ccaa"] },
  { name: "Twilight", colors: ["#332244", "#cc99dd"] },
  { name: "Desert", colors: ["#443322", "#ddcc88"] },
];

const adelsonPlaid: IllusionConfig = {
  id: "adelson-plaid",
  name: "Adelson's Corrugated Plaid",
  category: "Luminance",
  description:
    "A plaid pattern on a corrugated (folded) surface creates powerful brightness illusions: patches of identical luminance appear very different depending on whether they fall on the 'lit' or 'shadowed' fold.",
  howTo:
    "Compare plaid patches on the bright and dark sides of the folds. Patches that appear lighter on one side are physically the same brightness as patches that appear darker on the other side. Your visual system compensates for perceived lighting.",
  params: [
    {
      key: "frequency",
      label: "Fold Frequency",
      type: "slider",
      default: 3,
      min: 1,
      max: 8,
      step: 1,
    },
    {
      key: "plaidAngle",
      label: "Plaid Angle",
      type: "slider",
      default: 30,
      min: 10,
      max: 60,
      step: 5,
    },
    {
      key: "color1",
      label: "Plaid Color 1",
      type: "color",
      default: "#445566",
    },
    {
      key: "color2",
      label: "Plaid Color 2",
      type: "color",
      default: "#bbccdd",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Charcoal",
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
        uFrequency: { value: params.frequency },
        uPlaidAngle: { value: params.plaidAngle },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uFrequency.value = params.frequency;
    material.uniforms.uPlaidAngle.value = params.plaidAngle;
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

export default adelsonPlaid;
