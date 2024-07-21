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
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let scene, camera, renderer, particles;
let numParticles = 600;
let numTypes;
let colorStep;
let forces, minDistances, radii;
let geometry;
let offsets, colors, velocities;
let material;
let params = {
    additiveBlending: false
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

    geometry = new THREE.CircleGeometry(5, 6);

    let instancedGeometry = new THREE.InstancedBufferGeometry().copy(geometry);

    offsets = new Float32Array(numParticles * 3);
    colors = new Float32Array(numParticles * 3);
    velocities = new Float32Array(numParticles * 3);

    instancedGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
    instancedGeometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: params.additiveBlending ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    particles = new THREE.InstancedMesh(instancedGeometry, material, numParticles);
    scene.add(particles);

    initializeParticles();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onMouseDown, false);
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

function onMouseDown() {
    if (!firstClick) {
        setParameters();
    }
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
        offsets[i * 3] = rad * Math.cos(ang);
        offsets[i * 3 + 1] = rad * Math.sin(ang);
        offsets[i * 3 + 2] = 0;
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
        let color = new THREE.Color(`hsl(${(i % numTypes) * colorStep}, 100%, 40%)`);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    particles.geometry.attributes.offset.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
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
            offsets[i * 3],
            offsets[i * 3 + 1],
            offsets[i * 3 + 2]
        );
        let type = i % numTypes;

        for (let j = 0; j < numParticles; j++) {
            if (i !== j) {
                let otherPosition = new THREE.Vector3(
                    offsets[j * 3],
                    offsets[j * 3 + 1],
                    offsets[j * 3 + 2]
                );

                let direction = new THREE.Vector3().subVectors(otherPosition, position);
                if (direction.x > halfWidth) direction.x -= width;
                if (direction.x < -halfWidth) direction.x += width;
                if (direction.y > halfHeight) direction.y -= height;
                if (direction.y < -halfHeight) direction.y += height;

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
            velocities[i * 3],
            velocities[i * 3 + 1],
            velocities[i * 3 + 2]
        );

        if (position.x > halfWidth) position.x -= window.innerWidth;
        if (position.x < -halfWidth) position.x += window.innerWidth;
        if (position.y > halfHeight) position.y -= window.innerHeight;
        if (position.y < -halfHeight) position.y += window.innerHeight;

        velocity.add(totalForce.multiplyScalar(0.05));
        position.add(velocity);
        velocity.multiplyScalar(0.85);

        offsets[i * 3] = position.x;
        offsets[i * 3 + 1] = position.y;
        offsets[i * 3 + 2] = position.z;
        velocities[i * 3] = velocity.x;
        velocities[i * 3 + 1] = velocity.y;
        velocities[i * 3 + 2] = velocity.z;
    }

    particles.geometry.attributes.offset.needsUpdate = true;
}

init();
animate();