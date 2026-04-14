import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/kanizsa-triangle.frag";
import { hexToVec3 } from "../lib/color-utils";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const kanizsaTriangle: IllusionConfig = {
  id: "kanizsa-triangle",
  name: "Kanizsa Triangle",
  category: "Cognitive",
  description:
    "Three pac-man shapes arranged in a triangle create the vivid perception of a bright white triangle that doesn't actually exist — an illusory contour.",
  howTo:
    "Look at the three pac-man shapes. Your brain fills in the edges to perceive a bright white triangle floating above the background. Adjust the gap angle to see how the illusion changes.",
  params: [
    {
      key: "radius",
      label: "Pac-Man Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "gap",
      label: "Gap Angle (°)",
      type: "slider",
      default: 60,
      min: 20,
      max: 120,
      step: 1,
    },
    {
      key: "rotation",
      label: "Rotation",
      type: "slider",
      default: 0,
      min: 0,
      max: 6.28,
      step: 0.01,
    },
    { key: "color", label: "Pac-Man Color", type: "color", default: "#d9d9d9" },
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
        uRadius: { value: params.radius },
        uGap: { value: params.gap },
        uRotation: { value: params.rotation },
        uColor: { value: hexToVec3(params.color) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRadius.value = params.radius;
    material.uniforms.uGap.value = params.gap;
    material.uniforms.uRotation.value = params.rotation;
    const [c1] = resolvePalette(params.palette, params.color, params.color);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default kanizsaTriangle;
