import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/zollner.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const zollnerIllusion: IllusionConfig = {
  id: "zollner",
  name: "Zöllner Illusion",
  category: "Geometric",
  description:
    "Parallel horizontal lines appear to converge and diverge because of short diagonal crosshatch lines overlaid at alternating angles.",
  howTo:
    "Look at the long horizontal lines — they are perfectly parallel, but the short diagonal hatches make them appear to tilt. Alternating hatch directions on adjacent lines amplifies the effect.",
  params: [
    {
      key: "lineCount",
      label: "Line Count",
      type: "slider",
      default: 8,
      min: 3,
      max: 16,
      step: 1,
    },
    {
      key: "hatchAngle",
      label: "Hatch Angle (°)",
      type: "slider",
      default: 40,
      min: 10,
      max: 80,
      step: 1,
    },
    {
      key: "hatchDensity",
      label: "Hatch Density",
      type: "slider",
      default: 1,
      min: 0.3,
      max: 3,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: params.lineCount },
        uHatchAngle: { value: params.hatchAngle },
        uHatchDensity: { value: params.hatchDensity },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uLineCount.value = params.lineCount;
    material.uniforms.uHatchAngle.value = params.hatchAngle;
    material.uniforms.uHatchDensity.value = params.hatchDensity;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default zollnerIllusion;
