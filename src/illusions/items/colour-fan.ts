import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/colour-fan.frag";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const colourFan: IllusionConfig = {
  id: "colour-fan",
  name: "Colour Fan",
  category: "Colour",
  tintThumbnail: true,
  description:
    "Overlapping coloured fan sectors blend at their boundaries, creating illusory hues in the overlap regions that differ from any of the physical colours present. The visual system incorrectly predicts the mixed colour.",
  howTo:
    "Look at the regions where coloured sectors overlap. The overlapping areas appear to take on entirely new colours not present in the original sectors. Compare the overlap region to each sector individually.",
  params: [
    {
      key: "sectors",
      label: "Sector Count",
      type: "slider",
      default: 6,
      min: 3,
      max: 12,
      step: 1,
    },
    {
      key: "radius",
      label: "Radius",
      type: "slider",
      default: 0.8,
      min: 0.3,
      max: 1.0,
      step: 0.05,
    },
    {
      key: "overlap",
      label: "Overlap",
      type: "slider",
      default: 0.4,
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    { key: "color1", label: "Color 1", type: "color", default: "#ff3333" },
    { key: "color2", label: "Color 2", type: "color", default: "#33cc33" },
    { key: "color3", label: "Color 3", type: "color", default: "#3333ff" },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSectors: { value: params.sectors },
        uRadius: { value: params.radius },
        uOverlap: { value: params.overlap },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
        uColor3: { value: hexToVec3(params.color3) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSectors.value = params.sectors;
    material.uniforms.uRadius.value = params.radius;
    material.uniforms.uOverlap.value = params.overlap;
    material.uniforms.uColor1.value.copy(hexToVec3(params.color1));
    material.uniforms.uColor2.value.copy(hexToVec3(params.color2));
    material.uniforms.uColor3.value.copy(hexToVec3(params.color3));
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default colourFan;
