import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/peripheral-drift.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const peripheralDrift: IllusionConfig = {
  id: "peripheral-drift",
  name: "Peripheral Drift",
  category: "Motion",
  description:
    "Patterns with asymmetric luminance that appear to move in your peripheral vision.",
  howTo:
    "Focus on any single element — the surrounding elements will appear to drift and shimmer. Move your eyes to a different element and the previously drifting ones will settle. This exploits how your brain processes peripheral motion.",
  params: [
    {
      key: "count",
      label: "Element Count",
      type: "slider",
      default: 8,
      min: 3,
      max: 20,
      step: 1,
    },
    {
      key: "contrast",
      label: "Contrast",
      type: "slider",
      default: 0.8,
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffffff" },
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
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uCount: { value: params.count },
        uContrast: { value: params.contrast },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uCount.value = params.count;
    material.uniforms.uContrast.value = params.contrast;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default peripheralDrift;
