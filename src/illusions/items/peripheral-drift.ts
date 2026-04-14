import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/peripheral-drift.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const peripheralDrift: IllusionConfig = {
  id: "peripheral-drift",
  name: "Peripheral Drift",
  category: "Motion",
  description:
    "Patterns with asymmetric luminance that appear to move in your peripheral vision.",
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
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uCount: { value: params.count },
        uContrast: { value: params.contrast },
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
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default peripheralDrift;
