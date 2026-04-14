import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/poggendorff.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const poggendorffIllusion: IllusionConfig = {
  id: "poggendorff",
  name: "Poggendorff Illusion",
  category: "Geometric",
  description:
    "A diagonal line passing behind a rectangle appears to be misaligned on the other side, even though it's perfectly continuous.",
  howTo:
    "Look at the diagonal line segments on either side of the gray rectangle. They appear offset from each other, but they are actually perfectly collinear. Adjust the line offset to 0 to confirm, then back to see the illusion.",
  params: [
    {
      key: "rectWidth",
      label: "Rectangle Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "lineOffset",
      label: "Line Offset",
      type: "slider",
      default: 0,
      min: -2,
      max: 2,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRectWidth: { value: params.rectWidth },
        uLineOffset: { value: params.lineOffset },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRectWidth.value = params.rectWidth;
    material.uniforms.uLineOffset.value = params.lineOffset;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default poggendorffIllusion;
