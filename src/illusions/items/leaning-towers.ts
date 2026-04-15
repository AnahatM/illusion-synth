import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/leaning-towers.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const leaningTowers: IllusionConfig = {
  id: "leaning-towers",
  name: "Leaning Towers Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Two identical, perfectly parallel rectangles (towers) placed side by side appear to lean away from each other. The visual system interprets the converging perspective cues incorrectly when the images share an edge.",
  howTo:
    "Look at the two towers. They appear to diverge at the top as if leaning apart, yet they are pixel-for-pixel identical and perfectly parallel. Adjust separation to strengthen or weaken the illusion.",
  params: [
    {
      key: "separation",
      label: "Separation",
      type: "slider",
      default: 0.55,
      min: 0.1,
      max: 1.2,
      step: 0.05,
    },
    {
      key: "towerWidth",
      label: "Tower Width",
      type: "slider",
      default: 0.18,
      min: 0.08,
      max: 0.35,
      step: 0.01,
    },
    {
      key: "towerHeight",
      label: "Tower Height",
      type: "slider",
      default: 0.8,
      min: 0.3,
      max: 0.95,
      step: 0.05,
    },
    {
      key: "color1",
      label: "Tower 1 Color",
      type: "color",
      default: "#cc8844",
    },
    {
      key: "color2",
      label: "Tower 2 Color",
      type: "color",
      default: "#cc8844",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Custom",
      options: [
        "Custom",
        "B/W",
        "Blue & Gold",
        "Red & Cyan",
        "Purple & Lime",
        "Sunset",
      ],
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSeparation: { value: params.separation },
        uTowerWidth: { value: params.towerWidth },
        uTowerHeight: { value: params.towerHeight },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSeparation.value = params.separation;
    material.uniforms.uTowerWidth.value = params.towerWidth;
    material.uniforms.uTowerHeight.value = params.towerHeight;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default leaningTowers;
