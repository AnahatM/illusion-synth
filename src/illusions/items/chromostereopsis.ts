import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/chromostereopsis.frag";
import { hexToVec3 } from "../lib/color-utils";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const PALETTES: IllusionPalette[] = [
  { name: "Classic", colors: ["#ee1111", "#1111ee", "#111111"] },
  { name: "Warm & Cool", colors: ["#ff6600", "#0066ff", "#0a0a0a"] },
  { name: "Purple & Green", colors: ["#cc00cc", "#00cc44", "#050505"] },
  { name: "Yellow & Blue", colors: ["#ffdd00", "#0044ff", "#080808"] },
  { name: "Crimson & Cyan", colors: ["#cc0022", "#00ccdd", "#060606"] },
];

const chromostereopsis: IllusionConfig = {
  id: "chromostereopsis",
  name: "Chromostereopsis",
  category: "Colour",
  tintThumbnail: true,
  description:
    "Red and blue elements on a dark background appear to float at different depths. Red seems to come forward and blue recedes (or vice-versa) due to chromatic aberration of the eye focusing different wavelengths at different distances.",
  howTo:
    "Look at the red and blue pattern. Without moving your head, one colour should appear closer to you and the other farther away. Try both eyes and one eye — the effect changes. Swap the front/back colours for a reversed experience.",
  params: [
    {
      key: "barCount",
      label: "Element Count",
      type: "slider",
      default: 6,
      min: 3,
      max: 14,
      step: 1,
    },
    {
      key: "barWidth",
      label: "Element Width",
      type: "slider",
      default: 0.4,
      min: 0.1,
      max: 0.8,
      step: 0.05,
    },
    {
      key: "pattern",
      label: "Pattern",
      type: "select",
      default: "Bars",
      options: ["Bars", "Blocks", "Rings"],
    },
    { key: "frontColor", label: "Front Color", type: "color", default: "#ee1111" },
    { key: "backColor", label: "Back Color", type: "color", default: "#1111ee" },
    { key: "bgColor", label: "Background", type: "color", default: "#111111" },
    { key: "palette", label: "Palette", type: "select", default: "Classic", options: getPaletteOptions(PALETTES) },
  ],

  setup(scene, _camera, params) {
    const patternMap: Record<string, number> = { Bars: 0, Blocks: 1, Rings: 2 };
    const [fc, bc, bg] = resolvePaletteColors(params.palette, PALETTES, [params.frontColor, params.backColor, params.bgColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrontColor: { value: hexToVec3(fc) },
        uBackColor: { value: hexToVec3(bc) },
        uBgColor: { value: hexToVec3(bg) },
        uBarCount: { value: params.barCount },
        uBarWidth: { value: params.barWidth },
        uPattern: { value: patternMap[params.pattern as string] ?? 0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    const patternMap: Record<string, number> = { Bars: 0, Blocks: 1, Rings: 2 };
    const [fc, bc, bg] = resolvePaletteColors(params.palette, PALETTES, [params.frontColor, params.backColor, params.bgColor]);
    material.uniforms.uFrontColor.value.copy(hexToVec3(fc));
    material.uniforms.uBackColor.value.copy(hexToVec3(bc));
    material.uniforms.uBgColor.value.copy(hexToVec3(bg));
    material.uniforms.uBarCount.value = params.barCount;
    material.uniforms.uBarWidth.value = params.barWidth;
    material.uniforms.uPattern.value =
      patternMap[params.pattern as string] ?? 0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default chromostereopsis;
