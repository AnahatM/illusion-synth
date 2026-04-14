import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/phi-phenomenon.frag";
import { hexToVec3 } from "../lib/color-utils";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const phiPhenomenon: IllusionConfig = {
  id: "phi-phenomenon",
  name: "Phi Phenomenon",
  category: "Motion",
  description:
    "Dots that simply alternate on and off in sequence create a compelling illusion of smooth, continuous motion — the basis of all film and animation.",
  howTo:
    "Watch the dots blink in sequence. Even though each dot only turns on and off in place, your brain perceives a single dot moving smoothly from one position to the next. Adjust the speed to find the sweet spot.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 3,
      min: 0.5,
      max: 8,
      step: 0.5,
    },
    {
      key: "dotCount",
      label: "Dot Count",
      type: "slider",
      default: 10,
      min: 4,
      max: 20,
      step: 1,
    },
    {
      key: "spacing",
      label: "Row Spacing",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Dot Color", type: "color", default: "#ffffff" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Custom",
      options: [
        "Custom",
        "B/W",
        "Blue & Gold",
        "Red & Cyan",
        "Purple & Lime",
        "Sunset",
      ],
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
        uSpacing: { value: params.spacing },
        uColor: { value: hexToVec3(params.color) },
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
    material.uniforms.uSpacing.value = params.spacing;
    const [c1] = resolvePalette(params.palette, params.color, params.color);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default phiPhenomenon;
