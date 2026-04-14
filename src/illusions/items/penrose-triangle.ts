import * as THREE from "three";
import type { IllusionConfig } from "../types";

let group: THREE.Group;
let materialRef: THREE.MeshStandardMaterial;
let light: THREE.DirectionalLight;
let ambientLight: THREE.AmbientLight;

function createPenroseTriangle(color: string, wireframe: boolean): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    wireframe,
    flatShading: true,
  });
  materialRef = mat;

  const barLength = 1.2;
  const barSize = 0.15;
  const geo = new THREE.BoxGeometry(barLength, barSize, barSize);

  // Three bars arranged as a triangle — positioned to create the impossible overlap illusion
  const bar1 = new THREE.Mesh(geo, mat);
  bar1.position.set(0, -0.4, 0);

  const bar2 = new THREE.Mesh(geo, mat);
  bar2.position.set(0.35, 0.2, 0);
  bar2.rotation.z = (2 * Math.PI) / 3;

  const bar3 = new THREE.Mesh(geo, mat);
  bar3.position.set(-0.35, 0.2, 0);
  bar3.rotation.z = -(2 * Math.PI) / 3;

  // Corner cubes to cover joints
  const cornerGeo = new THREE.BoxGeometry(
    barSize * 1.5,
    barSize * 1.5,
    barSize * 1.5,
  );
  const angles = [
    [0.6, -0.4, 0],
    [-0.6, -0.4, 0],
    [0, 0.64, 0],
  ];
  for (const [x, y, z] of angles) {
    const corner = new THREE.Mesh(cornerGeo, mat);
    corner.position.set(x, y, z);
    g.add(corner);
  }

  g.add(bar1, bar2, bar3);
  return g;
}

const penroseTriangle: IllusionConfig = {
  id: "penrose-triangle",
  name: "Penrose Triangle",
  category: "Impossible",
  description:
    "An animated impossible triangle that shifts perspective to reveal its paradoxical geometry.",
  howTo:
    "Watch as the triangle rotates. From certain angles it appears to be a solid, connected object — but as it turns, the impossible connection becomes apparent. Try wireframe mode to see the trick.",
  params: [
    {
      key: "speed",
      label: "Rotation Speed",
      type: "slider",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
    { key: "color", label: "Color", type: "color", default: "#7c3aed" },
    { key: "wireframe", label: "Wireframe", type: "toggle", default: false },
  ],

  setup(scene, camera, params) {
    // Switch to perspective camera for 3D
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -1.5;
      camera.right = 1.5;
      camera.top = 1.5;
      camera.bottom = -1.5;
      camera.updateProjectionMatrix();
    }

    group = createPenroseTriangle(params.color, params.wireframe);
    scene.add(group);

    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(2, 3, 4);
    scene.add(light);

    ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
  },

  update(time, params) {
    if (!group) return;
    group.rotation.y = time * params.speed;
    group.rotation.x = Math.sin(time * params.speed * 0.5) * 0.3;

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

export default penroseTriangle;
