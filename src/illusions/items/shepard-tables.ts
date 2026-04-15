import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/shepard-tables.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Walnut Room", colors: ["#7a4a1a", "#2a2522"] },
  { name: "Oak Hall", colors: ["#b8854a", "#2e2418"] },
  { name: "Slate Marble", colors: ["#999988", "#1a1a1e"] },
  { name: "Steel Blue", colors: ["#4477aa", "#101820"] },
  { name: "Obsidian", colors: ["#888877", "#0e0e0e"] },
];

const shepardTables: IllusionConfig = {
  id: "shepard-tables",
  name: "Shepard's Tables",
  category: "Geometric",
  description:
    "Two parallelogram table tops appear vastly different in shape and size — one looks long and narrow, the other short and wide — yet they are geometrically identical, just rotated 90°.",
  howTo:
    "Compare the two table tops. The left one looks tall and narrow while the right looks wide and shallow, but they are the exact same parallelogram rotated. Your brain interprets the parallelogram edges as depth perspective cues, distorting the perceived aspect ratio.",
  params: [
    {
      key: "separation",
      label: "Separation",
      type: "slider",
      default: 1,
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      key: "tableColor",
      label: "Table Color",
      type: "color",
      default: "#7a4a1a",
    },
    { key: "bgColor", label: "Background", type: "color", default: "#2a2522" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Walnut Room",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.tableColor,
      params.bgColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSeparation: { value: params.separation },
        uTableColor: { value: hexToVec3(c1) },
        uBgColor: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSeparation.value = params.separation;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.tableColor,
      params.bgColor,
    ]);
    material.uniforms.uTableColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default shepardTables;
