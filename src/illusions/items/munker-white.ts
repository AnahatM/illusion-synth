import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/munker-white.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const munkerWhite: IllusionConfig = {
  id: "munker-white",
  name: "Munker-White Illusion",
  category: "Color/Brightness",
  description:
    "Identical gray bars appear markedly different in lightness depending on whether they are placed on black or white stripes — a powerful brightness assimilation effect.",
  howTo:
    "Compare the two gray vertical bars. They are physically the exact same shade of gray, but the one overlaid on white stripes looks darker than the one on black stripes. This is the opposite of simultaneous contrast.",
  params: [
    {
      key: "stripeFreq",
      label: "Stripe Frequency",
      type: "slider",
      default: 20,
      min: 8,
      max: 40,
      step: 1,
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
      key: "showProof",
      label: "Show Proof",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uStripeFreq: { value: params.stripeFreq },
        uBarWidth: { value: params.barWidth },
        uShowProof: { value: params.showProof ? 1.0 : 0.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uStripeFreq.value = params.stripeFreq;
    material.uniforms.uBarWidth.value = params.barWidth;
    material.uniforms.uShowProof.value = params.showProof ? 1.0 : 0.0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default munkerWhite;
