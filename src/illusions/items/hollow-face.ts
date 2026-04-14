import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hollow-face.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const hollowFace: IllusionConfig = {
  id: "hollow-face",
  name: "Hollow Face Illusion",
  category: "Depth/Ambiguity",
  description:
    "A concave (hollow) face lit from a rotating source still appears convex — your brain's strong prior for convex faces overrides the actual depth information.",
  howTo:
    "Watch the face as the light rotates around it. Even though the shading is computed for a concave (inverted) surface, the face stubbornly appears to be a normal convex face. This demonstrates the power of face-specific processing in the visual cortex.",
  params: [
    {
      key: "speed",
      label: "Light Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 2,
      step: 0.1,
    },
    {
      key: "depth",
      label: "Depth",
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
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDepth: { value: params.depth },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDepth.value = params.depth;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hollowFace;
