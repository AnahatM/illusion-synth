import * as THREE from "three";
import type { IllusionConfig } from "../types";
import { resolvePalette } from "../lib/palettes";

let group: THREE.Group;
let matA: THREE.MeshBasicMaterial;
let matB: THREE.MeshBasicMaterial;
let meshA: THREE.Mesh;
let meshB: THREE.Mesh;
let proofMesh: THREE.Mesh;
let proofMat: THREE.MeshBasicMaterial;
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
    "The two curved shapes are exactly the same size. The bottom one looks bigger because your brain compares the short inner arc of the top with the long outer arc of the bottom. Toggle 'Show Proof' to overlay them.",
  params: [
    {
      key: "offset",
      label: "Separation",
      type: "slider",
      default: 1,
      min: 0,
      max: 3,
      step: 0.1,
    },
    {
      key: "showProof",
      label: "Show Proof",
      type: "toggle",
      default: false,
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

  setup(scene, camera, params) {
    // Use orthographic-like setup: the viewer already has an ortho camera at z=1
    // PlaneGeometry(2,2) fills the view. We place our shapes in NDC-like coords.
    group = new THREE.Group();

    const aspect = 333 / 120;
    const planeW = 1.2;
    const planeH = planeW / aspect;
    const geo = new THREE.PlaneGeometry(planeW, planeH);

    matA = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.1,
      color: new THREE.Color(params.color1 as string),
    });
    matB = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.1,
      color: new THREE.Color(params.color2 as string),
    });
    proofMat = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.1,
      color: new THREE.Color("#ffff00"),
      visible: false,
    });

    meshA = new THREE.Mesh(geo, matA);
    meshB = new THREE.Mesh(geo, matB);
    proofMesh = new THREE.Mesh(geo, proofMat);

    // Stack: A on top, B below, offset horizontally to create the classic stacking
    const sep = (params.offset as number) * 0.08;
    meshA.position.set(0.1, sep + planeH * 0.5, 0);
    meshB.position.set(-0.1, -sep - planeH * 0.5, 0);
    proofMesh.position.copy(meshA.position);

    group.add(meshA);
    group.add(meshB);
    group.add(proofMesh);
    scene.add(group);

    // Load texture
    loadSvgTexture().then((tex) => {
      texture = tex;
      matA.map = tex;
      matA.needsUpdate = true;
      matB.map = tex;
      matB.needsUpdate = true;
      proofMat.map = tex;
      proofMat.needsUpdate = true;
    });
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

    const aspect = 333 / 120;
    const planeW = 1.2;
    const planeH = planeW / aspect;
    const sep = (params.offset as number) * 0.08;
    meshA.position.set(0.1, sep + planeH * 0.5, 0);
    meshB.position.set(-0.1, -sep - planeH * 0.5, 0);

    // Show proof: overlay shape B at A's position
    proofMat.visible = !!params.showProof;
    proofMesh.position.copy(meshA.position);
  },

  dispose() {
    meshA?.geometry.dispose();
    matA?.dispose();
    matB?.dispose();
    proofMat?.dispose();
    texture?.dispose();
    texture = null;
    group?.parent?.remove(group);
  },
};

export default jastrowIllusion;
