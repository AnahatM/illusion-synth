import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/neon-spreading.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "White & Blue", colors: ["#ffffff", "#3366ff"] },
  { name: "White & Red", colors: ["#ffffff", "#ff3333"] },
  { name: "White & Green", colors: ["#ffffff", "#33cc44"] },
  { name: "White & Amber", colors: ["#ffffff", "#ffaa22"] },
  { name: "White & Violet", colors: ["#ffffff", "#aa44ff"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const neonSpreading: IllusionConfig = {
  id: "neon-spreading",
  name: "Neon Colour Spreading",
  category: "Colour",
  tintThumbnail: true,
  description:
    "When parts of a black line pattern are replaced with coloured arcs, a faint illusory wash of that colour seems to spread across the enclosed region, even though no colour is physically present there.",
  howTo:
    "Look at the coloured arcs at the grid intersections. Notice how a faint tint of colour appears to spread inside the areas enclosed by the arcs, even though those regions are pure white.",
  params: [
    {
      key: "gridSize",
      label: "Ring Count",
      type: "slider",
      default: 6,
      min: 3,
      max: 8,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "arcRadius",
      label: "Center Circle Size",
      type: "slider",
      default: 2.5,
      min: 1.0,
      max: 4.0,
      step: 0.1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "neonColor",
      label: "Neon Color",
      type: "color",
      default: "#3366ff",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "White & Blue",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.neonColor]);
    const lc = new THREE.Color(c1);
    const nc = new THREE.Color(c2);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
        uArcRadius: { value: params.arcRadius },
        uLineColor: { value: new THREE.Vector3(lc.r, lc.g, lc.b) },
        uNeonColor: { value: new THREE.Vector3(nc.r, nc.g, nc.b) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uArcRadius.value = params.arcRadius;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.neonColor]);
    const lc = new THREE.Color(c1);
    material.uniforms.uLineColor.value.set(lc.r, lc.g, lc.b);
    const nc = new THREE.Color(c2);
    material.uniforms.uNeonColor.value.set(nc.r, nc.g, nc.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default neonSpreading;
