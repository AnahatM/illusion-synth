import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/benham-top.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const benhamTop: IllusionConfig = {
  id: "benham-top",
  name: "Benham's Top",
  category: "Color",
  description:
    "A spinning black-and-white disc produces the illusion of faint colors (reds, greens, blues) even though it contains no color at all. The effect arises from temporal properties of retinal processing.",
  howTo:
    "Watch the spinning disc. You should perceive faint colors — typically pale reds and blues — appearing on the white half, especially near the arcs. The colors are entirely subjective and produced by temporal differences in how your cones respond.",
  params: [
    { key: "speed", label: "Speed", type: "slider", default: 4, min: 1, max: 12, step: 0.5 },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default benhamTop;
