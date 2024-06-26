import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.035);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 25;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

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

const x = 0, y = 0;

const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const geo = new THREE.ShapeGeometry( heartShape );
//const sizeHeart = 0.06;
//geo.scale(sizeHeart, sizeHeart, sizeHeart);

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

const edges = new THREE.EdgesGeometry(geo);
function getHeart(color, size) {
  const mat = new THREE.MeshBasicMaterial({
    color: color,
  });
  const heart = new THREE.LineSegments(edges, mat);
  heart.scale.set(size, size, size);
  return heart;
}

const heartGroup = new THREE.Group();
heartGroup.userData.update = (timeStamp) => {
  heartGroup.rotation.x = timeStamp * 0.00004;
  heartGroup.rotation.y = timeStamp * -0.00004;
  heartGroup.rotation.z = timeStamp * 0.00004;
};
scene.add(heartGroup);

const numHearts = 1800;
const radius = 45;
const minHeartSize = 0.01; // minimum heart size
const maxHeartSize = 0.1; // maximum heart size
for (let i = 0; i < numHearts; i++) {
  const randomColor = getRandomColor();
  const randomSize = getRandomSize(minHeartSize, maxHeartSize);
  const heart = getHeart(randomColor, randomSize);
  const { x, y, z } = getRandomSpherePoint({ radius });
  heart.position.set(x, y, z);
  heart.rotation.set(x, y, z);
  heartGroup.add(heart);
}

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

function animate(timeStamp = 0) {
  requestAnimationFrame(animate);
  heartGroup.userData.update(timeStamp);
  composer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);