import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import getLayer from "./getLayer.js";
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

    // Icosahedron Geometry
    //const geometry = new THREE.IcosahedronGeometry(1);
    const geometry = new THREE.DodecahedronGeometry(1);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    scene.add(line);

    fireEffect = getParticleSystem({
        camera,
        emitter: line,
        parent: scene,
        rate: 50.0,
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
    const s = 1.2;
    fractalLine.scale.set(s,s,s); // Adjust the scale of the fractal
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
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const r1 = Math.pow(1 / goldenRatio, 1 / goldenRatio);
    const r2 = Math.pow(r1, 2);
    const angle1 = Math.acos((1 + r1**2 - r1**4) / (2 * r1));
    const angle2 = Math.acos((1 + r1**4 - r1**2) / (2 * r2));

    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (dist < 0.05 || n <= 0) {
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

    vertices.push(new THREE.Vector3(x1, y1, 0));
    goldenDragon(x1, y1, px, py, true, n - 1, vertices);
    goldenDragon(px, py, x2, y2, false, n - 1, vertices);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
/*
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

    // Generate Golden Ratio Dragon fractal
    const points = [];
    goldenDragon(-5, -2, 7, -2, true, 20, points);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.position.z = -5; // Position behind the icosahedron
    fractalLine.position.x = 1.5; // Position behind the icosahedron
    fractalLine.position.y = 0.5; // Position behind the icosahedron
    let s = 1.5;
    fractalLine.scale.set(s, s, s);
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

function goldenDragon(x1, y1, x2, y2, turn, n, vertices) {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const r1 = Math.pow(1 / goldenRatio, 1 / goldenRatio);
    const r2 = Math.pow(r1, 2);
    const angle1 = Math.acos((1 + r1**2 - r1**4) / (2 * r1));
    const angle2 = Math.acos((1 + r1**4 - r1**2) / (2 * r2));

    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    if (dist < 0.1 || n <= 0) {
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
*/

/*
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

    // Generate Golden Ratio Dragon fractal
    const points = pDragon(12, 1.5, 0, 0, 0x00ffff);
    const fractalGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const fractalLine = new THREE.Line(fractalGeometry, lineMaterial);
    fractalLine.position.z = -5; // Position behind the icosahedron
    fractalLine.position.x = 3.9; // Position behind the icosahedron
    fractalLine.position.y = 1; // Position behind the icosahedron
    let s = 0.2;  
    fractalLine.scale.set(s,s,s);
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

function pDragon(order, scale, hShift, vShift, color) {
    //const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    let c = 0, x = 0, y = 0, d = 1;
    const n = 1 << order;
    const points = [];
    x = y = 0;

    for (let i = 0; i <= n;) {
        points.push(new THREE.Vector3((x + hShift) * scale, (y + vShift) * scale, 0));

        let c1 = c & 1, c2 = c & 2;
        let c2x = 1 * d;
        if (c2 > 0) { c2x = -1 * d; }
        let c2y = -1 * c2x;

        if (c1 > 0) {
            y += c2y;
        } else {
            x += c2x;
        }

        i++;
        c += i / (i & -i);
    }

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
    controls.dampingFactor = 0.03;

    // Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(1.5);
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
    fractalLine.scale.set(1.7, 1.7, 1.7);
    
    scene.add(fractalLine);

    // Glow Effect (Bloom)
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.9; // Intensity of the bloom
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
*/