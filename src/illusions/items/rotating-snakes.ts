import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/rotating-snakes.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const rotatingSnakes: IllusionConfig = {
  id: "rotating-snakes",
  name: "Rotating Snakes",
  category: "Motion",
  description:
    "A static pattern that appears to rotate in your peripheral vision, inspired by Akiyoshi Kitaoka's famous illusion. The asymmetric luminance sequence (black → dark → light → white) tricks your visual system.",
  howTo:
    "This is a STATIC image — it does not actually move. Don't fixate on one spot. Let your eyes wander across the pattern, or look slightly to the side. The rings should appear to slowly rotate in your peripheral vision. Blinking or shifting your gaze enhances the effect.",
  params: [
    {
      key: "ringCount",
      label: "Rings per Disc",
      type: "slider",
      default: 8,
      min: 3,
      max: 14,
      step: 1,
    },
    {
      key: "density",
      label: "Segment Density",
      type: "slider",
      default: 2,
      min: 1,
      max: 4,
      step: 0.5,
    },
    { key: "color1", label: "Bright Color", type: "color", default: "#ffdd00" },
    { key: "color2", label: "Dark Color", type: "color", default: "#2244aa" },
    { key: "bgColor", label: "Background", type: "color", default: "#e8e8e8" },
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
        uRingCount: { value: params.ringCount },
        uDensity: { value: params.density },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
        uColor3: { value: hexToVec3(params.bgColor) },
      },
      transparent: true,
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uRingCount.value = params.ringCount;
    material.uniforms.uDensity.value = params.density;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
    material.uniforms.uColor3.value = hexToVec3(params.bgColor);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default rotatingSnakes;
