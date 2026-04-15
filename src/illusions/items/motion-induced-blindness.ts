import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/motion-induced-blindness.frag";
import { hexToVec3 } from "../lib/color-utils";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const motionInducedBlindness: IllusionConfig = {
  id: "motion-induced-blindness",
  name: "Motion Induced Blindness",
  category: "Motion",
  tintThumbnail: true,
  description:
    "Stare at the central green dot while a blue pattern rotates. The three static yellow dots will mysteriously vanish from your awareness, even though they never actually disappear.",
  howTo:
    "Fix your gaze on the small green dot in the center. After a few seconds of steady fixation, one or more of the yellow dots will seem to vanish and reappear. Don't move your eyes!",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 1,
      min: 0.2,
      max: 3,
      step: 0.1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "dotCount",
      label: "Dot Count (Ring)",
      type: "slider",
      default: 3,
      min: 3,
      max: 16,
      step: 1,
    },
    {
      key: "gridMode",
      label: "Grid Pattern",
      type: "select",
      default: "Crosses",
      options: ["Lines", "Crosses"],
    },
    {
      key: "dotMode",
      label: "Dot Arrangement",
      type: "select",
      default: "Triangle",
      options: ["Triangle", "Ring", "Array"],
    },
    {
      key: "crossSize",
      label: "Cross Size",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 1.5,
      step: 0.1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    {
      key: "gridColor",
      label: "Grid Color",
      type: "color",
      default: "#2640e6",
    },
    {
      key: "dotColor",
      label: "Dot Color",
      type: "color",
      default: "#ffe600",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#0d0d0d",
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
    const gridModeVal = params.gridMode === "Lines" ? 0 : 1;
    const dotModeVal =
      params.dotMode === "Ring" ? 1 : params.dotMode === "Array" ? 2 : 0;
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDotSize: { value: params.dotSize },
        uDotCount: { value: params.dotCount },
        uGridMode: { value: gridModeVal },
        uDotMode: { value: dotModeVal },
        uCrossSize: { value: params.crossSize },
        uLineWidth: { value: params.lineWidth },
        uGridColor: { value: hexToVec3(params.gridColor as string) },
        uDotColor: { value: hexToVec3(params.dotColor as string) },
        uBgColor: { value: hexToVec3(params.bgColor as string) },
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
    material.uniforms.uDotCount.value = params.dotCount;
    material.uniforms.uGridMode.value = params.gridMode === "Lines" ? 0 : 1;
    material.uniforms.uDotMode.value =
      params.dotMode === "Ring" ? 1 : params.dotMode === "Array" ? 2 : 0;
    material.uniforms.uCrossSize.value = params.crossSize;
    material.uniforms.uLineWidth.value = params.lineWidth;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.gridColor,
      params.dotColor,
    );
    material.uniforms.uGridColor.value = hexToVec3(c1);
    material.uniforms.uDotColor.value = hexToVec3(c2);
    material.uniforms.uBgColor.value = hexToVec3(params.bgColor as string);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default motionInducedBlindness;
