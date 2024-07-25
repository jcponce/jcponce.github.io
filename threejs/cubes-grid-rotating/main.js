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

let scene, camera, renderer;
let cubes = [];
const boxSize = 60;
let halfWidth, halfHeight;
let mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 500;

    halfWidth = window.innerWidth / 2;
    halfHeight = window.innerHeight / 2;

    for (let y = boxSize; y < window.innerHeight; y += boxSize * 1.5) {
        for (let x = boxSize; x < window.innerWidth; x += boxSize * 1.5) {
            const cube = createCube(x - halfWidth, y - halfHeight);
            cubes.push(cube);
            scene.add(cube);
        }
    }

    // Add enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Brighter soft white light
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight1.position.set(0, 200, 400);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight2.position.set(200, -200, 400);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight3.position.set(-200, -200, 400);
    scene.add(pointLight3);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);
}

function createCube(x, y) {
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    cube.userData = { spinX: 0, spinY: 0, hueValue: 0 };
    return cube;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    halfWidth = window.innerWidth / 2;
    halfHeight = window.innerHeight / 2;
}

function onMouseMove(event) {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    const intersects = raycaster.intersectObjects(cubes);

    if (intersects.length > 0) {
        const cube = intersects[0].object;
        const motion = new THREE.Vector2(mouse.prevX - mouse.x, mouse.prevY - mouse.y);
        cube.userData.spinX += motion.x * 10;
        cube.userData.spinY += motion.y * 10;
    }
}

function animate() {
    requestAnimationFrame(animate);

    cubes.forEach(cube => {
        cube.rotation.x += cube.userData.spinY * 0.05;
        cube.rotation.y += cube.userData.spinX * 0.05;

        cube.userData.spinX *= 0.97;
        cube.userData.spinY *= 0.97;

        cube.userData.hueValue += (Math.abs(cube.userData.spinX) + Math.abs(cube.userData.spinY)) * 0.05;
        if (cube.userData.hueValue > 255) {
            cube.userData.hueValue = 0;
        }

        cube.material.color.setHSL(cube.userData.hueValue / 255, 1, 0.5);
    });

    renderer.render(scene, camera);
}