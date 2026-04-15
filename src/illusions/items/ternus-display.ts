import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/ternus-display.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const ternusDisplay: IllusionConfig = {
  id: "ternus-display",
  name: "Ternus Display",
  category: "Motion",
  description:
    "Three dots alternate between two frames with one dot shifting position. With short blank intervals, only the end element appears to jump ('element motion'). With longer intervals, all three dots appear to shift together ('group motion').",
  howTo:
    "Watch the three dots. Adjust the ISI (inter-stimulus interval) slider. With short ISI, you see one dot jumping from one end to the other. With longer ISI, all three dots appear to move as a group. This demonstrates bistable apparent motion.",
  params: [
    { key: "speed", label: "Speed", type: "slider", default: 1.5, min: 0.5, max: 4, step: 0.1 },
    { key: "dotSpacing", label: "Dot Spacing", type: "slider", default: 1, min: 0.5, max: 2, step: 0.1 },
    { key: "isi", label: "ISI (Blank Gap)", type: "slider", default: 0.5, min: 0, max: 2, step: 0.1 },
    { key: "dotColor", label: "Dot Color", type: "color", default: "#ffcc00" },
    { key: "bgColor", label: "Background", type: "color", default: "#1a1a2e" },
    { key: "palette", label: "Palette", type: "select", default: "Custom", options: ["Custom", "B/W", "Blue & Gold", "Red & Cyan", "Purple & Lime", "Sunset"] },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: params.speed },
        uDotSpacing: { value: params.dotSpacing },
        uISI: { value: params.isi },
        uDotColor: { value: hexToVec3(params.dotColor as string) },
        uBgColor: { value: hexToVec3(params.bgColor as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uSpeed.value = params.speed;
    material.uniforms.uDotSpacing.value = params.dotSpacing;
    material.uniforms.uISI.value = params.isi;
    const [c1, c2] = resolvePalette(params.palette, params.dotColor, params.bgColor);
    material.uniforms.uDotColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default ternusDisplay;
