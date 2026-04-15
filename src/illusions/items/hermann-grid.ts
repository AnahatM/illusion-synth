import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hermann-grid.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#d9d9d9", "#0d0d0d"] },
  { name: "Blue Ice", colors: ["#aaddff", "#001133"] },
  { name: "Gold", colors: ["#ffcc44", "#110800"] },
  { name: "Forest", colors: ["#88ffaa", "#001100"] },
  { name: "Crimson", colors: ["#ff8888", "#200000"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const hermannGrid: IllusionConfig = {
  id: "hermann-grid",
  name: "Hermann Grid",
  category: "Geometric",
  description:
    "Dark ghostly dots appear at the intersections of white lines on a black background, but vanish when you look directly at them.",
  howTo:
    "Look at the grid of white lines. You'll see dark spots flickering at the intersections in your peripheral vision. Try to look directly at one — it disappears. The effect is caused by lateral inhibition in your retina.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 3,
      max: 16,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 2.5,
      min: 1,
      max: 5,
      step: 0.1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#d9d9d9",
    },
    {
      key: "bgColor",
      label: "Background Color",
      type: "color",
      default: "#0d0d0d",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
        uLineColor: { value: new THREE.Color(c1) },
        uBgColor: { value: new THREE.Color(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material.uniforms.uLineColor.value.set(c1);
    material.uniforms.uBgColor.value.set(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hermannGrid;
