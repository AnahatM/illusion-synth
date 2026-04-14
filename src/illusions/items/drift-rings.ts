import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/drift-rings.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const driftRings: IllusionConfig = {
  id: "drift-rings",
  name: "Drift Rings (Kitaoka)",
  category: "Motion",
  description:
    "Concentric rings of curved petal-shaped segments with an asymmetric luminance cycle create a powerful illusion of rotation — even though the image is completely static.",
  howTo:
    "Look at the red center dot. In your peripheral vision the rings appear to slowly rotate in alternating directions. Move your eyes around the image to see the motion restart. This is a static image — nothing is animated.",
  tintThumbnail: true,
  params: [
    {
      key: "rings",
      label: "Rings",
      type: "slider",
      default: 8,
      min: 3,
      max: 14,
      step: 1,
    },
    {
      key: "segments",
      label: "Segments",
      type: "slider",
      default: 20,
      min: 8,
      max: 40,
      step: 4,
    },
    { key: "color1", label: "Bright Color", type: "color", default: "#ffdd00" },
    { key: "color2", label: "Dark Color", type: "color", default: "#2244aa" },
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
        uRings: { value: params.rings },
        uSegments: { value: params.segments },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRings.value = params.rings;
    material.uniforms.uSegments.value = params.segments;
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

export default driftRings;
