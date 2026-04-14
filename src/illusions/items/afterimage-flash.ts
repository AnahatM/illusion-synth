import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/afterimage.frag";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

const afterimageFlash: IllusionConfig = {
  id: "afterimage-flash",
  name: "Afterimage Flash",
  category: "Color",
  description:
    "Stare at the colored shape, then see its complementary afterimage when it fades.",
  howTo:
    "Fix your eyes on the small dot in the center without blinking for the full stare phase. When the image switches to white, keep looking at the dot — you'll see a ghostly shape in the complementary color.",
  params: [
    { key: "color", label: "Color", type: "color", default: "#ff0000" },
    {
      key: "duration",
      label: "Phase Duration",
      type: "slider",
      default: 10,
      min: 3,
      max: 30,
      step: 1,
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uDuration: { value: params.duration },
        uColor: { value: hexToVec3(params.color) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(time, params) {
    if (!material) return;
    material.uniforms.uTime.value = time;
    material.uniforms.uDuration.value = params.duration;
    material.uniforms.uColor.value = hexToVec3(params.color);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default afterimageFlash;
