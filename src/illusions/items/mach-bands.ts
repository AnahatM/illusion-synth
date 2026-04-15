import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/mach-bands.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const machBands: IllusionConfig = {
  id: "mach-bands",
  name: "Mach Bands",
  category: "Luminance",
  description:
    "A series of flat gray steps appear to have bright and dark bands at the boundaries between each step, even though each step is a perfectly uniform shade of gray.",
  howTo:
    "Look at the edges where two gray steps meet. You will see a subtle bright strip on the lighter side and a dark strip on the darker side. These bands are not really there — cover the boundary to verify each step is uniform.",
  params: [
    {
      key: "bands",
      label: "Number of Bands",
      type: "slider",
      default: 6,
      min: 2,
      max: 12,
      step: 1,
    },
    {
      key: "contrast",
      label: "Contrast",
      type: "slider",
      default: 0.8,
      min: 0.2,
      max: 1,
      step: 0.05,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBands: { value: params.bands },
        uContrast: { value: params.contrast },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uBands.value = params.bands;
    material.uniforms.uContrast.value = params.contrast;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default machBands;
