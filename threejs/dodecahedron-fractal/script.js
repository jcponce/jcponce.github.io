import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { getParticleSystem } from "./getParticleSystem.js";


let scene, camera, renderer, composer, fractalLine;
let n = 1;
let increasing = true;
const maxN = 25;
const speed = 0.03; // Adjust this value to control the speed of n's change
let fireEffect;

init();
animate();


function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Dodecahedron Geometry
    const geometry = new THREE.DodecahedronGeometry(1);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
    });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    fireEffect = getParticleSystem({
        camera,
        emitter: line,
        parent: scene,
        rate: 35.0,
        texture: 'img/circle.png',
    });

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Intensity of the bloom
    bloomPass.radius = 0.9;
    composer.addPass(bloomPass);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the icosahedron
    scene.children[0].rotation.y += 0.001;
    scene.children[0].rotation.x -= 0.002;
    scene.children[0].rotation.z += 0.002;

    // Update fractal
    updateFractal();
    fireEffect.update(0.016);
    composer.render();
}

function updateFractal() {
    // Remove previous fractal
    const fractal = scene.getObjectByName('fractal');
    if (fractal) {
        scene.remove(fractal);
    }

    // Generate new fractal with updated n
    const vertices = [];
    goldenDragon(-5, 0, 5, 0, true, Math.floor(n), vertices);

    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.position.z = -5; // Position behind the icosahedron
    fractalLine.position.y = -1;
    fractalLine.position.x = 2;
    const s = 1.3;
    fractalLine.scale.set(s, s, s); // Adjust the scale of the fractal
    fractalLine.name = 'fractal';
    scene.add(fractalLine);

    // Update n
    if (increasing) {
        n += speed;
        if (n >= maxN) {
            increasing = false;
        }
    } else {
        n -= speed;
        if (n <= 1) {
            increasing = true;
        }
    }
}

function goldenDragon(x1, y1, x2, y2, turn, n, vertices) {
    // https://larryriddle.agnesscott.org/ifs/heighway/goldenDragon.htm
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (n <= 0 || distance < 0.05) {
        vertices.push(new THREE.Vector3(x2, y2, 0));
        return;
    }
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const r1 = Math.pow(1 / goldenRatio, 1 / goldenRatio);
    const r2 = r1 ** 2;
    const angle1 = Math.acos((1 + r1 ** 2 - r1 ** 4) / (2 * r1));
    const angle2 = Math.acos((1 + r1 ** 4 - r1 ** 2) / (2 * r2));

    const angleBetweenPoints = Math.atan2(y2 - y1, x2 - x1);

    const r = turn ? r1 : r2;
    const angle = turn ? angle1 : -angle2;  // Choose the angle based on the turn

    const px = x1 + distance * r * Math.cos(angleBetweenPoints + angle);
    const py = y1 + distance * r * Math.sin(angleBetweenPoints + angle);

    vertices.push(new THREE.Vector3(x1, y1, 0));
    goldenDragon(x1, y1, px, py, true, n - 1, vertices);
    goldenDragon(px, py, x2, y2, false, n - 1, vertices);

    // const goldenRatio = (1 + Math.sqrt(5)) / 2;
    // const r1 = Math.pow(1 / goldenRatio, 1 / goldenRatio);
    // const r2 = Math.pow(r1, 2);
    // const angle1 = Math.acos((1 + r1 ** 2 - r1 ** 4) / (2 * r1));
    // const angle2 = Math.acos((1 + r1 ** 4 - r1 ** 2) / (2 * r2));

    // const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    // if (dist < 0.05 || n <= 0) {
    //     vertices.push(new THREE.Vector3(x2, y2, 0));
    //     return;
    // }

    // const angle = Math.atan2(y2 - y1, x2 - x1);
    // let px, py;
    // if (turn) {
    //     px = x1 + dist * r1 * Math.cos(angle + angle1);
    //     py = y1 + dist * r1 * Math.sin(angle + angle1);
    // } else {
    //     px = x1 + dist * r2 * Math.cos(angle - angle2);
    //     py = y1 + dist * r2 * Math.sin(angle - angle2);
    // }

    // vertices.push(new THREE.Vector3(x1, y1, 0));
    // goldenDragon(x1, y1, px, py, true, n - 1, vertices);
    // goldenDragon(px, py, x2, y2, false, n - 1, vertices);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}