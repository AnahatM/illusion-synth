import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/delboeuf.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

const PALETTES: IllusionPalette[] = [
  { name: "Coral & Gray", colors: ["#e65a1a", "#b3b3b3", "#000000"] },
  { name: "Red & Silver", colors: ["#cc2222", "#aaaaaa", "#000000"] },
  { name: "Blue & Steel", colors: ["#3366ff", "#778899", "#000000"] },
  { name: "Gold & Chrome", colors: ["#ffcc00", "#aaaaaa", "#111111"] },
  { name: "Violet & Pearl", colors: ["#aa44ff", "#cccccc", "#000000"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const delboeufIllusion: IllusionConfig = {
  id: "delboeuf",
  name: "Delboeuf Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Two identical circles appear to be different sizes depending on the ring that surrounds them. A tight ring makes the circle look larger; a wide ring makes it look smaller.",
  howTo:
    "Compare the two orange circles. They are the same size, but the one inside the small ring looks bigger and the one inside the large ring looks smaller. This illusion is used in studies about portion size on plates!",
  params: [
    {
      key: "ringSize",
      label: "Ring Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "circleSize",
      label: "Circle Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 1.5,
      step: 0.1,
    },
    {
      key: "circleColor",
      label: "Circle Color",
      type: "color",
      default: "#e65a1a",
    },
    {
      key: "ringColor",
      label: "Ring Color",
      type: "color",
      default: "#b3b3b3",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#000000",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Coral & Gray",
      options: getPaletteOptions(PALETTES),
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [params.circleColor, params.ringColor, params.bgColor]);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRingSize: { value: params.ringSize },
        uCircleSize: { value: params.circleSize },
        uCircleColor: { value: hexToVec3(c1) },
        uRingColor: { value: hexToVec3(c2) },
        uBgColor: { value: hexToVec3(c3) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRingSize.value = params.ringSize;
    material.uniforms.uCircleSize.value = params.circleSize;
    const [c1, c2, c3] = resolvePaletteColors(params.palette, PALETTES, [params.circleColor, params.ringColor, params.bgColor]);
    material.uniforms.uCircleColor.value = hexToVec3(c1);
    material.uniforms.uRingColor.value = hexToVec3(c2);
    material.uniforms.uBgColor.value = hexToVec3(c3);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default delboeufIllusion;
