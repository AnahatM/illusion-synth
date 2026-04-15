import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/muller-lyer.frag";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const mullerLyer: IllusionConfig = {
  id: "muller-lyer",
  name: "Müller-Lyer Illusion",
  category: "Geometric",
  description:
    "Two lines of identical length appear to be different sizes. The line with outward-pointing arrows looks longer than the one with inward-pointing arrows.",
  howTo:
    "Compare the two horizontal lines. They are exactly the same length, but the top line (outward arrows) appears longer than the bottom line (inward arrows). Measure them to confirm!",
  params: [
    {
      key: "arrowSize",
      label: "Arrow Size",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    {
      key: "lineLength",
      label: "Line Length",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 1.5,
      step: 0.1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#e6e6e6",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#000000",
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uArrowSize: { value: params.arrowSize },
        uLineLength: { value: params.lineLength },
        uLineWidth: { value: params.lineWidth },
        uLineColor: { value: hexToVec3(params.lineColor as string) },
        uBgColor: { value: hexToVec3(params.bgColor as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uArrowSize.value = params.arrowSize;
    material.uniforms.uLineLength.value = params.lineLength;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uLineColor.value = hexToVec3(params.lineColor as string);
    material.uniforms.uBgColor.value = hexToVec3(params.bgColor as string);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default mullerLyer;
