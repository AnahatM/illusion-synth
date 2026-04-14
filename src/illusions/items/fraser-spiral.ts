import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/fraser-spiral.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const fraserSpiral: IllusionConfig = {
  id: "fraser-spiral",
  name: "Fraser Spiral",
  category: "Pattern",
  description:
    "Concentric circles with tilted arc segments appear to form a single continuous spiral — but they are actually perfect closed circles.",
  howTo:
    "The pattern appears to be a spiral winding inward, but trace any 'ring' with your finger and you'll find it closes on itself. The tilted micro-elements along each circle trick your brain into connecting adjacent rings.",
  params: [
    {
      key: "rings",
      label: "Ring Count",
      type: "slider",
      default: 10,
      min: 4,
      max: 20,
      step: 1,
    },
    {
      key: "tiltDensity",
      label: "Tilt Density",
      type: "slider",
      default: 8,
      min: 2,
      max: 20,
      step: 1,
    },
    {
      key: "speed",
      label: "Anim Speed",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 3,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRings: { value: params.rings },
        uTiltDensity: { value: params.tiltDensity },
        uSpeed: { value: params.speed },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uRings.value = params.rings;
    material.uniforms.uTiltDensity.value = params.tiltDensity;
    material.uniforms.uSpeed.value = params.speed;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default fraserSpiral;
