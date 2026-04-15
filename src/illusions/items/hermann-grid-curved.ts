import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hermann-grid-curved.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#d9d9d9", "#0d0d0d"] },
  { name: "Blue Ice", colors: ["#99ccff", "#050a14"] },
  { name: "Gold Dark", colors: ["#ddaa44", "#080600"] },
  { name: "Forest Night", colors: ["#66cc66", "#04090a"] },
  { name: "Copper", colors: ["#cc8844", "#0a0600"] },
];

const hermannGridCurved: IllusionConfig = {
  id: "hermann-grid-curved",
  name: "Hermann Grid Curved",
  category: "Geometric",
  description:
    "A curved variant of the classic Hermann Grid: barrel distortion bends the grid lines, yet the ghostly dark dots still appear at the intersections. The curvature adds a new dimension to the lateral-inhibition effect.",
  howTo:
    "Look at the curved grid. Just like the straight Hermann Grid, dark phantom dots appear at the intersections in your peripheral vision and vanish when you look directly at them. The curvature of the lines also creates additional geometric distortion.",
  params: [
    { key: "gridSize", label: "Grid Size", type: "slider", default: 8, min: 3, max: 16, step: 1 },
    { key: "lineWidth", label: "Line Width", type: "slider", default: 1, min: 0.3, max: 3, step: 0.1 },
    { key: "curvature", label: "Curvature", type: "slider", default: 1, min: -2, max: 3, step: 0.1 },
    { key: "lineColor", label: "Line Color", type: "color", default: "#d9d9d9" },
    { key: "bgColor", label: "Background", type: "color", default: "#0d0d0d" },
    { key: "palette", label: "Palette", type: "select", default: "Classic", options: getPaletteOptions(PALETTES) },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
        uCurvature: { value: params.curvature },
        uLineColor: { value: hexToVec3(c1) },
        uBgColor: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uCurvature.value = params.curvature;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.bgColor]);
    material.uniforms.uLineColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default hermannGridCurved;
