import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/jastrow.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const jastrowIllusion: IllusionConfig = {
  id: "jastrow",
  name: "Jastrow Illusion",
  category: "Geometric",
  description:
    "Two identical curved shapes (annular sectors) are stacked — the bottom one always appears larger than the top one due to the contrast between the long and short edges.",
  howTo:
    "The two curved shapes are exactly the same size. The bottom one looks bigger because your brain compares the short inner arc of the top with the long outer arc of the bottom. Toggle 'Show Proof' to overlay them.",
  params: [
    {
      key: "offset",
      label: "Separation",
      type: "slider",
      default: 1,
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      key: "showProof",
      label: "Show Proof",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uOffset: { value: params.offset },
        uShowProof: { value: params.showProof ? 1.0 : 0.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uShowProof.value = params.showProof ? 1.0 : 0.0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default jastrowIllusion;
