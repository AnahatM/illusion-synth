import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/stepping-feet.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const steppingFeet: IllusionConfig = {
  id: "stepping-feet",
  name: "Stepping Feet",
  category: "Motion",
  description:
    "Two bars moving at identical constant speeds appear to speed up and slow down alternately as they cross black and white stripes — one seems to 'step' while the other glides.",
  howTo:
    "Watch the yellow and blue bars move across the striped background. They move at the exact same speed, but each appears to pause on matching-contrast stripes and speed up on mismatched ones.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.5,
      min: 0.3,
      max: 5,
      step: 0.1,
    },
    {
      key: "barWidth",
      label: "Bar Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "stripeFreq",
      label: "Stripe Frequency",
      type: "slider",
      default: 8,
      min: 3,
      max: 20,
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
        uBarWidth: { value: params.barWidth },
        uStripeFreq: { value: params.stripeFreq },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uBarWidth.value = params.barWidth;
    material.uniforms.uStripeFreq.value = params.stripeFreq;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default steppingFeet;
