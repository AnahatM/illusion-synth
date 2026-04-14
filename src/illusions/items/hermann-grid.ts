import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hermann-grid.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const hermannGrid: IllusionConfig = {
  id: "hermann-grid",
  name: "Hermann Grid",
  category: "Geometric",
  description:
    "Dark ghostly dots appear at the intersections of white lines on a black background, but vanish when you look directly at them.",
  howTo:
    "Look at the grid of white lines. You'll see dark spots flickering at the intersections in your peripheral vision. Try to look directly at one — it disappears. The effect is caused by lateral inhibition in your retina.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 3,
      max: 16,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 2.5,
      min: 1,
      max: 5,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hermannGrid;
