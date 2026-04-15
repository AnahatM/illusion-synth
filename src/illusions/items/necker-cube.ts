import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/necker-cube.frag";
import { setupMouseRotation, type MouseRotation } from "../lib/mouse-rotation";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "White", colors: ["#ffffff"] },
  { name: "Blue", colors: ["#4488ff"] },
  { name: "Orange", colors: ["#ff8833"] },
  { name: "Teal", colors: ["#44ddcc"] },
  { name: "Violet", colors: ["#cc44ff"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let mouseRot: MouseRotation | null = null;
const neckerCube: IllusionConfig = {
  id: "necker-cube",
  name: "Necker Cube",
  category: "Cognitive",
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
      key: "palette",
      label: "Palette",
      type: "select",
      default: "White",
      options: getPaletteOptions(PALETTES),
    },
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
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uColor: { value: hexToVec3(c1) },
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
    const [c1] = resolvePaletteColors(params.palette, PALETTES, [params.color]);
    material.uniforms.uColor.value = hexToVec3(c1);
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
