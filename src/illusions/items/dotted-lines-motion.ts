import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/dotted-lines-motion.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const dottedLinesMotion: IllusionConfig = {
  id: "dotted-lines-motion",
  name: "Dotted Lines Motion Illusion",
  category: "Motion",
  tintThumbnail: true,
  description:
    "Rows of dots with a slight horizontal offset between alternating rows create a vivid illusion of lateral motion. The offset phase relationships between rows trick the visual system into perceiving smooth sliding movement.",
  howTo:
    "Let your gaze wander over the dotted lines. The rows appear to drift sideways in alternating directions, yet the dots barely move. Fixating on a single dot stops the drift; shifting your gaze restarts it.",
  params: [
    {
      key: "lineCount",
      label: "Row Count",
      type: "slider",
      default: 16,
      min: 6,
      max: 28,
      step: 1,
    },
    {
      key: "dotSpacing",
      label: "Dot Spacing",
      type: "slider",
      default: 4.0,
      min: 2.0,
      max: 8.0,
      step: 0.5,
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
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.8,
      min: 0.0,
      max: 2.0,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#2244bb" },
    { key: "color2", label: "Color 2", type: "color", default: "#dd3311" },
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
        uLineCount: { value: params.lineCount },
        uDotSpacing: { value: params.dotSpacing },
        uDotSize: { value: params.dotSize },
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
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uDotSpacing.value = params.dotSpacing;
    material.uniforms.uDotSize.value = params.dotSize;
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

export default dottedLinesMotion;
