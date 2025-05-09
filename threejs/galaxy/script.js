import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'three/addons/libs/lil-gui.module.min.js'

let galaxyVertexShader, galaxyFragmentShader;

/**
 * Load shaders using fetch
 */
async function loadShaders() {
    const vertexResponse = await fetch('./shaders/galaxy/vertex.glsl');
    galaxyVertexShader = await vertexResponse.text();

    const fragmentResponse = await fetch('./shaders/galaxy/fragment.glsl');
    galaxyFragmentShader = await fragmentResponse.text();

    // Initialize the scene after shaders are loaded
    initializeScene();
}

function initializeScene() {
    /**
 * Base
 */
    // Debug
    const gui = new GUI()

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Galaxy
     */
    const parameters = {}
    parameters.count = 300000
    parameters.size = 0.005
    parameters.radius = 10
    parameters.branches = 5
    parameters.spin = 1
    parameters.randomness = 0.5
    parameters.randomnessPower = 2
    parameters.insideColor = '#2e89ff'
    parameters.outsideColor = '#caa5f8'
    parameters.radiusSphere = 2

    let geometry = null
    let material = null
    let points = null

    const generateGalaxy = () => {
        if (points !== null) {
            geometry.dispose()
            material.dispose()
            scene.remove(points)
        }

        /**
         * Geometry
         */
        geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)
        const scales = new Float32Array(parameters.count * 1)
        const randomness = new Float32Array(parameters.count * 3)

        const insideColor = new THREE.Color(parameters.insideColor)
        const outsideColor = new THREE.Color(parameters.outsideColor)

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            positions[i3] = Math.cos(branchAngle) * (radius + parameters.radiusSphere)
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * (radius + parameters.radiusSphere)


            // Randomness
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            randomness[i3] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ


            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scales
            scales[i] = Math.random();
        }


        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

        /**
         * Material
         */
        material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: galaxyVertexShader,
            fragmentShader: galaxyFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 50 * renderer.getPixelRatio() }
            }
        })

        /**
         * Points
         */
        points = new THREE.Points(geometry, material)
        scene.add(points)
    }

    // Sphere geometry and material
    const sphereGeometry = new THREE.SphereGeometry(parameters.radiusSphere, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    gui.add(parameters, 'count').min(100).max(500000).step(100).onFinishChange(generateGalaxy)
    gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
    gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
    gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
    gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
    //gui.add(parameters, 'radiusSphere').min(1).max(5).step(0.01).onFinishChange(generateGalaxy)
    gui.close()

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 9
    camera.position.y = 4
    camera.position.z = 9
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    generateGalaxy() // I need to call this right after the Renderer

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // Update material
        material.uniforms.uTime.value = elapsedTime

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}

// Start loading shaders and then initialize the scene
loadShaders();