import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer;

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

    // Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(1);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    // Generate Lévy C curve fractal
    const maxIteration = 12; // Controls the complexity of the fractal
    const points = [];
    c_curve(-2, 0, 4, 0, maxIteration, points);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.rotation.z = Math.PI; 
    fractalLine.position.z = -5; // Position behind the icosahedron
    fractalLine.position.y = 2; 
    fractalLine.scale.set(2, 2, 2);
    
    scene.add(fractalLine);

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Intensity of the bloom
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the icosahedron
    scene.children[0].rotation.y += 0.005;
    scene.children[0].rotation.z += 0.002;

    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Function to create Lévy C curve fractal
function c_curve(x, y, length, angle, iteration, points) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const default_angle = 45;

    if (iteration > 0) {
        length = length / Math.sqrt(2);

        // First recursive call
        c_curve(x, y, length, angle + default_angle, iteration - 1, points);

        // Update x, y coordinates
        x = x + length * Math.cos(toRadians(angle + default_angle));
        y = y + length * Math.sin(toRadians(angle + default_angle));

        // Second recursive call
        c_curve(x, y, length, angle - default_angle, iteration - 1, points);
    } else {
        // Add the final segment to the points array
        points.push(new THREE.Vector3(x, y, 0));
        points.push(new THREE.Vector3(
            x + length * Math.cos(toRadians(angle)),
            y + length * Math.sin(toRadians(angle)),
            0
        ));
    }
}


/*
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

    // Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(1);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    // Generate Heighway Dragon fractal
    const maxDepth = 8; // Controls the complexity of the fractal
    const fractalLines = createHeighwayDragon(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 0, -2), maxDepth);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(fractalLines);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.position.z = -5; // Position behind the icosahedron
    scene.add(fractalLine);

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Intensity of the bloom
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the icosahedron
    scene.children[0].rotation.y += 0.01;

    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Function to create Heighway Dragon fractal
function createHeighwayDragon(start, end, depth) {
    if (depth === 0) {
        return [start, end];
    }

    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dir = end.clone().sub(start).normalize();
    const normal = new THREE.Vector3(-dir.y, dir.x, 0); // Rotate 90 degrees in 2D plane
    const midPoint = mid.clone().add(normal.multiplyScalar(dir.length() / Math.sqrt(2)));

    const points = [
        ...createHeighwayDragon(start, midPoint, depth - 1),
        ...createHeighwayDragon(midPoint, end, depth - 1)
    ];

    return points;
}
*/

/*
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

    // Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(1);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    // Generate Dragon curve fractal
    const maxDepth = 8; // Controls the complexity of the fractal
    const fractalLines = createDragonCurve(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 0, -2), maxDepth);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(fractalLines);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.position.z = -5; // Position behind the icosahedron
    scene.add(fractalLine);

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Intensity of the bloom
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the icosahedron
    scene.children[0].rotation.y += 0.01;

    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Function to create Dragon curve fractal
function createDragonCurve(start, end, depth) {
    if (depth === 0) {
        return [start, end];
    }

    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dir = end.clone().sub(start).normalize();
    const normal = new THREE.Vector3(-dir.y, dir.x, 0); // Rotate 90 degrees in 2D plane
    const midPoint = mid.clone().add(normal.multiplyScalar(dir.length() / Math.sqrt(2)));

    const points = [
        ...createDragonCurve(start, midPoint, depth - 1),
        ...createDragonCurve(midPoint, end, depth - 1)
    ];

    return points;
}
*/

/*
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
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    // Generate fractal lines using Koch curve
    const maxDepth = 4; // Controls the complexity of the fractal
    const fractalLines = createFractalLines(new THREE.Vector3(-1.5, 0, 0), new THREE.Vector3(1.5, 0, 0), maxDepth);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(fractalLines);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    scene.add(fractalLine);

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 2; // Intensity of the bloom
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the scene
    scene.rotation.y += 0.01;

    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Recursive function to create Koch curve fractal lines
function createFractalLines(start, end, depth) {
    if (depth === 0) {
        return [start, end];
    }

    const v = end.clone().sub(start);
    const v1 = start.clone().add(v.clone().multiplyScalar(1 / 3));
    const v2 = start.clone().add(v.clone().multiplyScalar(2 / 3));

    const angle = Math.PI / 3; // 60 degrees for Koch curve
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const vMiddle = v1.clone().add(v.clone().multiplyScalar(1 / 3).applyMatrix4(new THREE.Matrix4().makeRotationZ(angle)));

    const points = [
        ...createFractalLines(start, v1, depth - 1),
        ...createFractalLines(v1, vMiddle, depth - 1),
        ...createFractalLines(vMiddle, v2, depth - 1),
        ...createFractalLines(v2, end, depth - 1)
    ];

    return points;
}
*/