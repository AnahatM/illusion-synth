import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/tilted-squares.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const tiltedSquares: IllusionConfig = {
  id: "tilted-squares",
  name: "Tilted Squares",
  category: "Geometric",
  description:
    "Rows of grey and white squares on a black background appear to slant diagonally, even though every row is perfectly horizontal.",
  howTo:
    "The squares are arranged in pairs — one grey, one white — with each row shifted by one cell. The luminance contrast between adjacent squares and the black gaps trick your brain into perceiving a diagonal tilt that isn't there.",
  tintThumbnail: false,
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 12,
      min: 6,
      max: 20,
      step: 1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default tiltedSquares;
