import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/scintillating-grid.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const scintillatingGrid: IllusionConfig = {
  id: "scintillating-grid",
  name: "Scintillating Grid",
  category: "Geometric",
  description:
    "White dots at grid intersections appear to flash and scintillate. Dark spots seem to appear and disappear rapidly in your peripheral vision.",
  howTo:
    "Scan your eyes across the grid. White dots at intersections will seem to blink on and off. The effect is a variant of the Hermann Grid with added luminance contrast at the intersections.",
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
    {
      key: "dotSize",
      label: "Dot Size",
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
        uGridSize: { value: params.gridSize },
        uLineWidth: { value: params.lineWidth },
        uDotSize: { value: params.dotSize },
        uTime: { value: 0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uDotSize.value = params.dotSize;
    material.uniforms.uTime.value = time;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default scintillatingGrid;
