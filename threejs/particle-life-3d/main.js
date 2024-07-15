/**
 * Inspired by Terry Soule's Programming Particle Life
 * https://youtu.be/xiUpAeos168?feature=shared
 * 
 * This version by Juan Carlos Ponce Campuzano
 * 10/Jul/2024
 * https://www.dynamicmath.xyz/threejs/particle-life
 * 
 * There are different versions below, but I think the one 
 * I like the most is with PerspecticeCamera.
 * TO-DO: 
 * - Clean the code :P
 * - Make a 3D version
 */

import * as THREE from "three";
import getLayer from "./getLayer.js";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let particles = [];
let numParticles = 1300; // Increase number of particles
let numTypes;
let colorStep;
let forces, minDistances, radii;

let worldDimensions = new THREE.Vector3(500, 500, 500);

class Particle {
    constructor() {
        let rad = Math.random() * 100;
        let angX = Math.random() * Math.PI * 2;
        let angY = Math.random() * Math.PI * 2;
        this.position = new THREE.Vector3(rad * Math.cos(angX), rad * Math.sin(angX), rad * Math.sin(angY));
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.type = Math.floor(Math.random() * numTypes);

        let hue = this.type * colorStep;
        let color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);

        let geometry = new THREE.SphereGeometry(2, 32, 32);
        let material = new THREE.MeshLambertMaterial({
            color: color,
            emissive: 0x000000,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }

    update() {
        let totalForce = new THREE.Vector3();
        for (let i = 0; i < particles.length; i++) {
            if (particles[i] !== this) {
                let direction = particles[i].position.clone().sub(this.position);

                if (direction.x > worldDimensions.x / 2) direction.x -= worldDimensions.x;
                if (direction.x < -worldDimensions.x / 2) direction.x += worldDimensions.x;
                if (direction.y > worldDimensions.y / 2) direction.y -= worldDimensions.y;
                if (direction.y < -worldDimensions.y / 2) direction.y += worldDimensions.y;
                if (direction.z > worldDimensions.z / 2) direction.z -= worldDimensions.z;
                if (direction.z < -worldDimensions.z / 2) direction.z += worldDimensions.z;


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

        if (this.position.x > worldDimensions.x / 2) this.position.x -= worldDimensions.x;
        if (this.position.x < -worldDimensions.x / 2) this.position.x += worldDimensions.x;
        if (this.position.y > worldDimensions.y / 2) this.position.y -= worldDimensions.y;
        if (this.position.y < -worldDimensions.y / 2) this.position.y += worldDimensions.y;
        if (this.position.z > worldDimensions.z / 2) this.position.z -= worldDimensions.z;
        if (this.position.z < -worldDimensions.z / 2) this.position.z += worldDimensions.z;

        this.mesh.position.copy(this.position);
    }
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 300;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //controls.screenSpacePanning = false;
    //controls.minDistance = 500;
    //controls.maxDistance = 3000;

    let directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 3);
    light1.position.set(0, 200, 0);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 3);
    light2.position.set(100, 200, 100);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 3);
    light3.position.set(- 100, - 200, - 100);
    scene.add(light3);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    scene.add(hemiLight);

    // Sprites BackGround
    const gradientBackground = getLayer({
        hue: 0.6,
        numSprites: 8,
        opacity: 0.2,
        radius: 500,
        size: 1000,
        z: -400,
    });
    scene.add(gradientBackground);


    numTypes = Math.floor(Math.random() * 7) + 2;
    colorStep = 360 / numTypes;

    forces = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    minDistances = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    radii = Array.from({ length: numTypes }, () => Array(numTypes).fill(0));
    setParameters();

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('dblclick', setParameters, false);
}

function animate() {
    requestAnimationFrame(animate);
    updateParticles();
    controls.update();
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





/*
let scene, camera, renderer, particles;
let numParticles = 1200;
let numTypes;
let colorStep;
let forces, minDistances, radii;
let texture;
let geometry;
let positions, colors, velocitiesBuffer;
let controls;

let material;
let params = {
    additiveBlending: true
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    numTypes = Math.floor(Math.random() * 5) + 2;
    colorStep = 360 / numTypes;

    forces = new Float32Array(numTypes * numTypes);
    minDistances = new Float32Array(numTypes * numTypes);
    radii = new Float32Array(numTypes * numTypes);
    setParameters();

    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(numParticles * 3);
    colors = new Float32Array(numParticles * 3);
    velocitiesBuffer = new Float32Array(numParticles * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    texture = new THREE.TextureLoader().load('assets/1.png', function (texture) {
        material = new THREE.PointsMaterial({
            size: 30,
            sizeAttenuation: true,
            transparent: true,
            vertexColors: true,
            alphaMap: texture,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Optional: Enable damping (smooth panning and zooming)
    //controls.dampingFactor = 0.1; // Optional: Set damping factor

    initializeParticles();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('dblclick', onDoubleClick, false);
    document.getElementById('resetButton').addEventListener('click', resetParticles, false);

    const gui = new GUI();
    gui.add(params, 'additiveBlending').name('Additive Blending').onChange(toggleBlending);
    gui.close();
}

function toggleBlending(value) {
    if (material) {
        material.blending = value ? THREE.AdditiveBlending : THREE.NormalBlending;
        material.needsUpdate = true;
    }
}

function onDoubleClick() {
    if (!firstClick) {
        setParameters();
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (particles) {
        updateParticles();
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



function setParameters() {
    for (let i = 0; i < numTypes; i++) {
        for (let j = 0; j < numTypes; j++) {
            let index = i * numTypes + j;
            forces[index] = Math.random() * 0.7 + 0.3;
            if (Math.random() < 0.5) forces[index] *= -1;
            minDistances[index] = Math.random() * 20 + 30;
            radii[index] = Math.random() * 180 + 70;
        }
    }
}

function initializeParticles() {
    for (let i = 0; i < numParticles; i++) {
        let rad = Math.random() * 100;
        let ang = Math.random() * Math.PI * 2;
        let z = (Math.random() - 0.5) * 200;
        positions[i * 3] = rad * Math.cos(ang);
        positions[i * 3 + 1] = rad * Math.sin(ang);
        positions[i * 3 + 2] = z;
        velocitiesBuffer[i * 3] = 0;
        velocitiesBuffer[i * 3 + 1] = 0;
        velocitiesBuffer[i * 3 + 2] = 0;
        let color = new THREE.Color(`hsl(${(i % numTypes) * colorStep}, 100%, 40%)`);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    if (particles) {
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }
}

function resetParticles() {
    numTypes = Math.floor(Math.random() * 4) + 2;
    colorStep = 360 / numTypes;

    forces = new Float32Array(numTypes * numTypes);
    minDistances = new Float32Array(numTypes * numTypes);
    radii = new Float32Array(numTypes * numTypes);
    setParameters();

    initializeParticles();
}

function updateParticles() {
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    let halfWidth = window.innerWidth / 2;
    let halfHeight = window.innerHeight / 2;

    for (let i = 0; i < numParticles; i++) {
        let totalForce = new THREE.Vector3();
        let position = new THREE.Vector3(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
        );
        let type = i % numTypes;

        for (let j = 0; j < numParticles; j++) {
            if (i !== j) {
                let otherPosition = new THREE.Vector3(
                    positions[j * 3],
                    positions[j * 3 + 1],
                    positions[j * 3 + 2]
                );

                let direction = new THREE.Vector3().subVectors(otherPosition, position);
                if (direction.x > halfWidth) direction.x -= width;
                if (direction.x < -halfWidth) direction.x += width;
                if (direction.y > halfHeight) direction.y -= height;
                if (direction.y < -halfHeight) direction.y += height;
                if (direction.z > 500) direction.z -= 1000;
                if (direction.z < -500) direction.z += 1000;

                let dis = direction.length();
                direction.normalize();

                let otherType = j % numTypes;
                let index = type * numTypes + otherType;

                if (dis < minDistances[index]) {
                    let force = direction.clone().multiplyScalar(Math.abs(forces[index]) * -3 * ((minDistances[index] - dis) / minDistances[index]));
                    totalForce.add(force);
                }

                if (dis < radii[index]) {
                    let force = direction.clone().multiplyScalar(forces[index] * ((radii[index] - dis) / radii[index]));
                    totalForce.add(force);
                }
            }
        }

        let velocity = new THREE.Vector3(
            velocitiesBuffer[i * 3],
            velocitiesBuffer[i * 3 + 1],
            velocitiesBuffer[i * 3 + 2]
        );

        if (position.x > halfWidth) position.x -= window.innerWidth;
        if (position.x < -halfWidth) position.x += window.innerWidth;
        if (position.y > halfHeight) position.y -= window.innerHeight;
        if (position.y < -halfHeight) position.y += window.innerHeight;
        if (position.z > 500) position.z -= 1000;
        if (position.z < -500) position.z += 1000;

        velocity.add(totalForce.multiplyScalar(0.05));
        position.add(velocity);
        velocity.multiplyScalar(0.85);

        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
        velocitiesBuffer[i * 3] = velocity.x;
        velocitiesBuffer[i * 3 + 1] = velocity.y;
        velocitiesBuffer[i * 3 + 2] = velocity.z;
    }

    geometry.attributes.position.needsUpdate = true;
}

init();
animate();
*/
