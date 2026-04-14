import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/motion-aftereffect.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const motionAftereffect: IllusionConfig = {
  id: "motion-aftereffect",
  name: "Motion Aftereffect (Waterfall)",
  category: "Motion",
  description:
    "After staring at a moving pattern for several seconds, a static pattern appears to drift in the opposite direction — the 'waterfall illusion' discovered in ancient Greece.",
  howTo:
    "Fix your gaze on the red cross while the pattern contracts inward. When it stops (green cross), the static pattern will appear to expand outward. The longer you adapt, the stronger the aftereffect.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.5,
      min: 0.5,
      max: 4,
      step: 0.1,
    },
    {
      key: "frequency",
      label: "Frequency",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uFrequency: { value: params.frequency },
        uPhase: { value: 0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uFrequency.value = params.frequency;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default motionAftereffect;
