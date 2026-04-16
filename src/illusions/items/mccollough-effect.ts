import * as THREE from "three";
import type { IllusionConfig, PhaseStep } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/mccollough.frag";
import {
  getPaletteOptions,
  resolvePaletteColors,
  type IllusionPalette,
} from "../lib/palettes";

const PALETTES: IllusionPalette[] = [
  { name: "Green & Red", colors: ["#00cc00", "#ff0000"] },
  { name: "Cyan & Magenta", colors: ["#00cccc", "#cc00cc"] },
  { name: "Blue & Orange", colors: ["#0044ff", "#ff8800"] },
  { name: "Purple & Yellow", colors: ["#8800ff", "#ffcc00"] },
  { name: "Teal & Red", colors: ["#00aaaa", "#cc2222"] },
];

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

// Auto-cycle state
let cycleStartTime = 0;
let cycleRunning = false;
let currentStepIndex = 0;
let iterationCount = 0;

const PHASE_OPTIONS = ["Horizontal", "Vertical", "B/W Test"];
const DEFAULT_SEQUENCE: PhaseStep[] = [
  { phase: "Horizontal", duration: 30 },
  { phase: "Vertical", duration: 30 },
  { phase: "B/W Test", duration: 10 },
];

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
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Green & Red",
      options: getPaletteOptions(PALETTES),
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
    {
      key: "autoCycle",
      label: "Auto Cycle",
      type: "startStop",
      default: false,
    },
    {
      key: "autoCycleIterations",
      label: "Iterations",
      type: "slider",
      default: 3,
      min: 1,
      max: 20,
      step: 1,
    },
    {
      key: "autoCycleSequence",
      label: "Cycle Sequence",
      type: "phaseList",
      default: DEFAULT_SEQUENCE,
      phaseOptions: PHASE_OPTIONS,
    },
  ],

  setup(scene, _camera, params) {
    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.color1,
      params.color2,
    ]);
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
        uColor1: { value: hexToVec3(c1) },
        uColor2: { value: hexToVec3(c2) },
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

    // Auto-cycle logic
    if (params.autoCycle) {
      const sequence: PhaseStep[] =
        params.autoCycleSequence ?? DEFAULT_SEQUENCE;
      const maxIterations: number = params.autoCycleIterations ?? 3;

      if (!cycleRunning) {
        cycleRunning = true;
        cycleStartTime = _time;
        currentStepIndex = 0;
        iterationCount = 0;
      }

      if (sequence.length > 0 && iterationCount < maxIterations) {
        const elapsed = _time - cycleStartTime;
        const currentStep = sequence[currentStepIndex];
        const stepDuration = currentStep.duration;

        if (elapsed >= stepDuration) {
          cycleStartTime = _time;
          currentStepIndex++;
          if (currentStepIndex >= sequence.length) {
            currentStepIndex = 0;
            iterationCount++;
          }
        }

        if (iterationCount < maxIterations) {
          params.phase = sequence[currentStepIndex].phase;
        } else {
          // Done cycling — switch to B/W Test
          params.phase = "B/W Test";
          cycleRunning = false;
        }
      }
    } else {
      cycleRunning = false;
    }

    const [c1, c2] = resolvePaletteColors(params.palette, PALETTES, [
      params.color1,
      params.color2,
    ]);
    material.uniforms.uPhase.value = phaseMap[params.phase] ?? 0;
    material.uniforms.uColor1.value = hexToVec3(c1);
    material.uniforms.uColor2.value = hexToVec3(c2);
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
