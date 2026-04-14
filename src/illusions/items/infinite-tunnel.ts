import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/tunnel.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const infiniteTunnel: IllusionConfig = {
  id: "infinite-tunnel",
  name: "Infinite Tunnel",
  category: "Tunnel",
  description:
    "Zooming concentric rings that create an endless depth illusion.",
  howTo:
    "Stare at the center for 20+ seconds, then look away at a wall or your hand. You should experience a strong motion aftereffect where static objects appear to expand or shrink.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    {
      key: "ringCount",
      label: "Ring Count",
      type: "slider",
      default: 8,
      min: 2,
      max: 20,
      step: 1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#00ff41" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uRingCount: { value: params.ringCount },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
        uShape: { value: 0 },
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
    material.uniforms.uRingCount.value = params.ringCount;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default infiniteTunnel;
