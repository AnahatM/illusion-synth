import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/watercolor.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Terracotta", colors: ["#8B2000", "#E87040"] },
  { name: "Ocean", colors: ["#003366", "#4499cc"] },
  { name: "Forest", colors: ["#1a4a00", "#66aa22"] },
  { name: "Violet", colors: ["#440066", "#aa44dd"] },
  { name: "Ink", colors: ["#1a1a1a", "#777777"] },
];

const watercolorIllusion: IllusionConfig = {
  id: "watercolor",
  name: "Watercolor Illusion",
  category: "Colour",
  description:
    "Wavy paired contour lines — a dark outer edge and a lighter colored inner edge — cause the enclosed region to appear filled with a pale tint of the inner contour's color, even though no fill exists.",
  howTo:
    "Look at the enclosed regions formed by the wavy contour lines. The area inside appears tinted with a pale version of the inner contour color, but the background is actually uniform. This is the watercolor spreading effect.",
  params: [
    {
      key: "waviness",
      label: "Waviness",
      type: "slider",
      default: 1,
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      key: "contourWidth",
      label: "Contour Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "shapeCount",
      label: "Shapes",
      type: "slider",
      default: 4,
      min: 1,
      max: 4,
      step: 1,
    },
    {
      key: "outerColor",
      label: "Outer Contour",
      type: "color",
      default: "#cc4400",
    },
    {
      key: "innerColor",
      label: "Inner Contour",
      type: "color",
      default: "#ffaa44",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Terracotta",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.outerColor,
      params.innerColor,
    ]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uWaviness: { value: params.waviness },
        uContourWidth: { value: params.contourWidth },
        uShapeCount: { value: params.shapeCount },
        uOuterColor: { value: hexToVec3(c1) },
        uInnerColor: { value: hexToVec3(c2) },
        uBgColor: { value: new THREE.Vector3(0.97, 0.96, 0.94) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uWaviness.value = params.waviness;
    material.uniforms.uContourWidth.value = params.contourWidth;
    material.uniforms.uShapeCount.value = params.shapeCount;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.outerColor,
      params.innerColor,
    ]);
    material.uniforms.uOuterColor.value = hexToVec3(c1);
    material.uniforms.uInnerColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default watercolorIllusion;
