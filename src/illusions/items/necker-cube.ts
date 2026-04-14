import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/necker-cube.frag";
import { setupMouseRotation, type MouseRotation } from "../lib/mouse-rotation";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let mouseRot: MouseRotation | null = null;

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
    "Stare at the rotating wireframe cube. Without shading or perspective cues, your brain cannot determine which face is in front — so it alternates. Try to force a specific interpretation and watch it flip. Enable Manual Rotation to explore angles yourself.",
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
    { key: "color", label: "Color", type: "color", default: "#ffffff" },
    {
      key: "size",
      label: "Size",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
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
        uSize: { value: params.size },
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
    material.uniforms.uSize.value = params.size;
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

export default neckerCube;
