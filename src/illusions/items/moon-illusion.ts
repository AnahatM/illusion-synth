import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/moon-illusion.frag";
import { hexToVec3 } from "../lib/color-utils";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic Night", colors: ["#fffde0", "#0a0a2e"] },
  { name: "Blood Moon", colors: ["#ffaa44", "#1a0a0a"] },
  { name: "Foggy Night", colors: ["#dddddd", "#222233"] },
  { name: "Aurora", colors: ["#ccffee", "#0a0a20"] },
  { name: "Harvest", colors: ["#ffdd88", "#0f0a00"] },
];

const moonIllusion: IllusionConfig = {
  id: "moon-illusion",
  name: "Moon Illusion",
  category: "Size & Space",
  description:
    "The moon near the horizon appears substantially larger than the same moon high in the sky, even though it subtends the same visual angle. Horizon cues and size constancy scaling create this compelling size illusion.",
  howTo:
    "Compare the two moons: one near the horizon with buildings for context, and one high in the empty sky. They are exactly the same size, but the horizon moon appears much larger. The presence of familiar objects triggers your brain's size constancy mechanism.",
  params: [
    { key: "moonSize", label: "Moon Size", type: "slider", default: 1, min: 0.5, max: 2, step: 0.1 },
    { key: "horizon", label: "Horizon Height", type: "slider", default: 1, min: 0.3, max: 2, step: 0.1 },
    { key: "moonColor", label: "Moon Color", type: "color", default: "#fffde0" },
    { key: "skyColor", label: "Sky Color", type: "color", default: "#0a0a2e" },
    { key: "palette", label: "Palette", type: "select", default: "Classic Night", options: getPaletteOptions(PALETTES) },
  ],

  setup(scene, _camera, params) {
    const [mc, sc] = resolvePaletteColors(params.palette, PALETTES, [params.moonColor, params.skyColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMoonSize: { value: params.moonSize },
        uHorizon: { value: params.horizon },
        uMoonColor: { value: hexToVec3(mc) },
        uSkyColor: { value: hexToVec3(sc) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uMoonSize.value = params.moonSize;
    material.uniforms.uHorizon.value = params.horizon;
    const [mc, sc] = resolvePaletteColors(params.palette, PALETTES, [params.moonColor, params.skyColor]);
    material.uniforms.uMoonColor.value = hexToVec3(mc);
    material.uniforms.uSkyColor.value = hexToVec3(sc);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default moonIllusion;
