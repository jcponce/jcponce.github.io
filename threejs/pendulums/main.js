import * as THREE from 'three';

import createGround from "./ground.js";
import createPendulum from "./pendulum.js";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

init();

function init() {
  const sceneCanvas = document.getElementById('sceneCanvas');
  sceneCanvas.width = window.innerWidth;
  sceneCanvas.height = window.innerHeight;

  const scene = new THREE.Scene();

  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = Math.max(7 / aspect, 5);
  camera.position.y = 1;
  camera.lookAt(0, -1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, antialias: true });
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement); // Initialize OrbitControls
  controls.enableDamping = true; // Optional: Enable damping (smooth panning and zooming)
  controls.dampingFactor = 0.1; // Optional: Set damping factor

  window.addEventListener('resize', () => {
    sceneCanvas.width = window.innerWidth;
    sceneCanvas.height = window.innerHeight;
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.position.z = Math.max(8 / aspect, 6);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  scene.background = new THREE.Color(0xc7dcff);

  const light = new THREE.AmbientLight(0xdddddd, 0.4);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(4, 10, 4);
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.bottom = -20;
  directionalLight.shadow.camera.left = -20;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const ground = createGround();
  scene.add(ground);

  const pendulums = [];
  for (let i = 0; i < 12; i++) {
    const pendulum = createPendulum(scene, new THREE.Vector3(0, 0, -i * 1.2), 1.2 + i * 0.05);
    pendulums.push(pendulum);
  }
  //console.log(pendulums)

  scene.fog = new THREE.Fog(0xc7dcff, 1, 80);

  let startTime = null;
  let lastFrameTime = null;
  function animationFrame(time) {
    if (startTime == null) {
      startTime = time;
    }
    if (lastFrameTime == null) {
      lastFrameTime = time;
    }
    const deltaTime = time - lastFrameTime;
    lastFrameTime = time;
    const totalTime = time - startTime;
    update(deltaTime, totalTime);

    controls.update(); // Update controls in animation loop

    //scene.rotation.y += 0.001 * Math.cos(time * 0.0005)

    renderer.render(scene, camera);
    window.requestAnimationFrame(animationFrame);
  }


  function update(deltaTime, totalTime) {
    pendulums.forEach((p) => {
      p.update(totalTime);
    });
  }

  window.requestAnimationFrame(animationFrame);
}
