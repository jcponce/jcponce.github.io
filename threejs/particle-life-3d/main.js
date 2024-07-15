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
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


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
//*/
