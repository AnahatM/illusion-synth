import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/blind-spot.frag";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const blindSpot: IllusionConfig = {
  id: "blind-spot",
  name: "Blind Spot",
  category: "Cognitive",
  tintThumbnail: true,
  description:
    "Demonstrates the natural blind spot in each eye where the optic nerve exits the retina. By closing one eye and focusing on the cross, the dot disappears when it falls on the blind spot.",
  howTo:
    "Close your RIGHT eye. Focus your left eye on the CROSS (+). Slowly move closer to or farther from the screen until the DOT disappears. That's your blind spot!",
  params: [
    {
      key: "spacing",
      label: "Spacing",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 2.5,
      step: 0.1,
    },
    {
      key: "dotSize",
      label: "Dot Size",
      type: "slider",
      default: 1.0,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "dotColor",
      label: "Dot Color",
      type: "color",
      default: "#ff4444",
    },
    {
      key: "crossColor",
      label: "Cross Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Custom",
      options: [
        "Custom",
        "B/W",
        "Blue & Gold",
        "Red & Cyan",
        "Purple & Lime",
        "Sunset",
      ],
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePalette(
      params.palette,
      params.dotColor,
      params.crossColor,
    );
    const dc = new THREE.Color(c1);
    const cc = new THREE.Color(c2);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSpacing: { value: params.spacing },
        uDotSize: { value: params.dotSize },
        uDotColor: { value: new THREE.Vector3(dc.r, dc.g, dc.b) },
        uCrossColor: { value: new THREE.Vector3(cc.r, cc.g, cc.b) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSpacing.value = params.spacing;
    material.uniforms.uDotSize.value = params.dotSize;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.dotColor,
      params.crossColor,
    );
    const dc = new THREE.Color(c1);
    material.uniforms.uDotColor.value.set(dc.r, dc.g, dc.b);
    const cc = new THREE.Color(c2);
    material.uniforms.uCrossColor.value.set(cc.r, cc.g, cc.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default blindSpot;
