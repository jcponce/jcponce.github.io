import * as THREE from "three";

let scene, camera, renderer;
let particles = [];
let numParticles = 1100;
let numTypes;
let colorStep;
let forces, minDistances, radii;

class Particle {
    constructor() {
        let rad = Math.random() * 100;
        let ang = Math.random() * Math.PI * 2;
        this.position = new THREE.Vector3(rad * Math.cos(ang), rad * Math.sin(ang), 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.type = Math.floor(Math.random() * numTypes);

        let geometry = new THREE.SphereGeometry(4, 32, 32);
        let material = new THREE.MeshBasicMaterial({ color: new THREE.Color(`hsl(${this.type * colorStep}, 70%, 50%)`) });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }

    update() {
        let totalForce = new THREE.Vector3();
        for (let i = 0; i < particles.length; i++) {
            if (particles[i] !== this) {
                let direction = particles[i].position.clone().sub(this.position);
                let dis = direction.length();
                direction.normalize();

                if (dis < minDistances[this.type][particles[i].type]) {
                    let force = direction.clone().multiplyScalar(Math.abs(forces[this.type][particles[i].type]) * -3 * ((minDistances[this.type][particles[i].type] - dis) / minDistances[this.type][particles[i].type]));
                    totalForce.add(force);
                }

                if (dis < radii[this.type][particles[i].type]) {
                    let force = direction.clone().multiplyScalar(forces[this.type][particles[i].type] * ((radii[this.type][particles[i].type] - dis) / radii[this.type][particles[i].type]));
                    totalForce.add(force);
                }
            }
        }

        this.velocity.add(totalForce.multiplyScalar(0.05));
        this.position.add(this.velocity);
        this.velocity.multiplyScalar(0.85);

        if (this.position.x > window.innerWidth / 2) this.position.x -= window.innerWidth;
        if (this.position.x < -window.innerWidth / 2) this.position.x += window.innerWidth;
        if (this.position.y > window.innerHeight / 2) this.position.y -= window.innerHeight;
        if (this.position.y < -window.innerHeight / 2) this.position.y += window.innerHeight;

        this.mesh.position.copy(this.position);
    }
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    numTypes = Math.floor(Math.random() * 4) + 2;
    colorStep = 360 / numTypes;

    forces = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    minDistances = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    radii = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    setParameters();

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', setParameters, false);
}

function animate() {
    requestAnimationFrame(animate);
    updateParticles();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setParameters() {
    for (let i = 0; i < numTypes; i++) {
        for (let j = 0; j < numTypes; j++) {
            forces[i][j] = Math.random() * 0.7 + 0.3;
            if (Math.random() < 0.5) forces[i][j] *= -1;
            minDistances[i][j] = Math.random() * 20 + 30;
            radii[i][j] = Math.random() * 180 + 70;
        }
    }
}

function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}

