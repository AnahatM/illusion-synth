import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spinning-dots.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const spinningDots: IllusionConfig = {
  id: "spinning-dots",
  name: "Ambiguous Spinning Dots",
  category: "Motion",
  description:
    "Dots on a rotating sphere projected without depth cues. Your brain can perceive it spinning in either direction — and it can spontaneously flip.",
  howTo:
    "Watch the dots rotate. Try to see them spinning clockwise — then try counter-clockwise. Most people can voluntarily switch the perceived direction. Blinking or looking away can trigger a flip.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.8,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Dot Color", type: "color", default: "#00ff41" },
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 24,
      min: 8,
      max: 40,
      step: 1,
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
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uColor: { value: hexToVec3(params.color) },
        uDotCount: { value: params.dotCount },
        uDotSize: { value: params.dotSize },
      },
      transparent: true,
    });

    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uColor.value = hexToVec3(params.color);
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uDotSize.value = params.dotSize;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default spinningDots;
