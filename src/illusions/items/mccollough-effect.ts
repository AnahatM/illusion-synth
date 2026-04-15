import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/mccollough.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const mccolloughEffect: IllusionConfig = {
  id: "mccollough-effect",
  name: "McCollough Effect",
  category: "Color",
  tintThumbnail: true,
  fillCanvas: false,
  description:
    "A color aftereffect: stare at colored gratings, then see phantom colors on black-and-white test patterns. The effect can persist for hours.",
  howTo:
    "Step 1: Select 'Horizontal (color 1)' and stare for 30-60 seconds. Step 2: Switch to 'Vertical (color 2)' and stare for 30-60 seconds. Repeat Steps 1-2 several times. Step 3: Switch to 'B/W Test' — the horizontal and vertical gratings should appear subtly tinted with the opposite colors.",
  params: [
    {
      key: "phase",
      label: "Phase",
      type: "select",
      default: "Horizontal",
      options: ["Horizontal", "Vertical", "B/W Test"],
    },
    {
      key: "color1",
      label: "Horizontal Color",
      type: "color",
      default: "#00cc00",
    },
    {
      key: "color2",
      label: "Vertical Color",
      type: "color",
      default: "#ff0000",
    },
    {
      key: "gratingFreq",
      label: "Grating Frequency",
      type: "slider",
      default: 12,
      min: 4,
      max: 30,
      step: 1,
    },
    {
      key: "fullWidth",
      label: "Full-Width Test Bars",
      type: "toggle",
      default: false,
    },
  ],

  setup(scene, _camera, params) {
    const phaseMap: Record<string, number> = {
      Horizontal: 0,
      Vertical: 1,
      "B/W Test": 2,
    };
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPhase: { value: phaseMap[params.phase] ?? 0 },
        uColor1: { value: hexToVec3(params.color1) },
        uColor2: { value: hexToVec3(params.color2) },
        uGratingFreq: { value: params.gratingFreq },
        uFullWidth: { value: params.fullWidth ? 1.0 : 0.0 },
      },
    });

    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params, ctx) {
    if (!material) return;
    const phaseMap: Record<string, number> = {
      Horizontal: 0,
      Vertical: 1,
      "B/W Test": 2,
    };
    material.uniforms.uPhase.value = phaseMap[params.phase] ?? 0;
    material.uniforms.uColor1.value = hexToVec3(params.color1);
    material.uniforms.uColor2.value = hexToVec3(params.color2);
    material.uniforms.uGratingFreq.value = params.gratingFreq;
    material.uniforms.uFullWidth.value = params.fullWidth ? 1.0 : 0.0;
    ctx?.setFillCanvas?.(!!params.fullWidth);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default mccolloughEffect;
