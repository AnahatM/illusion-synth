import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/color-drift.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const colorDrift: IllusionConfig = {
  id: "color-drift",
  name: "Color Drift",
  category: "Color",
  description:
    "Slowly shifting hue gradients that create an immersive, flowing color experience.",
  params: [
    {
      key: "hueSpeed",
      label: "Hue Speed",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    {
      key: "saturation",
      label: "Saturation",
      type: "slider",
      default: 0.8,
      min: 0,
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
        uHueSpeed: { value: params.hueSpeed },
        uSaturation: { value: params.saturation },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uHueSpeed.value = params.hueSpeed;
    material.uniforms.uSaturation.value = params.saturation;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default colorDrift;
