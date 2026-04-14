import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/ebbinghaus.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const ebbinghausIllusion: IllusionConfig = {
  id: "ebbinghaus",
  name: "Ebbinghaus Illusion",
  category: "Geometric",
  description:
    "Two identical circles appear to be different sizes: one is surrounded by small circles (making it look larger) and the other by large circles (making it look smaller).",
  howTo:
    "Compare the two orange center circles. They are exactly the same size, but the one surrounded by small circles appears larger than the one surrounded by large circles. This is a size-contrast illusion.",
  params: [
    {
      key: "surroundSize",
      label: "Surround Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "surroundCount",
      label: "Surround Count",
      type: "slider",
      default: 8,
      min: 4,
      max: 12,
      step: 1,
    },
    {
      key: "centerColor",
      label: "Center Color",
      type: "color",
      default: "#ff8800",
    },
    {
      key: "surroundColor",
      label: "Surround Color",
      type: "color",
      default: "#4488ff",
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSurroundSize: { value: params.surroundSize },
        uSurroundCount: { value: params.surroundCount },
        uCenterColor: { value: hexToVec3(params.centerColor as string) },
        uSurroundColor: { value: hexToVec3(params.surroundColor as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uSurroundSize.value = params.surroundSize;
    material.uniforms.uSurroundCount.value = params.surroundCount;
    material.uniforms.uCenterColor.value = hexToVec3(
      params.centerColor as string,
    );
    material.uniforms.uSurroundColor.value = hexToVec3(
      params.surroundColor as string,
    );
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default ebbinghausIllusion;
