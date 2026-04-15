import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/t-illusion.frag";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const tIllusion: IllusionConfig = {
  id: "t-illusion",
  name: "T-Illusion",
  category: "Size & Space",
  tintThumbnail: true,
  description:
    "In a T shape made of two equal-length lines, the vertical line appears significantly longer than the horizontal line, even though both are the same length.",
  howTo:
    "Look at the T shape — the vertical stem looks longer than the horizontal top. They are actually the same length. This is the vertical–horizontal illusion enhanced by the T-junction.",
  params: [
    {
      key: "rotation",
      label: "Rotation (°)",
      type: "slider",
      default: 0,
      min: -180,
      max: 180,
      step: 1,
    },
    {
      key: "lineLength",
      label: "Line Length",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "color",
      label: "Line Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#000000",
    },
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
      params.color,
      params.bgColor,
    );
    const fg = new THREE.Color(c1);
    const bg = new THREE.Color(c2);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineLength: { value: params.lineLength },
        uLineWidth: { value: params.lineWidth },
        uAngle: { value: (params.rotation * Math.PI) / 180 },
        uColor: { value: new THREE.Vector3(fg.r, fg.g, fg.b) },
        uBgColor: { value: new THREE.Vector3(bg.r, bg.g, bg.b) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLineLength.value = params.lineLength;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uAngle.value = (params.rotation * Math.PI) / 180;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color,
      params.bgColor,
    );
    const fg = new THREE.Color(c1);
    material.uniforms.uColor.value.set(fg.r, fg.g, fg.b);
    const bg = new THREE.Color(c2);
    material.uniforms.uBgColor.value.set(bg.r, bg.g, bg.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default tIllusion;
