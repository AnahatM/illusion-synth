import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spiral.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const hypnoticSpiral: IllusionConfig = {
  id: "hypnotic-spiral",
  name: "Hypnotic Spiral",
  category: "Spiral",
  description:
    "A continuously rotating Archimedes spiral that creates a hypnotic tunnel effect.",
  howTo:
    "Stare at the center of the spiral for 20-30 seconds, then look at a nearby surface. You should see the surroundings appear to warp and breathe.",
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
      key: "direction",
      label: "Direction",
      type: "select",
      default: "CW",
      options: ["CW", "CCW"],
    },
    {
      key: "armCount",
      label: "Arm Count",
      type: "slider",
      default: 3,
      min: 1,
      max: 10,
      step: 1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#00ff41" },
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
        uDirection: { value: params.direction === "CW" ? 1.0 : -1.0 },
        uArmCount: { value: params.armCount },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
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
    material.uniforms.uDirection.value = params.direction === "CW" ? 1.0 : -1.0;
    material.uniforms.uArmCount.value = params.armCount;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
    material.uniforms.uScale.value = params.scale;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hypnoticSpiral;
