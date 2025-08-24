import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b1020, 0.015);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 200);
// Rotate the camera to have z-axis as top view
camera.position.set(2.5, 4, 1.5); // Position camera above the sphere looking down
camera.up.set(0, 0, 1); // Set Z as the up direction

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(6, 1, 5);
scene.add(dir);

const grid = new THREE.GridHelper(20, 20, 0xa7b9e5, 0x1c2c4f);
grid.material.opacity = 0.84;
grid.material.transparent = true;
grid.rotation.x = Math.PI / 2; // Rotate grid to be horizontal (XY plane)
scene.add(grid);
grid.visible = false;

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);
axesHelper.visible = false;

// Create the main sphere in the center of the scene
const sphereGeo = new THREE.SphereGeometry(1, 48, 32);
const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x22409a,
    roughness: 0.25,
    metalness: 0.05,
    transparent: true,
    opacity: 0.35,
    emissive: 0x07142e,
    emissiveIntensity: 0.8,
    side: THREE.DoubleSide
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const pickMarkers = new THREE.Group();
scene.add(pickMarkers);
const markerGeo = new THREE.SphereGeometry(0.035, 16, 16);
const markerMat = new THREE.MeshStandardMaterial({ color: 0xb4d0ff, emissive: 0x224488, emissiveIntensity: 0.5 });

// Parameters for the Hopf fibration
const params = {
    waves: 4,
    amplitude: 0.25,
    segments: 240
};

// Set up toggle functionality
const toggleFibers = document.getElementById('toggle-fibers');
toggleFibers.addEventListener('change', function () {
    fibers.visible = this.checked;
});

let sphereVisible = true;
const toggleSphere = document.getElementById('toggle-sphere');
toggleSphere.addEventListener('change', function () {
    sphere.visible = this.checked;
    sphereVisible = this.checked;  // track state
    if (!sphereVisible) {
        // Hide marker when sphere is off
        selectionMarker.style.display = 'none';
        selectedPoint = null;
    }
});

const togglePoints = document.getElementById('toggle-points');
togglePoints.addEventListener('change', function () {
    pickMarkers.visible = this.checked;
});

const toggleAxes = document.getElementById('toggle-axes');
toggleAxes.addEventListener('change', function () {
    axesHelper.visible = this.checked;
});

const toggleGrid = document.getElementById('toggle-grid');
toggleGrid.addEventListener('change', function () {
    grid.visible = this.checked;
});

document.getElementById('clear-btn').addEventListener('click', clearFibers);

// Set up examples dropdown
const examplesDropdown = document.getElementById('examples');
examplesDropdown.addEventListener('change', function () {
    if (this.value !== 'custom') {
        loadExample(this.value);
    }
});

function saveCurrentView() {
    // Render one more frame to ensure the canvas is up-to-date
    renderer.render(scene, camera);

    // Get image data from canvas
    const dataURL = renderer.domElement.toDataURL("image/png");

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = dataURL;

    // Name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `hopf_view_${timestamp}.png`;

    // Trigger download
    link.click();
}

// Hook the button to the function
document.getElementById("save-view-btn").addEventListener("click", saveCurrentView);

// Add a "Share Scene" button under Save View
const shareBtn = document.getElementById("share-link-btn");

shareBtn.addEventListener("click", () => {
    const state = {
        fibers: pickMarkers.children.map(m => m.position.clone().normalize().toArray()),
        toggles: {
            fibers: toggleFibers.checked,
            sphere: toggleSphere.checked,
            points: togglePoints.checked,
            axes: toggleAxes.checked,
            grid: toggleGrid.checked,
        },
        example: examplesDropdown.value
    };

    // Encode state
    const json = JSON.stringify(state);
    const encoded = btoa(json); // base64
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
        alert("Shareable link copied to clipboard!");
    });
});

// On load, check if URL has state
window.addEventListener("load", () => {
    if (window.location.hash.length > 1) {
        try {
            const encoded = window.location.hash.slice(1);
            const json = atob(encoded);
            const state = JSON.parse(json);

            // Restore example
            examplesDropdown.value = state.example;
            if (state.example !== "custom") loadExample(state.example);

            // Restore toggles
            toggleFibers.checked = state.toggles.fibers; fibers.visible = state.toggles.fibers;
            toggleSphere.checked = state.toggles.sphere; sphere.visible = state.toggles.sphere;
            togglePoints.checked = state.toggles.points; pickMarkers.visible = state.toggles.points;
            toggleAxes.checked = state.toggles.axes; axesHelper.visible = state.toggles.axes;
            toggleGrid.checked = state.toggles.grid; grid.visible = state.toggles.grid;

            // Restore custom fibers
            if (state.example === "custom") {
                clearFibers();
                state.fibers.forEach(arr => {
                    addFiber(new THREE.Vector3(...arr));
                });
            }
        } catch (err) {
            console.error("Invalid state in URL:", err);
        }
    }
});

// Modal elements
const modalBtn = document.getElementById("modal-btn");
const modal = document.getElementById("info-modal");
const overlay = document.getElementById("info-modal-overlay");
const closeBtn = document.getElementById("close-modal");

// Open modal
modalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    overlay.style.display = "block";
});

// Close modal (via button)
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
});

// Close modal (via overlay click)
overlay.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
});

// Optional: close with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.style.display = "none";
        overlay.style.display = "none";
    }
});


// Set up controls toggle
const controlsElement = document.getElementById('controls');
const toggleControlsBtn = document.getElementById('toggle-controls-btn');
let controlsVisible = true;

toggleControlsBtn.addEventListener('click', function () {
    controlsVisible = !controlsVisible;
    if (controlsVisible) {
        controlsElement.classList.remove('hidden');
        toggleControlsBtn.textContent = '▼ Hide Controls';
    } else {
        controlsElement.classList.add('hidden');
        toggleControlsBtn.textContent = '▲ Controls';
    }
});

function spinorFromN(n) {
    const nz = n.z;
    const denom = 2 * Math.sqrt((1 + nz) / 2);
    if (denom > 1e-8) {
        const z1 = { re: Math.sqrt((1 + nz) / 2), im: 0 };
        const z2 = { re: n.x / denom, im: n.y / denom };
        return { z1, z2 };
    } else {
        return { z1: { re: 0, im: 0 }, z2: { re: 0, im: 1 } };
    }
}

function rotatePhase(z, theta) {
    const c = Math.cos(theta), s = Math.sin(theta);
    return { re: z.re * c - z.im * s, im: z.re * s + z.im * c };
}

function stereoProjectS3ToR3(x1, x2, x3, x4) {
    const d = 1 - x4;
    const inv = 1 / d;
    return new THREE.Vector3(x1 * inv, x2 * inv, x3 * inv);
}

function hopfFiberPoints(n, segments) {
    const { z1, z2 } = spinorFromN(n);
    const pts = [];
    for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const theta = t * Math.PI * 2;
        const z1t = rotatePhase(z1, theta);
        const z2t = rotatePhase(z2, theta);
        const p = stereoProjectS3ToR3(z1t.re, z1t.im, z2t.re, z2t.im);
        pts.push(p);
    }
    return pts;
}

const fibers = new THREE.Group();
scene.add(fibers);

function clearFibers() {
    // Remove all fibers
    while (fibers.children.length > 0) {
        const fiber = fibers.children[0];
        fiber.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        fibers.remove(fiber);
    }

    // Remove all markers
    while (pickMarkers.children.length > 0) {
        const marker = pickMarkers.children[0];
        if (marker.geometry) marker.geometry.dispose();
        if (marker.material) marker.material.dispose();
        pickMarkers.remove(marker);
    }

    // Reset dropdown to custom
    examplesDropdown.value = 'custom';
}

function addFiber(n) {
    const segments = params.segments;
    const pts = hopfFiberPoints(n, segments);

    // Make a smooth curve from Hopf fiber points
    const curve = new THREE.CatmullRomCurve3(pts, true); // true = closed loop
    const tubeGeo = new THREE.TubeGeometry(
        curve,
        segments * 2,       // tubular segments
        0.02,               // radius (thickness of fiber)
        12,                 // radial segments
        true                // closed tube
    );
    const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.4 + 0.8 * Math.random(), 0.9, 0.5),
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0x113355,
        emissiveIntensity: 0.5
    });

    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    fibers.add(tube);

    // Keep your marker
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(n.clone().multiplyScalar(1.001));
    pickMarkers.add(marker);
}


function loadExample(exampleName) {
    clearFibers();

    if (exampleName === 'latitude-bands') {
        const bands = 6;   // number of latitude circles
        const perBand = 80; // points per circle

        for (let b = 1; b < bands; b++) {
            const phi = (b / bands) * Math.PI - Math.PI / 2; // from -90° to +90°
            const z = Math.sin(phi);
            const r = Math.cos(phi);

            for (let i = 0; i < perBand; i++) {
                const theta = (i / perBand) * Math.PI;
                const x = r * Math.cos(theta + Math.PI);
                const y = r * Math.sin(theta + Math.PI);
                addFiber(new THREE.Vector3(x, y, z).normalize());
            }
        }
    } else if (exampleName === 'spiral') {
        // Spiral pattern - points along a spiral on the sphere
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
            const t = i / numPoints;
            const theta = t * Math.PI * 4; // Multiple rotations
            const phi = Math.acos(1 - 2 * t); // From north to south pole

            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.sin(phi) * Math.sin(theta);
            const z = Math.cos(phi);

            addFiber(new THREE.Vector3(x, y, z).normalize());
        }
    } else if (exampleName === 'icosahedral') {
        const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
        const vertices = [
            [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
            [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
            [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
        ];
        for (let v of vertices) {
            const n = new THREE.Vector3(v[0], v[1], v[2]).normalize();
            addFiber(n);
        }
    } else if (exampleName === 'longitude-bands') {
        const bands = 4;   // number of longitude slices
        const perBand = 40; // points along each slice

        for (let b = 0; b < bands; b++) {
            const theta = (b / bands) * Math.PI * 2; // longitude angle
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            for (let i = 0; i < perBand; i++) {
                const phi = (i / (perBand - 1) + Math.PI / 8) * Math.PI / 2; // latitude from north to south pole
                const x = Math.sin(phi) * cosTheta;
                const y = Math.sin(phi) * sinTheta;
                const z = Math.cos(phi);
                addFiber(new THREE.Vector3(x, y, z).normalize());
            }
        }
    } else if (exampleName === 'equator-sine') {
        // Sinusoidal closed curve along the equator
        const numPoints = 200;   // resolution
        const amplitude = 0.3;   // how far the sine goes up/down
        const frequency = 5;     // number of oscillations around the equator

        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2; // go around once
            const x = Math.cos(t);
            const y = Math.sin(t);
            const z = amplitude * Math.sin(frequency * t); // sinusoidal wiggle

            addFiber(new THREE.Vector3(x, y, z).normalize());
        }
    }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedPoint = null;
const selectionMarker = document.getElementById('selection-marker');

function onMouseMove(e) {
    if (!sphereVisible) {
        selectedPoint = null;
        selectionMarker.style.display = 'none';
        return; // don’t allow selection when sphere is off
    }

    // Normal raycasting logic
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObject(sphere, false)[0];

    if (hit) {
        selectedPoint = hit.point.clone().normalize();

        // Project 3D point to screen coords
        const vector = selectedPoint.clone();
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

        selectionMarker.style.left = `${x}px`;
        selectionMarker.style.top = `${y}px`;
        selectionMarker.style.display = 'block';
    } else {
        selectedPoint = null;
        selectionMarker.style.display = 'none';
    }
}

function onKeyDown(e) {
    // Add fiber when 'A' key is pressed
    if (e.key === 'a' || e.key === 'A') {
        if (selectedPoint) {
            addFiber(selectedPoint);
            examplesDropdown.value = 'custom';
        }
    }

    // Toggle controls with 'H' key
    if (e.key === 'h' || e.key === 'H') {
        toggleControlsBtn.click();
    }

    // Save current view with 'S' key
    if (e.key === 's' || e.key === 'S') {
        saveCurrentView();
    }
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('keydown', onKeyDown);

function render() {
    controls.update();

    renderer.setClearColor(0x0b1020, 1);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
render();

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

// Add initial fibers
addFiber(new THREE.Vector3(0, 0, 1));
addFiber(new THREE.Vector3(1, 0, 0).normalize());
addFiber(new THREE.Vector3(0, 1, 0).normalize());