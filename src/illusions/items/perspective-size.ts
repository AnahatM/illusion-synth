import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/perspective-size.frag";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const perspectiveSize: IllusionConfig = {
  id: "perspective-size",
  name: "Ponzo / Perspective Grid",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Two identical objects placed on a perspective grid appear to be very different sizes — the one near the vanishing point looks much larger even though both are the same.",
  howTo:
    "Both circles are exactly the same size. Drag the position slider to move the blue circle toward the vanishing point — it appears to grow while the red one stays put. Toggle 'Show Proof' to see the equal-size outlines.",
  params: [
    {
      key: "gridSize",
      label: "Grid Lines",
      type: "slider",
      default: 10,
      min: 4,
      max: 16,
      step: 1,
    },
    {
      key: "objPos",
      label: "Object Position",
      type: "slider",
      default: 1.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: "nearColor",
      label: "Near Color",
      type: "color",
      default: "#d9664d",
    },
    {
      key: "farColor",
      label: "Far Color",
      type: "color",
      default: "#4d99d9",
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
    {
      key: "showProof",
      label: "Show Proof",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGridSize: { value: params.gridSize },
        uObjPos: { value: params.objPos },
        uShowProof: { value: params.showProof ? 1.0 : 0.0 },
        uNearColor: { value: new THREE.Color(params.nearColor) },
        uFarColor: { value: new THREE.Color(params.farColor) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGridSize.value = params.gridSize;
    material.uniforms.uObjPos.value = params.objPos;
    material.uniforms.uShowProof.value = params.showProof ? 1.0 : 0.0;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.nearColor,
      params.farColor,
    );
    material.uniforms.uNearColor.value.set(c1);
    material.uniforms.uFarColor.value.set(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default perspectiveSize;
