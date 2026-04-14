import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/breathing-squares.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const breathingSquares: IllusionConfig = {
  id: "breathing-squares",
  name: "Breathing Squares",
  category: "Op-Art",
  description:
    "Concentric squares alternating in color that appear to pulse and breathe.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    {
      key: "count",
      label: "Square Count",
      type: "slider",
      default: 10,
      min: 3,
      max: 25,
      step: 1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffffff" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uCount: { value: params.count },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
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
    material.uniforms.uCount.value = params.count;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default breathingSquares;
