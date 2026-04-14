import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/anomalous-tiles.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const anomalousTiles: IllusionConfig = {
  id: "anomalous-tiles",
  name: "Anomalous Motion Tiles",
  category: "Motion",
  tintThumbnail: true,
  description:
    "A checkerboard of coloured tiles, each with two small corner squares of the opposite colour, makes you perceive diagonal lines that aren't there.",
  howTo:
    "Look at the grid — the small corner squares are placed on the same side of each row, alternating left/right between rows. This asymmetric placement tricks your visual system into perceiving slanted diagonal lines across the straight grid.",
  params: [
    {
      key: "gridSize",
      label: "Grid Size",
      type: "slider",
      default: 8,
      min: 4,
      max: 16,
      step: 1,
    },
    {
      key: "dotSize",
      label: "Corner Size",
      type: "slider",
      default: 0.25,
      min: 0.1,
      max: 0.4,
      step: 0.05,
    },
    { key: "color1", label: "Color A", type: "color", default: "#cc44cc" },
    { key: "color2", label: "Color B", type: "color", default: "#dddd00" },
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
        uGridSize: { value: params.gridSize },
        uDotSize: { value: params.dotSize },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uDotSize.value = params.dotSize;
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

export default anomalousTiles;
