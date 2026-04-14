import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/grid-moire.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const gridMoire: IllusionConfig = {
  id: "grid-moire",
  name: "Grid Moiré",
  category: "Pattern",
  description:
    "Two overlapping line grids rotating relative to each other, creating dynamic moiré patterns.",
  howTo:
    "Watch the center as the grids rotate. Large-scale flowing shapes will emerge from the fine line patterns — these shapes exist only in your perception.",
  params: [
    {
      key: "speed",
      label: "Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "density",
      label: "Density",
      type: "slider",
      default: 2,
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#ffffff" },
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
        uDensity: { value: params.density },
        uColor: { value: hexToVec3(params.color) },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDensity.value = params.density;
    const [c1] = resolvePalette(params.palette, params.color, params.color);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default gridMoire;
