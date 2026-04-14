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
    "A static pattern that appears to rotate in your peripheral vision, inspired by Akiyoshi Kitaoka's famous illusion. The asymmetric luminance sequence (black → dark → light → white) tricks your visual system.",
  howTo:
    "This is a STATIC image — it does not actually move. Don't fixate on one spot. Let your eyes wander across the pattern, or look slightly to the side. The rings should appear to slowly rotate in your peripheral vision. Blinking or shifting your gaze enhances the effect.",
  params: [
    {
      key: "ringCount",
      label: "Ring Count",
      type: "slider",
      default: 8,
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
    { key: "color1", label: "Bright Color", type: "color", default: "#00ff41" },
    { key: "color2", label: "Dark Color", type: "color", default: "#004411" },
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
        uColor3: { value: new THREE.Vector3(0, 0, 0) },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uRingCount.value = params.ringCount;
    material.uniforms.uDensity.value = params.density;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default rotatingSnakes;
