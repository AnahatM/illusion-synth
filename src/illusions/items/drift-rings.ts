import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/drift-rings.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const driftRings: IllusionConfig = {
  id: "drift-rings",
  name: "Peripheral Drift Rings",
  category: "Motion",
  description:
    "Concentric rings with asymmetric luminance ramps appear to rotate slowly — some clockwise, some counter-clockwise — even though the image is completely static.",
  howTo:
    "Look at the red center dot. In your peripheral vision the rings appear to slowly rotate in alternating directions. Move your eyes around the image to see the motion restart. This is a static image — nothing is animated.",
  params: [
    {
      key: "rings",
      label: "Rings",
      type: "slider",
      default: 8,
      min: 3,
      max: 14,
      step: 1,
    },
    {
      key: "segments",
      label: "Segments",
      type: "slider",
      default: 20,
      min: 8,
      max: 40,
      step: 4,
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
        uRings: { value: params.rings },
        uSegments: { value: params.segments },
        uContrast: { value: params.contrast },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRings.value = params.rings;
    material.uniforms.uSegments.value = params.segments;
    material.uniforms.uContrast.value = params.contrast;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default driftRings;
