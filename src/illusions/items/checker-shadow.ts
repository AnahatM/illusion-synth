import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/checker-shadow.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const checkerShadow: IllusionConfig = {
  id: "checker-shadow",
  name: "Checker Shadow (Adelson)",
  category: "Color",
  description:
    "Two squares on a checkerboard — one in shadow, one outside — appear to be very different shades, but they are physically identical in luminance. One of the most famous brightness illusions.",
  howTo:
    "Square A (outside the shadow) and Square B (inside the shadow) look completely different. Toggle 'Show Proof' to see a connecting strip confirming they are the same shade. Your visual system compensates for the shadow, making B look lighter than it is.",
  params: [
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
        uShowProof: { value: params.showProof ? 1.0 : 0.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uShowProof.value = params.showProof ? 1.0 : 0.0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default checkerShadow;
