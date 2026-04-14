import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/hollow-face.frag";
import { hexToVec3 } from "../lib/color-utils";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const hollowFace: IllusionConfig = {
  id: "hollow-face",
  name: "Hollow Face Illusion",
  category: "Depth/Ambiguity",
  description:
    "A concave (hollow) face lit from a rotating source still appears convex — your brain's strong prior for convex faces overrides the actual depth information.",
  howTo:
    "Watch the face as the light rotates around it. The shading is computed for a concave (hollow) surface, yet it stubbornly appears convex — that IS the illusion. Your brain's face-specific processing is so strong that it's nearly impossible to perceive the concavity. Try toggling off 'Show Face Features' to see if shading alone still looks convex.",
  params: [
    {
      key: "speed",
      label: "Light Speed",
      type: "slider",
      default: 1.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    {
      key: "depth",
      label: "Depth",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 2,
      step: 0.1,
    },
    {
      key: "showFeatures",
      label: "Show Face Features",
      type: "toggle",
      default: true,
    },
    { key: "color", label: "Skin Color", type: "color", default: "#d9b893" },
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
        uDepth: { value: params.depth },
        uShowFeatures: { value: params.showFeatures ? 1.0 : 0.0 },
        uColor: { value: hexToVec3(params.color) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDepth.value = params.depth;
    material.uniforms.uShowFeatures.value = params.showFeatures ? 1.0 : 0.0;
    const [c1] = resolvePalette(params.palette, params.color, params.color);
    material.uniforms.uColor.value = hexToVec3(c1);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default hollowFace;
