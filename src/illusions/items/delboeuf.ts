import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/delboeuf.frag";
import { hexToVec3 } from "../lib/color-utils";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const delboeufIllusion: IllusionConfig = {
  id: "delboeuf",
  name: "Delboeuf Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Two identical circles appear to be different sizes depending on the ring that surrounds them. A tight ring makes the circle look larger; a wide ring makes it look smaller.",
  howTo:
    "Compare the two orange circles. They are the same size, but the one inside the small ring looks bigger and the one inside the large ring looks smaller. This illusion is used in studies about portion size on plates!",
  params: [
    {
      key: "ringSize",
      label: "Ring Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
    },
    {
      key: "circleSize",
      label: "Circle Size",
      type: "slider",
      default: 1,
      min: 0.5,
      max: 1.5,
      step: 0.1,
    },
    {
      key: "circleColor",
      label: "Circle Color",
      type: "color",
      default: "#e65a1a",
    },
    {
      key: "ringColor",
      label: "Ring Color",
      type: "color",
      default: "#b3b3b3",
    },
    {
      key: "bgColor",
      label: "Background",
      type: "color",
      default: "#000000",
    },
    {
      key: "palette",
      label: "Palette",
      type: "select",
      default: "Custom",
      options: [
        "Custom",
        "B/W",
        "Blue & Gold",
        "Red & Cyan",
        "Purple & Lime",
        "Sunset",
      ],
    },
  ],

  setup(scene, _camera, params) {
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uRingSize: { value: params.ringSize },
        uCircleSize: { value: params.circleSize },
        uCircleColor: { value: hexToVec3(params.circleColor as string) },
        uRingColor: { value: hexToVec3(params.ringColor as string) },
        uBgColor: { value: hexToVec3(params.bgColor as string) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uRingSize.value = params.ringSize;
    material.uniforms.uCircleSize.value = params.circleSize;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.circleColor,
      params.ringColor,
    );
    material.uniforms.uCircleColor.value = hexToVec3(c1);
    material.uniforms.uRingColor.value = hexToVec3(c2);
    material.uniforms.uBgColor.value = hexToVec3(params.bgColor as string);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default delboeufIllusion;
