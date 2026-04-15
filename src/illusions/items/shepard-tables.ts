import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/shepard-tables.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const shepardTables: IllusionConfig = {
  id: "shepard-tables",
  name: "Shepard's Tables",
  category: "Geometric",
  description:
    "Two parallelogram table tops appear vastly different in shape and size — one looks long and narrow, the other short and wide — yet they are geometrically identical, just rotated 90°.",
  howTo:
    "Compare the two table tops. The left one looks tall and narrow while the right looks wide and shallow, but they are the exact same parallelogram rotated. Your brain interprets the parallelogram edges as depth perspective cues, distorting the perceived aspect ratio.",
  params: [
    { key: "separation", label: "Separation", type: "slider", default: 1, min: 0, max: 3, step: 0.1 },
    { key: "tableColor", label: "Table Color", type: "color", default: "#8B6914" },
    { key: "bgColor", label: "Background", type: "color", default: "#f0f0f0" },
    { key: "palette", label: "Palette", type: "select", default: "Custom", options: ["Custom", "B/W", "Blue & Gold", "Red & Cyan", "Purple & Lime", "Sunset"] },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSeparation: { value: params.separation },
        uTableColor: { value: hexToVec3(params.tableColor as string) },
        uBgColor: { value: hexToVec3(params.bgColor as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSeparation.value = params.separation;
    const [c1, c2] = resolvePalette(params.palette, params.tableColor, params.bgColor);
    material.uniforms.uTableColor.value = hexToVec3(c1);
    material.uniforms.uBgColor.value = hexToVec3(c2);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },

  tintThumbnail: true,
};

export default shepardTables;
