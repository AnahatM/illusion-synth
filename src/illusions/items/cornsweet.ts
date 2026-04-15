import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/cornsweet.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const cornsweetIllusion: IllusionConfig = {
  id: "cornsweet",
  name: "Craik-O'Brien-Cornsweet",
  category: "Luminance",
  description:
    "Two regions of identical luminance appear to have different brightness due to a specially shaped luminance gradient at their shared edge.",
  howTo:
    "The left and right halves look like different shades of gray, but they are actually the same brightness. Cover the central edge with your finger to see that both sides are identical.",
  params: [
    {
      key: "edgeWidth",
      label: "Edge Width",
      type: "slider",
      default: 1.5,
      min: 0.3,
      max: 4.0,
      step: 0.1,
    },
    {
      key: "contrast",
      label: "Edge Contrast",
      type: "slider",
      default: 1.0,
      min: 0.2,
      max: 2.0,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uEdgeWidth: { value: params.edgeWidth },
        uContrast: { value: params.contrast },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uEdgeWidth.value = params.edgeWidth;
    material.uniforms.uContrast.value = params.contrast;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default cornsweetIllusion;
