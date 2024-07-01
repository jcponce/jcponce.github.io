/*--------------------
Renderer
--------------------*/
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.getElementById('canvas'), 
  antialias: true
})
renderer.setSize( window.innerWidth, window.innerHeight )


/*--------------------
Camera & Scene
--------------------*/
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.z = 5
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xe0e0e0 )
scene.fog = new THREE.Fog( 0xe0e0e0, 1, 15 )


/*--------------------
Controls
--------------------*/
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.1


/*--------------------
Light
--------------------*/
const ambientLight = new THREE.AmbientLight(0xffffff, .5)
scene.add(ambientLight)

const light2 = new THREE.PointLight(0xffffff, .5)
light2.position.set(0, 1, 0)
scene.add(light2)

const light = new THREE.PointLight(0xffffff, .1)
light.position.set(0, 2, 0)
scene.add(light)
light.castShadow = true
light.shadow.mapSize.width = 4096
light.shadow.mapSize.height = 4096
light.shadow.camera.near = 0.1
light.shadow.camera.far = 30

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/*--------------------
Init
--------------------*/
const meshes = []
const matcap = new THREE.TextureLoader().load('./public/marble_color.jpg')
const init = () => {
  const ballGeo = new THREE.SphereBufferGeometry(.3, 32, 32)
  const ballMat = new THREE.MeshMatcapMaterial( { 
    matcap: matcap
  })
  const hairGeo = new THREE.CylinderBufferGeometry(.006, .006, 8,  32)
  const hairMat = new THREE.MeshPhongMaterial( { 
    color: 0xcccccc
  })

  for (let i = 0; i < 10; i++) {
    const group = new THREE.Group()
    scene.add(group)
    
    const ball = new THREE.Mesh( ballGeo, ballMat )
    ball.position.y = -6
    ball.castShadow = true
    ball.receiveShadow = true
    group.add( ball )
    
    const hair = new THREE.Mesh( hairGeo, hairMat )
    hair.position.y = -2
    group.add( hair )
    
    group.position.x = -3. + i * .7
    group.position.y = 6
    
    gsap.fromTo(group.rotation, {
      x: -.3,
    }, {
      duration: 1.5,
      x: .3,
      repeat: -1,
      ease: 'power1.inOut',
      yoyo: true,
      delay: i * 0.1
    }) 
    meshes.push(group)
  }
  
  const geoPlane = new THREE.PlaneBufferGeometry(100, 100)
  const mat3 = new THREE.MeshPhongMaterial( { 
    color: 0xffffff,
    shininess: 0.4,
    metalness: 0.2,
  })
  const plane = new THREE.Mesh(geoPlane, mat3)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -2
  plane.receiveShadow = true
  scene.add(plane)
}
init()


/*--------------------
Renderer
--------------------*/
const render = () => {
	requestAnimationFrame( render )
	renderer.render( scene, camera )
  controls.update()
  scene.rotation.y += .0005
}
render()


/*--------------------
Resize
--------------------*/
const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}
window.addEventListener('resize', resize)