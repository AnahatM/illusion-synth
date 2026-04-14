import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/kitaoka-drift.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const kitaokaDrift: IllusionConfig = {
  id: "kitaoka-drift",
  name: "Kitaoka Wheel Grid",
  category: "Motion",
  description:
    "A grid of small circular elements with asymmetric luminance profiles creates powerful apparent rotation — alternating tiles seem to spin in opposite directions despite being completely static.",
  howTo:
    "Move your eyes around the pattern. Each circular tile appears to rotate. Tiles in a checkerboard pattern seem to spin in opposite directions. This is purely a static image — your visual system generates the motion percept.",
  params: [
    {
      key: "scale",
      label: "Scale",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "density",
      label: "Density",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2.5,
      step: 0.1,
    },
    {
      key: "contrast",
      label: "Contrast",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 1.2,
      step: 0.05,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uScale: { value: params.scale },
        uDensity: { value: params.density },
        uContrast: { value: params.contrast },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uScale.value = params.scale;
    material.uniforms.uDensity.value = params.density;
    material.uniforms.uContrast.value = params.contrast;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default kitaokaDrift;
