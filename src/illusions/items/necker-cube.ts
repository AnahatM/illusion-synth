import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/necker-cube.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const neckerCube: IllusionConfig = {
  id: "necker-cube",
  name: "Necker Cube",
  category: "Impossible",
  description:
    "A wireframe cube drawn without depth cues. Your brain spontaneously flips which face appears in front.",
  howTo:
    "Stare at the rotating wireframe cube. Without shading or perspective cues, your brain cannot determine which face is in front — so it alternates. Try to force a specific interpretation and watch it flip.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.4,
      min: 0,
      max: 2,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#00ff41" },
    {
      key: "size",
      label: "Size",
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
        uSize: { value: params.size },
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
    material.uniforms.uSize.value = params.size;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default neckerCube;
