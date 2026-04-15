import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/frequency-doubling.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const frequencyDoubling: IllusionConfig = {
  id: "frequency-doubling",
  name: "Frequency Doubling",
  category: "Motion",
  description:
    "A sinusoidal grating flickering in counterphase (alternating contrast) appears to have twice as many stripes as it actually does. This illusion is linked to magnocellular pathway processing and is used in clinical glaucoma testing.",
  howTo:
    "Watch the flickering grating. The spatial frequency (number of stripes) appears doubled compared to what's actually present. Adjust the speed to see the effect strengthen or weaken. This works because counterphase flicker confuses your spatial frequency detectors.",
  params: [
    { key: "speed", label: "Flicker Speed", type: "slider", default: 2, min: 0.5, max: 6, step: 0.1 },
    { key: "frequency", label: "Spatial Frequency", type: "slider", default: 4, min: 1, max: 12, step: 0.5 },
    { key: "contrast", label: "Contrast", type: "slider", default: 1, min: 0.1, max: 1, step: 0.05 },
    { key: "color1", label: "Color 1", type: "color", default: "#000000" },
    { key: "color2", label: "Color 2", type: "color", default: "#ffffff" },
    { key: "palette", label: "Palette", type: "select", default: "Custom", options: ["Custom", "B/W", "Blue & Gold", "Red & Cyan", "Purple & Lime", "Sunset"] },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uFrequency: { value: params.frequency },
        uContrast: { value: params.contrast },
        uColor1: { value: hexToVec3(params.color1 as string) },
        uColor2: { value: hexToVec3(params.color2 as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uFrequency.value = params.frequency;
    material.uniforms.uContrast.value = params.contrast;
    const [c1, c2] = resolvePalette(params.palette, params.color1, params.color2);
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default frequencyDoubling;
