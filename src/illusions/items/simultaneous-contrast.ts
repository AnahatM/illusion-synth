import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/simultaneous-contrast.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const simultaneousContrast: IllusionConfig = {
  id: "simultaneous-contrast",
  name: "Simultaneous Contrast",
  category: "Color/Brightness",
  description:
    "A uniform gray bar spans two halves with different backgrounds. The gray looks lighter on the dark side and darker on the light side, yet it's the same shade everywhere.",
  howTo:
    "Look at the horizontal gray bar that stretches across both halves. The left side (dark background) makes the bar look light, while the right side (light background) makes it look dark. Cover the boundary with your finger to see the bar is uniform.",
  params: [
    {
      key: "barWidth",
      label: "Bar Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBarWidth: { value: params.barWidth },
        uContrast: { value: 1.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uBarWidth.value = params.barWidth;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default simultaneousContrast;
