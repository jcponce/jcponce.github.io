import * as THREE from "three";
import getLayer from "./getLayer.js";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { getParticleSystem } from "./getParticleSystem.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

/*
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0xffff00,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = -1;
scene.add(cube);
*/

const ambientLight = new THREE.AmbientLight(0x000000);
scene.add(ambientLight);

const light1 = new THREE.DirectionalLight(0xffffff, 3);
light1.position.set(0, 200, 0);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 3);
light2.position.set(100, 200, 100);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 3);
light3.position.set(- 100, - 200, - 100);
scene.add(light3);

const geometry = new THREE.TorusKnotGeometry(0.6, 0.15, 130, 16);
//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const material = new THREE.MeshLambertMaterial({ color: 0x049ef4, emissive: 0x000000 });

const torusKnot = new THREE.Mesh(geometry, material); scene.add(torusKnot);
scene.add(torusKnot);


const fireEffect = getParticleSystem({
  camera,
  emitter: torusKnot,
  parent: scene,
  rate: 50.0,
  texture: 'img/circle.png',
});

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// Sprites BG
const gradientBackground = getLayer({
  hue: 0.6,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -10.5,
});
scene.add(gradientBackground);

function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.007;
  fireEffect.update(0.016);
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);