import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/fraser-spiral.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#d9d9d9", "#262626"] },
  { name: "Deep Contrast", colors: ["#111111", "#eeeeee"] },
  { name: "Blue Tones", colors: ["#2244aa", "#88bbff"] },
  { name: "Red Tones", colors: ["#882222", "#ffaaaa"] },
  { name: "Gold Tones", colors: ["#664400", "#ffcc88"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const fraserSpiral: IllusionConfig = {
  id: "fraser-spiral",
  name: "Fraser Spiral",
  category: "Geometric",
  description:
    "Concentric circles with tilted arc segments appear to form a single continuous spiral — but they are actually perfect closed circles.",
  howTo:
    "The pattern appears to be a spiral winding inward, but trace any 'ring' with your finger and you'll find it closes on itself. The tilted micro-elements along each circle trick your brain into connecting adjacent rings.",
  params: [
    {
      key: "rings",
      label: "Ring Count",
      type: "slider",
      default: 10,
      min: 4,
      max: 20,
      step: 1,
    },
    {
      key: "tiltDensity",
      label: "Tilt Density",
      type: "slider",
      default: 8,
      min: 2,
      max: 20,
      step: 1,
    },
    {
      key: "speed",
      label: "Anim Speed",
      type: "slider",
      default: 3,
      min: 0,
      max: 6,
      step: 0.1,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#d9d9d9" },
    { key: "color2", label: "Color 2", type: "color", default: "#262626" },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRings: { value: params.rings },
        uTiltDensity: { value: params.tiltDensity },
        uSpeed: { value: params.speed },
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
    material.uniforms.uRings.value = params.rings;
    material.uniforms.uTiltDensity.value = params.tiltDensity;
    material.uniforms.uSpeed.value = params.speed;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.color1, params.color2]);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default fraserSpiral;
