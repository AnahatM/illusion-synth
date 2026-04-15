import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/stroboscopic-motion.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const stroboscopicMotion: IllusionConfig = {
  id: "stroboscopic-motion",
  name: "Stroboscopic Alternative Motion",
  category: "Motion",
  tintThumbnail: true,
  description:
    "When rows of dots shift position in alternating frames, the visual system can group the motion in two equally valid ways — either as individual elements jumping, or as whole groups sliding. This bistable percept demonstrates how ambiguous motion signals are resolved.",
  howTo:
    "Watch the dots and try to see two interpretations: (1) individual dots hopping sideways, or (2) whole groups sliding as a unit. Consciously try to switch between the two percepts. Adjusting the spacing changes which interpretation dominates.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 2.0,
      step: 0.1,
    },
    {
      key: "spacing",
      label: "Spacing",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#ffcc00" },
    { key: "color2", label: "Color 2", type: "color", default: "#ff4444" },
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
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDotSize: { value: params.dotSize },
        uSpacing: { value: params.spacing },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDotSize.value = params.dotSize;
    material.uniforms.uSpacing.value = params.spacing;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default stroboscopicMotion;
