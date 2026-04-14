import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/op-art-waves.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const opArtWaves: IllusionConfig = {
  id: "op-art-waves",
  name: "Op Art Waves",
  category: "Pattern",
  description:
    "Animated black and white wave patterns create a powerful pulsing, flowing motion illusion — a hallmark of 1960s Op Art.",
  howTo:
    "Watch the stripes undulate. The wave motion creates vivid apparent movement even though the stripes are just shifting position. Increase amplitude for stronger effect.",
  params: [
    {
      key: "frequency",
      label: "Frequency",
      type: "slider",
      default: 12,
      min: 4,
      max: 30,
      step: 1,
    },
    {
      key: "amplitude",
      label: "Amplitude",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.5,
      min: 0.2,
      max: 5,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: params.frequency },
        uAmplitude: { value: params.amplitude },
        uSpeed: { value: params.speed },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uFrequency.value = params.frequency;
    material.uniforms.uAmplitude.value = params.amplitude;
    material.uniforms.uSpeed.value = params.speed;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default opArtWaves;
