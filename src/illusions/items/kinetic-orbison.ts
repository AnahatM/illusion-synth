import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/kinetic-orbison.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#888888", "#222222"] },
  { name: "Cold Grid", colors: ["#6699cc", "#0a0f18"] },
  { name: "Warm Grid", colors: ["#cc8844", "#180a04"] },
  { name: "Vivid", colors: ["#44ff88", "#0a0020"] },
  { name: "Ghost", colors: ["#aaaaaa", "#111111"] },
];

const kineticOrbison: IllusionConfig = {
  id: "kinetic-orbison",
  name: "Kinetic Orbison Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "A circle and a diameter line rotate over a static rectilinear grid. The grid lines appear to bulge and distort near the circle even though they are perfectly straight and stationary.",
  howTo:
    "Focus on the straight grid lines as the circle rotates over them. The grid appears to warp or flex where the circle passes, even though the lines never actually move. Cover the circle to confirm the grid is rigid.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.8,
      min: 0.1,
      max: 2.5,
      step: 0.1,
    },
    {
      key: "gridLines",
      label: "Grid Lines",
      type: "slider",
      default: 12,
      min: 6,
      max: 24,
      step: 1,
    },
    {
      key: "circleSize",
      label: "Circle Size",
      type: "slider",
      default: 0.45,
      min: 0.2,
      max: 0.8,
      step: 0.05,
    },
    { key: "color1", label: "Grid Color", type: "color", default: "#888888" },
    { key: "color2", label: "Circle Color", type: "color", default: "#222222" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uGridLines: { value: params.gridLines },
        uCircleSize: { value: params.circleSize },
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uGridLines.value = params.gridLines;
    material.uniforms.uCircleSize.value = params.circleSize;
    const [c1, c2] = resolvePaletteColors(
      params.palette,
      PALETTES,
      [params.color1, params.color2],
    );
    material.uniforms.uColor1.value.copy(hexToVec3(c1));
    material.uniforms.uColor2.value.copy(hexToVec3(c2));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default kineticOrbison;
