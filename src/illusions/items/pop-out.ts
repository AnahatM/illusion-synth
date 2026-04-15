import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/pop-out.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "Blue & Red", colors: ["#3388ff", "#ff3333"] },
  { name: "Navy & Orange", colors: ["#2244aa", "#ff8833"] },
  { name: "Forest & Crimson", colors: ["#228844", "#cc2222"] },
  { name: "Purple & Lime", colors: ["#8844cc", "#88ff44"] },
  { name: "Steel & Gold", colors: ["#4466aa", "#ffcc00"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const popOut: IllusionConfig = {
  id: "pop-out",
  name: "Pop-out Visual Search",
  category: "Cognitive",
  tintThumbnail: true,
  description:
    "A single target item that differs from distractors in a basic feature (colour, orientation, or shape) is detected instantly, 'popping out' regardless of how many distractors surround it.",
  howTo:
    "Find the odd one out! When the target differs by a single feature (colour, orientation, or shape), it pops out immediately. This demonstrates pre-attentive parallel processing in the visual system.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 4,
      max: 14,
      step: 1,
    },
    {
      key: "targetType",
      label: "Pop-out Type",
      type: "select",
      default: "Colour",
      options: ["Colour", "Orientation", "Shape"],
    },
    {
      key: "itemSize",
      label: "Item Size",
      type: "slider",
      default: 1.5,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "distractorColor",
      label: "Distractor Color",
      type: "color",
      default: "#3388ff",
    },
    {
      key: "targetColor",
      label: "Target Color",
      type: "color",
      default: "#ff3333",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Blue & Red",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.distractorColor, params.targetColor]);
    const dc = new THREE.Color(c1);
    const tc = new THREE.Color(c2);
    const typeMap: Record<string, number> = {
      Colour: 0,
      Orientation: 1,
      Shape: 2,
    };
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uTargetType: { value: typeMap[params.targetType as string] ?? 0 },
        uItemSize: { value: params.itemSize },
        uDistractorColor: { value: new THREE.Vector3(dc.r, dc.g, dc.b) },
        uTargetColor: { value: new THREE.Vector3(tc.r, tc.g, tc.b) },
        uSeed: { value: Math.random() * 100 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    const typeMap: Record<string, number> = {
      Colour: 0,
      Orientation: 1,
      Shape: 2,
    };
    material.uniforms.uTargetType.value =
      typeMap[params.targetType as string] ?? 0;
    material.uniforms.uItemSize.value = params.itemSize;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.distractorColor, params.targetColor]);
    const dc = new THREE.Color(c1);
    material.uniforms.uDistractorColor.value.set(dc.r, dc.g, dc.b);
    const tc = new THREE.Color(c2);
    material.uniforms.uTargetColor.value.set(tc.r, tc.g, tc.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default popOut;
