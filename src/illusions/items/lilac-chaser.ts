import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/lilac-chaser.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const lilacChaser: IllusionConfig = {
  id: "lilac-chaser",
  name: "Lilac Chaser",
  category: "Motion",
  description:
    "A ring of lilac dots with one removed in sequence. Stare at the center and a green dot appears to chase the gap, then eventually all lilac dots vanish.",
  howTo:
    "Fix your gaze on the central cross. A gap rotates around the ring of lilac dots. After a few seconds you'll see a green dot chasing the gap (negative afterimage). Keep staring and all lilac dots may fade away (Troxler's fading), leaving only a rotating green dot.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 3,
      min: 1,
      max: 8,
      step: 0.5,
    },
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 12,
      min: 6,
      max: 16,
      step: 1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1,
      min: 0.4,
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
        uDotCount: { value: params.dotCount },
        uDotSize: { value: params.dotSize },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uDotSize.value = params.dotSize;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default lilacChaser;
