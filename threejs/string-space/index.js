import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";
import { SimplexNoise } from "jsm/math/SimplexNoise.js";

///* //Works for numLoops<700
const simplex = new SimplexNoise();

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.035);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 25;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0;
bloomPass.strength = 2.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const loopGroup = new THREE.Group();
loopGroup.userData.update = (timeStamp) => {
  //loopGroup.rotation.x = timeStamp * 0.00004;
  //loopGroup.rotation.y = timeStamp * -0.00004;
  //loopGroup.rotation.z = timeStamp * 0.00004;
};
scene.add(loopGroup);

// Define a color palette
const colorPalette = [
  0xff0000, // Red
  0x00ff00, // Green
  0x0000ff, // Blue
  0xffff00, // Yellow
  0xff00ff, // Magenta
  0x00ffff, // Cyan
];

// Function to get a random color from the palette
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
}

// Function to get a random size within a range
function getRandomSize(minSize, maxSize) {
  return Math.random() * (maxSize - minSize) + minSize;
}

// Function to create a wiggling loop using SimplexNoise in 3D
function createWigglingLoop(segments, time) {
  const points = [];
  const noiseFactor = 0.3;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * (2 + simplex.noise3d(time + Math.cos(theta), time + Math.sin(theta), time) * noiseFactor);
    const y = Math.sin(theta) * (2 + simplex.noise3d(time + Math.cos(theta), time + Math.sin(theta), time) * noiseFactor);
    const z = simplex.noise3d(time + Math.cos(theta), time - Math.sin(theta), time) * noiseFactor;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

const numLoops = 1000;
const radius = 45;
const minLoopSize = 0.3; // minimum loop size
const maxLoopSize = 1.3; // maximum loop size
const segments = 50;

const instancedGeometry = new THREE.BufferGeometry();
//const positions = new Float32Array((segments + 1) * 3);
//instancedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

for (let i = 0; i < numLoops; i++) {
  const randomColor = getRandomColor();
  const randomSize = getRandomSize(minLoopSize, maxLoopSize);
  const loopPoints = createWigglingLoop(segments, i / 10);
  instancedGeometry.setFromPoints(loopPoints);
  const loopMaterial = new THREE.LineBasicMaterial({ color: randomColor });
  const loop = new THREE.Line(instancedGeometry, loopMaterial);
  const { x, y, z } = getRandomSpherePoint({ radius });
  
  loop.position.set(x, y, z);
  loop.rotation.set(x, y, z);
  loop.scale.set(randomSize, randomSize, randomSize);
  loopGroup.add(loop);
}

// Animation
function animate(timeStamp = 0) {
  requestAnimationFrame(animate);
  loopGroup.children.forEach((child, index) => {
    const loopPoints = createWigglingLoop(segments, timeStamp * 0.001 + index / 10);
    const loopGeometry = new THREE.BufferGeometry().setFromPoints(loopPoints);
    child.geometry.dispose();
    child.geometry = loopGeometry;
  });
  loopGroup.userData.update(timeStamp);
  controls.update();
  composer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

function getRandomSpherePoint({ radius = 10 }) {
  const minRadius = radius * 0.25;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}
//*/

/*//Weird string space
const simplex = new SimplexNoise();

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.035);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 25;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0;
bloomPass.strength = 0.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const loopGroup = new THREE.Group();
loopGroup.userData.update = (timeStamp) => {};
scene.add(loopGroup);

// Define a color palette
const colorPalette = [
  0xff0000, // Red
  0x00ff00, // Green
  0x0000ff, // Blue
  0xffff00, // Yellow
  0xff00ff, // Magenta
  0x00ffff, // Cyan
];

// Function to get a random color from the palette
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return new THREE.Color(colorPalette[randomIndex]);
}

// Function to get a random size within a range
function getRandomSize(minSize, maxSize) {
  return Math.random() * (maxSize - minSize) + minSize;
}

// Function to create a wiggling loop using SimplexNoise in 3D
function createWigglingLoop(segments, time) {
  const points = [];
  const noiseFactor = 0.3;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * (2 + simplex.noise3d(time + Math.cos(theta), time + Math.sin(theta), time) * noiseFactor);
    const y = Math.sin(theta) * (2 + simplex.noise3d(time + Math.cos(theta), time + Math.sin(theta), time) * noiseFactor);
    const z = simplex.noise3d(time + Math.cos(theta), time - Math.sin(theta), time) * noiseFactor;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

const numLoops = 500;
const radius = 45;
const minLoopSize = 0.3; // minimum loop size
const maxLoopSize = 1.3; // maximum loop size
const segments = 45;

const instancedGeometry = new THREE.BufferGeometry();
const positions = new Float32Array((segments + 1) * 3 * numLoops);
const colors = new Float32Array((segments + 1) * 3 * numLoops); // Add colors array
instancedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
instancedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Set colors attribute

const loopMaterial = new THREE.LineBasicMaterial({ vertexColors: true }); // Use vertex colors
const instancedMesh = new THREE.InstancedMesh(instancedGeometry, loopMaterial, numLoops);

for (let i = 0; i < numLoops; i++) {
  const randomColor = getRandomColor();
  const randomSize = getRandomSize(minLoopSize, maxLoopSize);
  const { x, y, z } = getRandomSpherePoint({ radius });
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z)),
    new THREE.Vector3(randomSize, randomSize, randomSize)
  );
  instancedMesh.setMatrixAt(i, matrix);
  
  const color = randomColor;
  for (let j = 0; j <= segments; j++) {
    colors[(i * (segments + 1) + j) * 3] = color.r;
    colors[(i * (segments + 1) + j) * 3 + 1] = color.g;
    colors[(i * (segments + 1) + j) * 3 + 2] = color.b;
  }
}

loopGroup.add(instancedMesh);

// Animation
function animate(timeStamp = 0) {
  requestAnimationFrame(animate);
  const positions = instancedGeometry.attributes.position.array;
  const colors = instancedGeometry.attributes.color.array;
  for (let i = 0; i < numLoops; i++) {
    const loopPoints = createWigglingLoop(segments, timeStamp * 0.001 + i / 10);
    for (let j = 0; j <= segments; j++) {
      positions[(i * (segments + 1) + j) * 3] = loopPoints[j].x;
      positions[(i * (segments + 1) + j) * 3 + 1] = loopPoints[j].y;
      positions[(i * (segments + 1) + j) * 3 + 2] = loopPoints[j].z;
    }
  }
  instancedGeometry.attributes.position.needsUpdate = true;
  instancedGeometry.attributes.color.needsUpdate = true;
  loopGroup.userData.update(timeStamp);
  controls.update();
  composer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

function getRandomSpherePoint({ radius = 10 }) {
  const minRadius = radius * 0.25;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}
*/