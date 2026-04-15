import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/spine-drift.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const spineDrift: IllusionConfig = {
  id: "spine-drift",
  name: "Spine Drift Illusion",
  category: "Motion",
  tintThumbnail: true,
  description:
    "Rows of short oblique line segments arranged in a zigzag 'spine' pattern appear to drift or slide sideways even though the image is completely static. The offset between adjacent rows creates a strong motion signal.",
  howTo:
    "Look at the pattern with a relaxed gaze or let your eyes wander. The rows of angled dashes seem to slide gently sideways. Fixating firmly on one spot should freeze the motion — move your eyes again and the drift returns.",
  params: [
    {
      key: "rows",
      label: "Rows",
      type: "slider",
      default: 14,
      min: 6,
      max: 24,
      step: 1,
    },
    {
      key: "columns",
      label: "Columns",
      type: "slider",
      default: 14,
      min: 6,
      max: 24,
      step: 1,
    },
    {
      key: "shift",
      label: "Row Shift",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      key: "dotSize",
      label: "Element Size",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 2.0,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#1144aa" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffcc00" },
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
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRows: { value: params.rows },
        uColumns: { value: params.columns },
        uShift: { value: params.shift },
        uDotSize: { value: params.dotSize },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRows.value = params.rows;
    material.uniforms.uColumns.value = params.columns;
    material.uniforms.uShift.value = params.shift;
    material.uniforms.uDotSize.value = params.dotSize;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default spineDrift;
