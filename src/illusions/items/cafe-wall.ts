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
    "Offset rows of alternating black and white tiles separated by thin gray mortar lines create the illusion of non-parallel, wedge-shaped rows.",
  howTo:
    "Look at the horizontal gray mortar lines between tile rows. Despite being perfectly parallel and straight, they appear to tilt and converge. The effect is strongest with the offset at 0.5 (half a tile shift).",
  params: [
    {
      key: "offset",
      label: "Row Offset",
      type: "slider",
      default: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      key: "rows",
      label: "Rows",
      type: "slider",
      default: 12,
      min: 4,
      max: 24,
      step: 1,
    },
    {
      key: "tilesPerRow",
      label: "Tiles per Row",
      type: "slider",
      default: 9,
      min: 3,
      max: 20,
      step: 1,
    },
    {
      key: "mortarWidth",
      label: "Mortar Width",
      type: "slider",
      default: 0.4,
      min: 0.2,
      max: 3,
      step: 0.1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uOffset: { value: params.offset },
        uRows: { value: params.rows },
        uTilesPerRow: { value: params.tilesPerRow },
        uMortarWidth: { value: params.mortarWidth },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uOffset.value = params.offset;
    material.uniforms.uRows.value = params.rows;
    material.uniforms.uTilesPerRow.value = params.tilesPerRow;
    material.uniforms.uMortarWidth.value = params.mortarWidth;
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default cafeWall;
