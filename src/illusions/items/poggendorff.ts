import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/poggendorff.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#d9d9d9", "#595959"] },
  { name: "Blue Steel", colors: ["#aaccff", "#334466"] },
  { name: "Amber Wood", colors: ["#ffcc88", "#664422"] },
  { name: "Forest Log", colors: ["#88ffaa", "#334433"] },
  { name: "Crimson Stone", colors: ["#ffaaaa", "#663333"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const poggendorffIllusion: IllusionConfig = {
  id: "poggendorff",
  name: "Poggendorff Illusion",
  category: "Geometric",
  description:
    "A diagonal line passing behind a rectangle appears to be misaligned on the other side, even though it's perfectly continuous.",
  howTo:
    "Look at the diagonal line segments on either side of the gray rectangle. They appear offset from each other, but they are actually perfectly collinear. Adjust the line offset to 0 to confirm, then back to see the illusion.",
  params: [
    {
      key: "rectWidth",
      label: "Rectangle Width",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
    {
      key: "lineOffset",
      label: "Line Offset",
      type: "slider",
      default: 0,
      min: -2,
      max: 2,
      step: 0.1,
    },
    {
      key: "lineColor",
      label: "Line Color",
      type: "color",
      default: "#d9d9d9",
    },
    {
      key: "rectColor",
      label: "Rectangle Color",
      type: "color",
      default: "#595959",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Classic",
      options: getPaletteOptions(PALETTES),
    },
    {
      key: "hideRect",
      label: "Hide Rectangle",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.rectColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRectWidth: { value: params.rectWidth },
        uLineOffset: { value: params.lineOffset },
        uLineColor: { value: new THREE.Color(c1) },
        uRectColor: { value: new THREE.Color(c2) },
        uHideRect: { value: params.hideRect ? 1.0 : 0.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRectWidth.value = params.rectWidth;
    material.uniforms.uLineOffset.value = params.lineOffset;
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [params.lineColor, params.rectColor]);
    material.uniforms.uLineColor.value.set(c1);
    material.uniforms.uRectColor.value.set(c2);
    material.uniforms.uHideRect.value = params.hideRect ? 1.0 : 0.0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default poggendorffIllusion;
