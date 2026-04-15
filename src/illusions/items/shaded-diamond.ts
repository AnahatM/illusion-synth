import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/shaded-diamond.frag";
import { resolvePalette } from "../lib/palettes";
import { hexToVec3 } from "../lib/color-utils";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const shadedDiamond: IllusionConfig = {
  id: "shaded-diamond",
  name: "Shaded Diamond Illusion",
  category: "Luminance",
  description:
    "A diamond of uniform brightness placed on a vertically graded background appears to have a brightness gradient itself — the top looks darker and the bottom lighter — even though it is perfectly uniform.",
  howTo:
    "Look at the diamond shape. It appears to have a gradient — darker at the top and lighter at the bottom. But the diamond is actually a single uniform shade. Cover the background with your hands to verify. The surrounding gradient induces the illusion via simultaneous contrast.",
  params: [
    { key: "gradientStrength", label: "Gradient Strength", type: "slider", default: 1, min: 0, max: 2, step: 0.1 },
    { key: "color1", label: "Dark Color", type: "color", default: "#222222" },
    { key: "color2", label: "Light Color", type: "color", default: "#eeeeee" },
    { key: "palette", label: "Palette", type: "select", default: "Custom", options: ["Custom", "B/W", "Blue & Gold", "Red & Cyan", "Purple & Lime", "Sunset"] },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGradientStrength: { value: params.gradientStrength },
        uColor1: { value: hexToVec3(params.color1 as string) },
        uColor2: { value: hexToVec3(params.color2 as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uGradientStrength.value = params.gradientStrength;
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

export default shadedDiamond;
