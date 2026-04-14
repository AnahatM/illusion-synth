import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/wireframe-sphere.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const wireframeSphere: IllusionConfig = {
  id: "wireframe-sphere",
  name: "Ambiguous Sphere",
  category: "Motion",
  description:
    "A wireframe sphere rotating with orthographic projection. Without depth cues, the rotation direction becomes ambiguous — it can appear to spin either way.",
  howTo:
    "Watch the sphere rotate. Try to see it spinning clockwise, then counterclockwise. Because all lines have equal thickness (no depth shading), your brain can interpret either direction. Blinking often triggers a perceptual flip.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
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
      max: 1.5,
      step: 0.1,
    },
    {
      key: "rings",
      label: "Ring Count",
      type: "slider",
      default: 10,
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
        uSize: { value: params.size },
        uRings: { value: params.rings },
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
    material.uniforms.uRings.value = params.rings;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default wireframeSphere;
