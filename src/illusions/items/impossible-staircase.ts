import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/impossible-staircase.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const impossibleStaircase: IllusionConfig = {
  id: "impossible-staircase",
  name: "Impossible Staircase",
  category: "Impossible",
  description:
    "An Escher-inspired looping staircase — four flights of steps that each ascend yet impossibly return to where they started.",
  howTo:
    "Follow the highlighted step as it travels around the staircase. Each side appears to go up, yet the loop returns to the starting height — an impossible construction known as the Penrose stairs.",
  params: [
    {
      key: "speed",
      label: "Animation Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#00ff41" },
    {
      key: "stepCount",
      label: "Steps per Side",
      type: "slider",
      default: 8,
      min: 4,
      max: 16,
      step: 1,
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
        uStepCount: { value: params.stepCount },
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
    material.uniforms.uStepCount.value = params.stepCount;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default impossibleStaircase;
