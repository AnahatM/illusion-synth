import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/tilt-illusion.frag";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const tiltIllusion: IllusionConfig = {
  id: "tilt-illusion",
  name: "Tilt Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "The perceived orientation of a central grating is shifted by the orientation of the surrounding grating. The center lines appear tilted away from the direction of the surround.",
  howTo:
    "Look at the lines in the center circle. They appear tilted, but they are always perfectly vertical. Only the surrounding lines are tilted. Adjust the surround angle to see the effect change.",
  params: [
    {
      key: "surroundAngle",
      label: "Surround Angle (°)",
      type: "slider",
      default: 15,
      min: -45,
      max: 45,
      step: 1,
    },
    {
      key: "lineWidth",
      label: "Line Width",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "lineCount",
      label: "Line Density",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "centerSize",
      label: "Center Size",
      type: "slider",
      default: 1.5,
      min: 0.5,
      max: 3.0,
      step: 0.1,
    },
    {
      key: "blur",
      label: "Blur",
      type: "slider",
      default: 0.3,
      min: 0.0,
      max: 1.0,
      step: 0.05,
    },
    {
      key: "centerColor",
      label: "Center Line Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "surroundColor",
      label: "Surround Line Color",
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
      params.centerColor,
      params.surroundColor,
    );
    const cc = new THREE.Color(c1);
    const sc = new THREE.Color(c2);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSurroundAngle: { value: params.surroundAngle },
        uLineWidth: { value: params.lineWidth },
        uLineCount: { value: params.lineCount },
        uCenterSize: { value: params.centerSize },
        uBlur: { value: params.blur },
        uCenterColor: { value: new THREE.Vector3(cc.r, cc.g, cc.b) },
        uSurroundColor: { value: new THREE.Vector3(sc.r, sc.g, sc.b) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSurroundAngle.value = params.surroundAngle;
    material.uniforms.uLineWidth.value = params.lineWidth;
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uCenterSize.value = params.centerSize;
    material.uniforms.uBlur.value = params.blur;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.centerColor,
      params.surroundColor,
    );
    const cc = new THREE.Color(c1);
    material.uniforms.uCenterColor.value.set(cc.r, cc.g, cc.b);
    const sc = new THREE.Color(c2);
    material.uniforms.uSurroundColor.value.set(sc.r, sc.g, sc.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default tiltIllusion;
