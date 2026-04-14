import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/grid-moire.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const gridMoire: IllusionConfig = {
  id: "grid-moire",
  name: "Grid Moiré",
  category: "Moiré",
  description:
    "Two overlapping line grids rotating relative to each other, creating dynamic moiré patterns.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "density",
      label: "Density",
      type: "slider",
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#00aaff" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDensity: { value: params.density },
        uColor: { value: hexToVec3(params.color) },
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
    material.uniforms.uDensity.value = params.density;
    material.uniforms.uColor.value = hexToVec3(params.color);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default gridMoire;
