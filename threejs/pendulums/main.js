import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
//import { createPendulum, Pendulum } from './pendulum';
//import { createGround } from './ground';

function main() {
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
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(4, 10, 4);
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.bottom = -20;
  directionalLight.shadow.camera.left = -20;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const ground = createGround();
  scene.add(ground);

  //const pendulums = [];
  //for (let i = 0; i < 12; i++) {
  //  const pendulum = await createPendulum(scene, new THREE.Vector3(0, 0, -i * 1.2), 1.2 + i * 0.05);
  //  pendulums.push(pendulum);
  //}

  scene.fog = new THREE.Fog(0xc7dcff, 1, 80);
  //console.log(scene)
  //renderer.render(scene, camera);

  /*
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
    
    //const totalTime = time - startTime;
    //update(deltaTime, totalTime);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animationFrame);
  }
    */

  //function update(deltaTime, totalTime) {
  //  pendulums.forEach((p) => {
  //   p.update(totalTime);
  // });
  //}

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls in animation loop
    renderer.render(scene, camera);
  }

  animate();

  //window.requestAnimationFrame(animationFrame);
}

function loadTexture(loader, url) {
  const texture = loader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 10);
  return texture;
}

function createGround() {
  const loader = new THREE.TextureLoader();

  const textureColor = loadTexture(loader, './public/paving_color.jpg');
  const textureRoughness = loadTexture(loader, './public/paving_roughness.jpg');
  const textureNormal = loadTexture(loader, './public/paving_normal.jpg');
  const textureAmbientOcclusion = loadTexture(loader, './public/paving_ambient_occlusion.jpg');

  const planeGeometry = new THREE.PlaneGeometry(1000, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: textureColor,
    normalMap: textureNormal,
    normalScale: new THREE.Vector2(2, 2),
    roughness: 1,
    roughnessMap: textureRoughness,
    aoMap: textureAmbientOcclusion,
    aoMapIntensity: 1,
  });
  const mesh = new THREE.Mesh(planeGeometry, planeMaterial);

  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -5;

  return mesh;
}

main();