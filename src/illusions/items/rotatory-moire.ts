import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/rotatory-moire.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const rotatoryMoire: IllusionConfig = {
  id: "rotatory-moire",
  name: "Rotatory Moiré Patterns",
  category: "Luminance",
  tintThumbnail: true,
  description:
    "Two identical radial line patterns overlaid with one slowly rotating produce dramatic, large-scale moiré interference patterns that appear to swirl and pulsate.",
  howTo:
    "Watch the centre and periphery. As one set of radial lines rotates over the other, slowly evolving moiré spirals and rings appear seeming to expand or contract. The patterns move far faster than the actual rotation.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 2.0,
      step: 0.1,
    },
    {
      key: "lineCount",
      label: "Line Count",
      type: "slider",
      default: 24,
      min: 8,
      max: 60,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 0.3,
      min: 0.05,
      max: 0.8,
      step: 0.05,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffffff" },
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
        uLineWidth: { value: params.lineWidth },
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
    material.uniforms.uLineWidth.value = params.lineWidth;
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

export default rotatoryMoire;
