import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/moire-circles.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const concentricMoire: IllusionConfig = {
  id: "concentric-moire",
  name: "Concentric Circles Moiré",
  category: "Moiré",
  description:
    "Two overlapping sets of concentric circles creating shifting moiré interference patterns.",
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
      key: "offset",
      label: "Offset",
      type: "slider",
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "thickness",
      label: "Thickness",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#00ff88" },
    {
      key: "scale",
      label: "Scale",
      type: "slider",
      default: 4,
      min: 1,
      max: 10,
      step: 0.5,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uOffset: { value: params.offset },
        uThickness: { value: params.thickness },
        uColor: { value: hexToVec3(params.color) },
        uScale: { value: params.scale },
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
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uThickness.value = params.thickness;
    material.uniforms.uColor.value = hexToVec3(params.color);
    material.uniforms.uScale.value = params.scale;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default concentricMoire;
