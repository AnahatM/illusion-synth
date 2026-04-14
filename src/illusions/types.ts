import type * as THREE from "three";

export interface ParamDef {
  key: string;
  label: string;
  type: "slider" | "color" | "toggle" | "select";
  default: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
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
  ) => void | Promise<void>;
  update: (time: number, params: Record<string, any>) => void;
  dispose: () => void;
}
