import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

/*
 * 1. Three.js stuff
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * 1.1 Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('../textures/particles/1.png');

/**
 * 1.2 Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 25000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (random() - 0.5) * 1;
    colors[i] = random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.7;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color('#4ab8e2');

particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.alphaTest = 0.5;
//particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.z = -15;
particles.scale.x = 0.5;
particles.scale.y = 0.5;
particles.scale.z = 0.5;
scene.add(particles);

/**
 * 1.3 Resize window
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * 1.3 Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 20).setLength(30);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

/**
 * 1.5 Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Axes for reference
 */
//const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

/**
 * 2. Lorenz Attractor variation
 */
const initialParams = {
    Attractor: "Lorenz variation",
    sigma: 10,
    rho: 28,
    beta: 8 / 3,
    kappa: 200
};

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#copy_an_array
const params = { ...initialParams };

let attractor = (x, y, z) => {
    const { sigma, rho, beta, kappa } = params;

    const dx = (sigma * (y - x) + (sin(y / 5) * sin(z / 5) * kappa)) * .65;
    const dy = (x * (rho - z) - y + (sin(x / 5) * sin(z / 5) * kappa)) * .65;
    const dz = (x * y - beta * z + cos(y / 5) * cos(x / 5) * kappa) * .65;

    return { dx, dy, dz };
};

/**
 * 2.2 Reset functions
 */
const resetInitialPositions = () => {
    initialPositions = [];
    const size = 40;
    for (let i = 0; i < count; i++) {
        initialPositions.push({
            x: (random() - 0.5) * size,
            y: (random() - 0.5) * size,
            z: (random() - 0.5) * size
        });
    }
};

const resetParameters = () => {
    params.sigma = initialParams.sigma;
    params.rho = initialParams.rho;
    params.beta = initialParams.beta;
    params.kappa = initialParams.kappa;
    sigmaController.updateDisplay();
    rhoController.updateDisplay();
    betaController.updateDisplay();
    kappaController.updateDisplay();
    //resetInitialPositions();
};

/*
const goToSource = () => {
    window.location.href = "https://github.com/jcponce/jcponce.github.io/blob/master/threejs/attractors/lorenz-variation/main.js";
}
*/

/**
 * 3. UI controls
 */
const gui = new GUI();
gui.add(params, 'Attractor');
const sigmaController = gui.add(params, 'sigma', 1, 12, 0.01).listen().decimals(2);
const rhoController = gui.add(params, 'rho', -10, 30, 0.01).listen().decimals(2);
const betaController = gui.add(params, 'beta', -2, 5, 0.01).listen().decimals(2);
const kappaController = gui.add(params, 'kappa', 0, 300, 1).listen().decimals(0);
gui.add({ Reset: resetParameters }, 'Reset').name('Reset parameters');
gui.add({ Initial: resetInitialPositions }, 'Initial').name('Reset initial conditions');
gui.addColor(particlesMaterial, 'color').name('Color');
gui.close();

/**
 * 4. Animate stuff
 */
const dt = 0.002; // Time step for attractor simulation
let initialPositions = [];

resetInitialPositions();

const animate = () => {
    for (let i = 0; i < count; i++) {
        const { x, y, z } = initialPositions[i];
        const { dx, dy, dz } = attractor(x, y, z);

        initialPositions[i].x += dx * dt;
        initialPositions[i].y += dy * dt;
        initialPositions[i].z += dz * dt;

        const i3 = i * 3;
        positions[i3] = initialPositions[i].x;
        positions[i3 + 1] = initialPositions[i].y;
        positions[i3 + 2] = initialPositions[i].z;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call animation again on the next frame
    window.requestAnimationFrame(animate);
};

animate();