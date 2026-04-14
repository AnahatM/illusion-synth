import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/rubins-vase.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const rubinsVase: IllusionConfig = {
  id: "rubins-vase",
  name: "Rubin's Vase",
  category: "Impossible",
  description:
    "The classic figure-ground illusion: do you see a vase, or two faces in profile? Your perception flips between the two interpretations.",
  howTo:
    "Focus on the colored center to see a vase. Then focus on the sides to see two face profiles looking at each other. The subtle brightness shift hints at the alternate interpretation.",
  params: [
    {
      key: "speed",
      label: "Animation Speed",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
    },
    { key: "color1", label: "Vase Color", type: "color", default: "#00ff41" },
    { key: "color2", label: "Face Color", type: "color", default: "#003310" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
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
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default rubinsVase;
