import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spinning-dots.frag";
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
  { name: "Red", colors: ["#ff4444"] },
  { name: "Gold", colors: ["#ffcc00"] },
  { name: "Cyan", colors: ["#44ddcc"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let mouseRot: MouseRotation | null = null;
const spinningDots: IllusionConfig = {
  id: "spinning-dots",
  name: "Ambiguous Spinning Dots",
  category: "Motion",
  description:
    "Dots on a rotating sphere projected without depth cues. Your brain can perceive it spinning in either direction — and it can spontaneously flip.",
  howTo:
    "Watch the dots rotate. Try to see them spinning clockwise — then try counter-clockwise. Most people can voluntarily switch the perceived direction. Blinking or looking away can trigger a flip. Enable Manual Rotation to explore angles yourself.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.8,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Dot Color", type: "color", default: "#ffffff" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "White",
      options: getPaletteOptions(PALETTES),
    },
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 24,
      min: 8,
      max: 40,
      step: 1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
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
        uDotCount: { value: params.dotCount },
        uDotSize: { value: params.dotSize },
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
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uDotSize.value = params.dotSize;
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

export default spinningDots;
