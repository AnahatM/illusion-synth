import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/bulging-checkerboard.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const bulgingCheckerboard: IllusionConfig = {
  id: "bulging-checkerboard",
  name: "Bulging Checkerboard",
  category: "Geometric",
  description:
    "A regular checkerboard with small dots at the intersections appears to bulge and warp, even though every line is perfectly straight.",
  howTo:
    "The checkerboard grid is perfectly regular, but small dots placed at the intersections — coloured to match one diagonal pair of tiles — create local luminance asymmetries. Your visual system interprets these as curvature, making the flat grid appear to bulge outward in some regions and inward in others.",
  tintThumbnail: false,
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 16,
      min: 8,
      max: 24,
      step: 1,
    },
    {
      key: "dotRadius",
      label: "Dot Size",
      type: "slider",
      default: 0.2,
      min: 0.05,
      max: 0.35,
      step: 0.01,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uDotRadius: { value: params.dotRadius },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uDotRadius.value = params.dotRadius;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default bulgingCheckerboard;
