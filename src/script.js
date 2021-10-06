import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// fog

const fog = new THREE.Fog("#262837", 1, 18);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorAmbientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
const wallColorTexture = textureLoader.load("textures/bricks/color.jpg");
const wallAmbiantTexture = textureLoader.load(
  "textures/bricks/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbiantTexture = textureLoader.load(
  "textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
//
grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
//
grassAmbiantTexture.repeat.set(8, 8);
grassAmbiantTexture.wrapS = THREE.RepeatWrapping;
grassAmbiantTexture.wrapT = THREE.RepeatWrapping;
//
grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbiantTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
  })
);
floor.material.side = THREE.DoubleSide;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

const house = new THREE.Group();

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAmbiantTexture,
    roughnessMap: wallRoughnessTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y = 1.25;

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#e07a5f" })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    aoMap: doorAmbientTexture,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

console.log(doorHeightTexture);
door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(walls, roof, door);
scene.add(house);

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "green" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.z = 2.2;
bush1.position.x = 1.2;
bush1.position.y = 0.2;
bush1.scale.set(0.5, 0.5, 0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.9, 0.15, 2.1);
bush2.scale.set(0.25, 0.25, 0.25);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-1.5, 0.2, 2.2);
bush3.scale.set(0.6, 0.6, 0.6);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1.2, 0.2, 3);
bush4.scale.set(0.2, 0.2, 0.2);
house.add(bush1, bush2, bush3, bush4);

const graves = new THREE.Group();

const graveGeopmetry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#cfe1b9" });

for (let i = 0; i < 40; i++) {
  const grave = new THREE.Mesh(graveGeopmetry, graveMaterial);

  const angel = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angel) * radius;
  const z = Math.cos(angel) * radius;
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;

  grave.position.set(x, 0.3, z);
  graves.add(grave);
}
scene.add(graves);
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1.3, 7);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
