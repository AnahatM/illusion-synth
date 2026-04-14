import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/wireframe-torus.frag";
import { setupMouseRotation, type MouseRotation } from "../lib/mouse-rotation";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let mouseRot: MouseRotation | null = null;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const wireframeTorus: IllusionConfig = {
  id: "wireframe-torus",
  name: "Ambiguous Torus",
  category: "Motion",
  description:
    "A wireframe torus rotating in 3D with orthographic projection. The lack of depth cues makes the rotation direction and shape orientation ambiguous.",
  howTo:
    "Stare at the torus — you may perceive it rotating one way, then suddenly flip to the opposite direction. The flat projection removes all depth information, creating a bistable percept. Try focusing on a single ring to trigger a reversal. Enable Manual Rotation to explore angles yourself.",
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
    { key: "color", label: "Color", type: "color", default: "#ffffff" },
    {
      key: "major",
      label: "Major Radius",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "minor",
      label: "Minor Radius",
      type: "slider",
      default: 0.4,
      min: 0.1,
      max: 0.8,
      step: 0.05,
    },
    {
      key: "segments",
      label: "Segments",
      type: "slider",
      default: 16,
      min: 6,
      max: 24,
      step: 1,
    },
    {
      key: "manualRotation",
      label: "Manual Rotation",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params, canvas) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uColor: { value: hexToVec3(params.color) },
        uMajor: { value: params.major },
        uMinor: { value: params.minor },
        uSegments: { value: params.segments },
        uManual: { value: 0 },
        uManualRotX: { value: 0 },
        uManualRotY: { value: 0 },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
    if (canvas) mouseRot = setupMouseRotation(canvas);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uColor.value = hexToVec3(params.color);
    material.uniforms.uMajor.value = params.major;
    material.uniforms.uMinor.value = params.minor;
    material.uniforms.uSegments.value = params.segments;
    const manual = params.manualRotation ? 1 : 0;
    material.uniforms.uManual.value = manual;
    if (mouseRot && manual) {
      material.uniforms.uManualRotX.value = mouseRot.rotX;
      material.uniforms.uManualRotY.value = mouseRot.rotY;
    }
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
    mouseRot?.destroy();
    mouseRot = null;
  },
};

export default wireframeTorus;
