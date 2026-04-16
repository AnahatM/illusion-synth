import type * as THREE from "three";

export interface PhaseStep {
  phase: string;
  duration: number;
}

export interface ParamDef {
  key: string;
  label: string;
  type: "slider" | "color" | "toggle" | "select" | "phaseList" | "startStop";
  default: number | string | boolean | PhaseStep[];
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  /** Available phase options for phaseList type */
  phaseOptions?: string[];
}

export interface IllusionConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  howTo: string;
  params: ParamDef[];
  setup: (
    scene: THREE.Scene,
    camera: THREE.Camera,
    params: Record<string, any>,
    canvas?: HTMLCanvasElement,
  ) => void | Promise<void>;
  update: (
    time: number,
    params: Record<string, any>,
    ctx?: { setFillCanvas?: (fill: boolean) => void },
  ) => void;
  dispose: () => void;
  tintThumbnail?: boolean;
  /** When true the canvas fills the entire viewport (no square aspect lock). */
  fillCanvas?: boolean;
}
