import * as THREE from "three";
import type { IllusionConfig } from "../types";
import vertexShader from "../shaders/fullscreen.vert";
import fragmentShader from "../shaders/bourdon.frag";
import { resolvePalette } from "../lib/palettes";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;

const bourdonIllusion: IllusionConfig = {
  id: "bourdon",
  name: "Bourdon Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "A figure made of two aligned triangles sharing a straight edge appears to have a bent or curved common edge, even though it is perfectly straight.",
  howTo:
    "Look at the left edge of the shape — it looks slightly bent or bowed at the center where the two triangles meet. Use a ruler against your screen to confirm it is perfectly straight.",
  params: [
    {
      key: "rotation",
      label: "Rotation (°)",
      type: "slider",
      default: 45,
      min: -180,
      max: 180,
      step: 1,
    },
    {
      key: "width",
      label: "Triangle Width",
      type: "slider",
      default: 1.0,
      min: 0.3,
      max: 2.0,
      step: 0.1,
    },
    {
      key: "shapeColor",
      label: "Shape Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "bgColor",
      label: "Background Color",
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
    const [c1, c2] = resolvePalette(
      params.palette,
      params.shapeColor,
      params.bgColor,
    );
    const sc = new THREE.Color(c1);
    const bc = new THREE.Color(c2);
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uAngle: { value: (params.rotation * Math.PI) / 180 },
        uWidth: { value: params.width },
        uShapeColor: { value: new THREE.Vector3(sc.r, sc.g, sc.b) },
        uBgColor: { value: new THREE.Vector3(bc.r, bc.g, bc.b) },
      },
    });
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
  },

  update(_time, params) {
    if (!material) return;
    material.uniforms.uAngle.value = (params.rotation * Math.PI) / 180;
    material.uniforms.uWidth.value = params.width;
    const [c1, c2] = resolvePalette(
      params.palette,
      params.shapeColor,
      params.bgColor,
    );
    const sc = new THREE.Color(c1);
    material.uniforms.uShapeColor.value.set(sc.r, sc.g, sc.b);
    const bc = new THREE.Color(c2);
    material.uniforms.uBgColor.value.set(bc.r, bc.g, bc.b);
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
  },
};

export default bourdonIllusion;
