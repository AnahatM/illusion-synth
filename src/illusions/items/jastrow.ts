import * as THREE from "three";
import type { IllusionConfig } from "../types";
import { resolvePalette } from "../lib/palettes";

let group: THREE.Group;
let matA: THREE.MeshBasicMaterial;
let matB: THREE.MeshBasicMaterial;
let meshA: THREE.Mesh;
let meshB: THREE.Mesh;
let texture: THREE.Texture | null = null;

function loadSvgTexture(): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = Math.round(512 * (120 / 333));
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      resolve(tex);
    };
    img.src = "illusion-shapes/jastrow_illusion_shape.svg";
  });
}

const jastrowIllusion: IllusionConfig = {
  id: "jastrow",
  name: "Jastrow Illusion",
  category: "Geometric",
  tintThumbnail: true,
  description:
    "Two identical curved shapes (annular sectors) are stacked — the bottom one always appears larger than the top one due to the contrast between the long and short edges.",
  howTo:
    "The two curved shapes are exactly the same size. The bottom one looks bigger because your brain compares the short inner arc of the top with the long outer arc of the bottom. Move shape B with the X/Y sliders to overlay them and confirm they're identical.",
  params: [
    {
      key: "offsetX",
      label: "Shape B — X",
      type: "slider",
      default: 0.17,
      min: -0.8,
      max: 0.8,
      step: 0.01,
    },
    {
      key: "offsetY",
      label: "Shape B — Y",
      type: "slider",
      default: -0.14,
      min: -1,
      max: 1,
      step: 0.01,
    },
    { key: "color1", label: "Arc A Color", type: "color", default: "#4d99d9" },
    { key: "color2", label: "Arc B Color", type: "color", default: "#d9734d" },
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

  async setup(scene, _camera, params) {
    group = new THREE.Group();

    const aspect = 333 / 120;
    const planeW = 1.2;
    const planeH = planeW / aspect;
    const geo = new THREE.PlaneGeometry(planeW, planeH);

    const tex = await loadSvgTexture();
    texture = tex;

    matA = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.1,
      color: new THREE.Color(params.color1 as string),
    });
    matB = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.1,
      color: new THREE.Color(params.color2 as string),
    });

    meshA = new THREE.Mesh(geo, matA);
    meshB = new THREE.Mesh(geo, matB);

    meshA.position.set(0.1, planeH * 0.5 + 0.02, 0);
    meshB.position.set(params.offsetX as number, params.offsetY as number, 0);

    group.add(meshA);
    group.add(meshB);
    scene.add(group);
  },

  update(_time, params) {
    if (!group) return;

    const [c1, c2] = resolvePalette(
      params.palette,
      params.color1,
      params.color2,
    );
    matA.color.set(c1);
    matB.color.set(c2);

    meshB.position.set(params.offsetX as number, params.offsetY as number, 0);
  },

  dispose() {
    meshA?.geometry.dispose();
    matA?.dispose();
    matB?.dispose();
    texture?.dispose();
    texture = null;
    group?.parent?.remove(group);
  },
};

export default jastrowIllusion;
