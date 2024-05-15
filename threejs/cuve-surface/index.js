import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js';
import { isOutOfBounds, areOverlapping, getSunlight, getSSSMaterial } from './lib.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 25;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const startHue = 0.1; // Math.random();
const endHue = -0.2; // Math.random();
console.log(startHue, endHue);
function getBox({ col, row, size, numCols, numRows }) {
  const spacing = 1;
  const startPos = {
    x: numCols * spacing * -0.5,
    y: numRows * spacing * -0.45,
  };
  const pos = {
    x: startPos.x + col * spacing,
    y: startPos.y + row * spacing,
    z: 0,
  };
  const depth = size * 10;
  const obj = new THREE.Object3D();
  obj.position.set(pos.x, pos.y, pos.z);

  const geo = new THREE.BoxGeometry(size, size, depth);
  const boxDepth = size * 10;
  const hue = THREE.MathUtils.lerp(startHue, endHue, col / numCols);
  const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
  const mat = getSSSMaterial(color);
  // const mat = new THREE.MeshStandardMaterial({ color });
  const boxMesh = new THREE.Mesh(geo, mat);
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  boxMesh.position.set(size * 0.5, size * -0.5, boxDepth * -0.5);
  obj.add(boxMesh);

  const edges = new THREE.EdgesGeometry(geo, 0.1);
  const linesMat = new THREE.LineBasicMaterial({ color });
  const line = new THREE.LineSegments(edges, linesMat);
  boxMesh.add(line);
  let goalZPos = 0;
  const offsetZ = Math.random() * 3;
  const rate = Math.random() * 0.05 + 0.02;
  const simplePos = new THREE.Vector3(pos.x, pos.y, 0);

  function update() {
    simplePos.set(obj.position.x, obj.position.y, 0);
    const distance = simplePos.distanceTo(mousePos);
    if (distance < 5.0) {
      goalZPos = (5.0 - distance) * 2 + offsetZ;
    } else {
      goalZPos = 0;
    }
    obj.position.z -= (obj.position.z - goalZPos) * rate;
  }
  obj.userData = {
    col,
    row,
    size,
    update,
  };
  return obj;
}

const noise = new ImprovedNoise();
function createComposition() {
  const arr = [];
  const group = new THREE.Group();
  group.userData.update = () => {
    for (let b of group.children) {
      b.userData.update();
    }
  };
  scene.add(group);
  const numCols = 48;
  const numRows = 48;
  const maxSize = 12;
  const noiseScale = 0.025;

  function placeBox({ size, col, row }) {
    let props = {
      size,
      col,
      row,
      numCols,
      numRows
    };
    let box = getBox(props);
    let canAdd = true;
    if (!isOutOfBounds({ box, numCols })) {
      for (let b of arr) {
        if (areOverlapping(box, b)) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) {
        arr.push(box);
        group.add(box);
      }
    }
  }
  for (let i = 0, len = numCols * numRows; i < len; i += 1) {
    let col = Math.floor(Math.random() * numCols);
    let row = Math.floor(Math.random() * numRows);
    const ns = noise.noise(col * noiseScale, row * noiseScale, 0);
    const size = Math.floor(Math.abs(ns) * maxSize) + 1;
    placeBox({ col, row, size });
  }
  // fill in little gaps
  for (let i = 0, len = numCols * numRows; i < len; i += 1) {
    let col = i % numCols;
    let row = Math.floor(i / numCols);
    placeBox({ col, row, size: 1 });
  }
  return group;
}
const boxes = createComposition();
scene.add(boxes);

// lights
const sunlight = getSunlight();
scene.add(sunlight);

const rightLight = new THREE.SpotLight(0x9900ff, 2000.0);
rightLight.position.set(38, 0, 0);
rightLight.target.position.set(0, 0, -10);
scene.add(rightLight);
const helper = new THREE.SpotLightHelper(rightLight);
// scene.add(helper);

const leftLight = new THREE.SpotLight(0xffaa00, 2000.0);
leftLight.position.set(-38, 0, 0);
leftLight.target.position.set(0, 0, -10);
scene.add(leftLight);
const helperL = new THREE.SpotLightHelper(leftLight);
// scene.add(helperL);

// Mouse Interactivity
const raycaster = new THREE.Raycaster();
const pointerPos = new THREE.Vector2(0, 0);
const mousePos = new THREE.Vector3(0, 0, 0);

const mousePlaneGeo = new THREE.PlaneGeometry(48, 48, 48, 48);
const mousePlaneMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.0
});
const mousePlane = new THREE.Mesh(mousePlaneGeo, mousePlaneMat);
scene.add(mousePlane);

window.addEventListener('mousemove', (evt) => {
  pointerPos.set(
    (evt.clientX / window.innerWidth) * 2 - 1,
    -(evt.clientY / window.innerHeight) * 2 + 1
  );
});

function handleRaycast() {
  raycaster.setFromCamera(pointerPos, camera);
  const intersects = raycaster.intersectObjects(
    [mousePlane],
    false
  );
  if (intersects.length > 0) {
    mousePos.copy(intersects[0].point);
  }
}

function animate() {
  requestAnimationFrame(animate);
  boxes.userData.update();
  handleRaycast();
  renderer.render(scene, camera);
  controls.update();
}
animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);