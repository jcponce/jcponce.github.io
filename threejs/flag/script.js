import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

let testVertexShader, testFragmentShader;

/**
 * Load shaders using fetch
 */
async function loadShaders() {
    const vertexResponse = await fetch('./shaders/test/vertex.glsl');
    testVertexShader = await vertexResponse.text();

    const fragmentResponse = await fetch('./shaders/test/fragment.glsl');
    testFragmentShader = await fragmentResponse.text();

    // Initialize the scene after shaders are loaded
    initializeScene();
}

/**
 * Initialize Three.js Scene
 */
function initializeScene() {
    // Debug
    const gui = new GUI();

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Scene
    const scene = new THREE.Scene();

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load('static/textures/dynamic.jpg');

    // Geometry
    const geometry = new THREE.PlaneGeometry(1.5, 1.5, 128, 128);

    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random();
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader, // Use loaded vertex shader
        fragmentShader: testFragmentShader, // Use loaded fragment shader
        uniforms: {
            intensity: { value: 0.14 },
            uFrequency: { value: new THREE.Vector2(5, 5) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('orange') },
            uTexture: { value: flagTexture }
        }
    });

    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.y = 2 / 3;
    scene.add(mesh);

    // Sizes
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

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0.25, -0.25, 1);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animate
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Update material
        material.uniforms.uTime.value = elapsedTime;

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };

    tick();
}

// Start loading shaders and then initialize the scene
loadShaders();
