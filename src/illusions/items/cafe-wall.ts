import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/cafe-wall.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const cafeWall: IllusionConfig = {
  id: "cafe-wall",
  name: "Café Wall",
  category: "Op-Art",
  description:
    "Offset rows of alternating tiles that create the illusion of non-parallel lines.",
  params: [
    {
      key: "offset",
      label: "Offset",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: "tileCount",
      label: "Tile Count",
      type: "slider",
      default: 8,
      min: 3,
      max: 20,
      step: 1,
    },
    {
      key: "contrast",
      label: "Contrast",
      type: "slider",
      default: 0.8,
      min: 0.1,
      max: 1,
      step: 0.05,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uOffset: { value: params.offset },
        uTileCount: { value: params.tileCount },
        uContrast: { value: params.contrast },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uTileCount.value = params.tileCount;
    material.uniforms.uContrast.value = params.contrast;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default cafeWall;
