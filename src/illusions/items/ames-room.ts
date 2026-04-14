import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/ames-room.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const amesRoom: IllusionConfig = {
  id: "ames-room",
  name: "Ames Room",
  category: "Depth/Ambiguity",
  description:
    "A trapezoidal room that appears rectangular from one viewpoint. People standing at different depths appear drastically different in size due to the forced-perspective distortion.",
  howTo:
    "Two identical-height figures appear very different in size because the room forces a false perspective. Move the slider to walk one figure from the 'large' side to the 'small' side and watch them shrink.",
  params: [
    {
      key: "personPos",
      label: "Person Position",
      type: "slider",
      default: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: "showGrid",
      label: "Show Grid",
      type: "toggle",
      default: true,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPersonPos: { value: params.personPos },
        uShowGrid: { value: params.showGrid ? 1.0 : 0.0 },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uPersonPos.value = params.personPos;
    material.uniforms.uShowGrid.value = params.showGrid ? 1.0 : 0.0;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default amesRoom;
