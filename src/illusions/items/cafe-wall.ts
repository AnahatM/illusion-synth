import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/cafe-wall.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const cafeWall: IllusionConfig = {
  id: "cafe-wall",
  name: "Café Wall",
  category: "Geometric",
  description:
    "Offset rows of alternating black and white tiles separated by thin gray mortar lines create the illusion of non-parallel, wedge-shaped rows.",
  howTo:
    "Look at the horizontal gray mortar lines between tile rows. Despite being perfectly parallel and straight, they appear to tilt and converge. The effect is strongest with the offset at 0.5 (half a tile shift).",
  params: [
    {
      key: "offset",
      label: "Row Offset",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: "rows",
      label: "Rows",
      type: "slider",
      default: 12,
      min: 4,
      max: 24,
      step: 1,
    },
    {
      key: "tilesPerRow",
      label: "Tiles per Row",
      type: "slider",
      default: 9,
      min: 3,
      max: 20,
      step: 1,
    },
    {
      key: "mortarWidth",
      label: "Mortar Width",
      type: "slider",
      default: 0.4,
      min: 0.2,
      max: 3,
      step: 0.1,
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
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uOffset: { value: params.offset },
        uRows: { value: params.rows },
        uTilesPerRow: { value: params.tilesPerRow },
        uMortarWidth: { value: params.mortarWidth },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uRows.value = params.rows;
    material.uniforms.uTilesPerRow.value = params.tilesPerRow;
    material.uniforms.uMortarWidth.value = params.mortarWidth;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default cafeWall;
