import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Postprocessing with Bloom effect
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Create Material and Line Geometry
const material = new THREE.LineBasicMaterial({ color: 0xffd700 });  // Golden color

// Set up the Golden Ratio Dragon Curve parameters
const goldenRatio = (1 + Math.sqrt(5)) / 2;
const r1 = Math.pow(1 / goldenRatio, 1 / goldenRatio);
const r2 = Math.pow(r1, 2);
const angle1 = Math.acos((1 + r1**2 - r1**4) / (2 * r1));
const angle2 = Math.acos((1 + r1**4 - r1**2) / (2 * r1**2));

function goldenDragon(x1, y1, x2, y2, turn, n, vertices) {
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (dist < 1 || n <= 0) {
        vertices.push(new THREE.Vector3(x2, y2, 0));
        return;
    }

    const angle = Math.atan2(y2 - y1, x2 - x1);
    let px, py;
    if (turn) {
        px = x1 + dist * r1 * Math.cos(angle + angle1);
        py = y1 + dist * r1 * Math.sin(angle + angle1);
    } else {
        px = x1 + dist * r2 * Math.cos(angle - angle2);
        py = y1 + dist * r2 * Math.sin(angle - angle2);
    }

    goldenDragon(x1, y1, px, py, true, n - 1, vertices);
    goldenDragon(px, py, x2, y2, false, n - 1, vertices);
}

// Setup the geometry to hold the vertices
const points = [];
goldenDragon(-5, -2, 15, -2, true, 10, points);  // Adjust the recursion level as needed
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);

// Position the camera and animate
camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    composer.render();
}
animate();