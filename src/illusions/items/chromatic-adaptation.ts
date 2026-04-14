import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/chromatic-adaptation.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const chromaticAdaptation: IllusionConfig = {
  id: "chromatic-adaptation",
  name: "Chromatic Adaptation",
  category: "Color/Brightness",
  description:
    "After staring at a strongly colored image, a neutral gray appears tinted with the complementary color — your photoreceptors temporarily recalibrate.",
  howTo:
    "Stare at the fixation cross during the colored phase (red on left, green on right). When the screen turns gray, the left will appear greenish and the right pinkish. The dividing line helps you compare the two halves.",
  params: [
    {
      key: "adaptDuration",
      label: "Adapt Duration (s)",
      type: "slider",
      default: 6,
      min: 3,
      max: 15,
      step: 1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAdaptDuration: { value: params.adaptDuration },
        uPhase: { value: 0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uAdaptDuration.value = params.adaptDuration;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default chromaticAdaptation;
