import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/rotating-snakes.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const rotatingSnakes: IllusionConfig = {
  id: "rotating-snakes",
  name: "Rotating Snakes",
  category: "Motion",
  description:
    "Circular arrays that appear to rotate when viewed peripherally, inspired by Akiyoshi Kitaoka.",
  howTo:
    "Don't stare at one spot — let your eyes wander across the pattern. The rings should appear to rotate in your peripheral vision. The effect is stronger when you blink or shift your gaze.",
  params: [
    {
      key: "ringCount",
      label: "Ring Count",
      type: "slider",
      default: 6,
      min: 2,
      max: 15,
      step: 1,
    },
    {
      key: "density",
      label: "Density",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 3,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#ffcc00" },
    { key: "color2", label: "Color 2", type: "color", default: "#0066ff" },
    { key: "color3", label: "Color 3", type: "color", default: "#ff3300" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRingCount: { value: params.ringCount },
        uDensity: { value: params.density },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
        uColor3: { value: hexToVec3(params.color3) },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uRingCount.value = params.ringCount;
    material.uniforms.uDensity.value = params.density;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
    material.uniforms.uColor3.value = hexToVec3(params.color3);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default rotatingSnakes;
