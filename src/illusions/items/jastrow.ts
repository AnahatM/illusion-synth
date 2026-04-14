import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/jastrow.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const jastrowIllusion: IllusionConfig = {
  id: "jastrow",
  name: "Jastrow Illusion",
  category: "Geometric",
  description:
    "Two identical curved shapes (annular sectors) are stacked — the bottom one always appears larger than the top one due to the contrast between the long and short edges.",
  howTo:
    "The two curved shapes are exactly the same size. The bottom one looks bigger because your brain compares the short inner arc of the top with the long outer arc of the bottom. Toggle 'Show Proof' to overlay them.",
  params: [
    {
      key: "offset",
      label: "Separation",
      type: "slider",
      default: 1,
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      key: "showProof",
      label: "Show Proof",
      type: "toggle",
      default: false,
    },
    { key: "color1", label: "Arc A Color", type: "color", default: "#4d99d9" },
    { key: "color2", label: "Arc B Color", type: "color", default: "#d9734d" },
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
        uShowProof: { value: params.showProof ? 1.0 : 0.0 },
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
    material.uniforms.uShowProof.value = params.showProof ? 1.0 : 0.0;
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

export default jastrowIllusion;
