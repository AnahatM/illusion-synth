import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hering.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "White", colors: ["#ffffff"] },
  { name: "Blue", colors: ["#4488ff"] },
  { name: "Gold", colors: ["#ffcc00"] },
  { name: "Red", colors: ["#ff4444"] },
  { name: "Cyan", colors: ["#44ddcc"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const heringIllusion: IllusionConfig = {
  id: "hering",
  name: "Hering Illusion",
  category: "Geometric",
  description:
    "Two straight, parallel vertical lines appear to bow outward when drawn over a radial burst of lines emanating from a central point.",
  howTo:
    "The two red vertical lines are perfectly straight and parallel. The radiating background lines trick your visual system into perceiving them as curved outward. Cover the background lines to see the truth.",
  params: [
    {
      key: "rayCount",
      label: "Ray Count",
      type: "slider",
      default: 20,
      min: 8,
      max: 40,
      step: 1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "White",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: 2 },
        uRayCount: { value: params.rayCount },
        uLineColor: { value: new THREE.Color(c1) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRayCount.value = params.rayCount;
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor]);
    material.uniforms.uLineColor.value.set(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default heringIllusion;
