import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/penrose-triangle.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const penroseTriangle: IllusionConfig = {
  id: "penrose-triangle",
  name: "Penrose Triangle",
  category: "Impossible",
  description:
    "A 2D rendering of the impossible Penrose triangle — three bars connected in a way that cannot exist in 3D space.",
  howTo:
    "Follow each bar around the triangle. Each corner appears valid on its own, but the whole shape is geometrically impossible. Adjust thickness and rotation speed to study the paradox.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#00ff41" },
    {
      key: "thickness",
      label: "Thickness",
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
        uThickness: { value: params.thickness },
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
    material.uniforms.uThickness.value = params.thickness;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default penroseTriangle;
