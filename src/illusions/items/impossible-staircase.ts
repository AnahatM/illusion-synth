import * as THREE from "three";
import type { IllusionConfig } from "../types";

let group: THREE.Group;
let materialRef: THREE.MeshStandardMaterial;
let light: THREE.DirectionalLight;
let ambientLight: THREE.AmbientLight;

function createStaircase(color: string, wireframe: boolean): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    wireframe,
    flatShading: true,
  });
  materialRef = mat;

  const stepCount = 16;
  const stepGeo = new THREE.BoxGeometry(0.3, 0.06, 0.15);

  for (let i = 0; i < stepCount; i++) {
    const step = new THREE.Mesh(stepGeo, mat);
    const angle = (i / stepCount) * Math.PI * 2;
    const radius = 0.5;

    step.position.x = Math.cos(angle) * radius;
    step.position.z = Math.sin(angle) * radius;
    // Height loops back to start — the "impossible" part
    step.position.y = (i / stepCount) * 0.8 - 0.4;

    step.lookAt(0, step.position.y, 0);
    g.add(step);
  }

  // Connecting pillars at corners
  const pillarGeo = new THREE.BoxGeometry(0.08, 0.9, 0.08);
  const pillarPositions = [
    [0.5, 0, 0.5],
    [-0.5, 0, 0.5],
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
  ];
  for (const [x, y, z] of pillarPositions) {
    const pillar = new THREE.Mesh(pillarGeo, mat);
    pillar.position.set(x, y, z);
    g.add(pillar);
  }

  return g;
}

const impossibleStaircase: IllusionConfig = {
  id: "impossible-staircase",
  name: "Impossible Staircase",
  category: "Impossible",
  description:
    "An Escher-inspired looping staircase that appears to ascend endlessly.",
  howTo:
    "Follow the steps around the loop — they appear to continuously ascend yet return to where they started. This is a 3D version of the Penrose stairs, famously depicted by M.C. Escher.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.3,
      min: 0.1,
      max: 2,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#4488cc" },
    { key: "wireframe", label: "Wireframe", type: "toggle", default: false },
  ],

  setup(scene, camera, params) {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -1.5;
      camera.right = 1.5;
      camera.top = 1.5;
      camera.bottom = -1.5;
      camera.updateProjectionMatrix();
    }

    group = createStaircase(params.color, params.wireframe);
    scene.add(group);

    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(3, 4, 2);
    scene.add(light);

    ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
  },

  update(time, params) {
    if (!group) return;
    group.rotation.y = time * params.speed;
    group.rotation.x = 0.4; // Fixed tilt for best viewing angle

    if (materialRef) {
      materialRef.color.set(params.color);
      materialRef.wireframe = params.wireframe;
    }
  },

  dispose() {
    group?.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      }
    });
  },
};

export default impossibleStaircase;
