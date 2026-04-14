import * as THREE from "three";
import type { IllusionConfig } from "../types";

let mesh: THREE.Mesh;
let material: THREE.ShaderMaterial;
let textureLoader: THREE.TextureLoader;
let currentTexture: THREE.Texture | null = null;

const invertVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const shapeFrag = `
uniform sampler2D uMap;
uniform float uInvert;
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(uMap, vUv);
  vec3 col = mix(tex.rgb, 1.0 - tex.rgb, uInvert);
  gl_FragColor = vec4(col, tex.a);
}`;

const impossibleShapes: IllusionConfig = {
  id: "impossible-shapes",
  name: "Impossible Shapes",
  category: "Impossible",
  description:
    "Classic impossible objects — geometric figures that appear valid at first glance but cannot exist in 3D space. These include the Penrose triangle, impossible staircase, and more.",
  howTo:
    "Study each shape carefully. Trace the edges with your eyes — each local junction looks valid, but the overall structure is paradoxical and could never be built as a real 3D object.",
  params: [
    {
      key: "shape",
      label: "Shape",
      type: "select",
      default: "Penrose Triangle",
      options: [
        "Penrose Triangle",
        "Impossible Staircase",
        "Penrose Rectangle",
        "Impossible Trident",
      ],
    },
    {
      key: "scale",
      label: "Scale",
      type: "slider",
      default: 0.8,
      min: 0.3,
      max: 1.5,
      step: 0.05,
    },
  ],

  setup(scene, _camera, params) {
    textureLoader = new THREE.TextureLoader();
    material = new THREE.ShaderMaterial({
      vertexShader: invertVert,
      fragmentShader: shapeFrag,
      uniforms: {
        uMap: { value: null },
        uInvert: { value: 0.0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const s = params.scale;
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * s, 2 * s), material);
    scene.add(mesh);

    return loadShape(params.shape);
  },

  update(_time, params) {
    if (!mesh) return;

    // Update scale
    const s = params.scale;
    mesh.scale.set(s, s, 1);

    // Update shape if changed
    const shapeName = params.shape;
    if (material && material.userData.currentShape !== shapeName) {
      loadShape(shapeName);
    }
  },

  dispose() {
    mesh?.geometry.dispose();
    material?.dispose();
    currentTexture?.dispose();
  },
};

function loadShape(shapeName: string): Promise<void> {
  const fileMap: Record<string, string> = {
    "Penrose Triangle": "/impossible-shapes/penrose-triangle.png",
    "Impossible Staircase": "/impossible-shapes/impossible-staircase.png",
    "Penrose Rectangle": "/impossible-shapes/penrose-rectangle.png",
    "Impossible Trident": "/impossible-shapes/impossible-trident.png",
  };

  const path = fileMap[shapeName];
  if (!path || !textureLoader || !material) return Promise.resolve();

  material.userData.currentShape = shapeName;
  const needsInvert =
    shapeName === "Penrose Rectangle" || shapeName === "Impossible Trident";
  material.uniforms.uInvert.value = needsInvert ? 1.0 : 0.0;

  return new Promise<void>((resolve) => {
    textureLoader.load(
      path,
      (texture) => {
        if (currentTexture) currentTexture.dispose();
        currentTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        material.uniforms.uMap.value = texture;
        material.needsUpdate = true;
        resolve();
      },
      undefined,
      (err) => {
        console.error("Failed to load impossible shape:", path, err);
        resolve();
      },
    );
  });
}

export default impossibleShapes;
