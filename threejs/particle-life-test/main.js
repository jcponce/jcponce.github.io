// some constants we'll need later
const NUM_INSTANCES = 1000;
const ARROW_FORWARD = new THREE.Vector3(0, 0, 1);
const UP = new THREE.Vector3(0, 1, 0);

// v3 is used as temporary vector whenever needed. Doing something
// like this can help to significantly reduce the GC-overhead.
const v3 = new THREE.Vector3();

// Lorenz attractor parameters
const sigma = 10;
const rho = 28;
const beta = 8 / 3;

/**
 * Initializes the demo. 
 *
 * This function is called waaay down just before the renderloop 
 * is started. It returns an update-function that is called inside 
 * the renderloop for every frame. 
 *
 * This way, we can keep the interesting parts separated from the
 * boring boilerplace of setting up three.js and such.
 *
 * @return {function(t:Number):void} A function that will be
 *     called on every frame to update the simulation.
 */
function init(scene) {
  // helpers
  const numInstances = NUM_INSTANCES;

  // setup instance-attribute buffers
  const iOffsets = new Float32Array(numInstances * 3);
  const iRotations = new Float32Array(numInstances * 4);
  const iColors = new Float32Array(numInstances * 4);

  // setup geometry with instance-attributes. The geometry is 
  // initialized with attributes from the basic arrow-geometry 
  // defined somewhere below in `getArrowGeometry()`.
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.copy(getArrowGeometry());
  
  // per instance we want to control the position, the rotation 
  // and the base-color of the arrow.
  geometry.addAttribute('iOffset',
      new THREE.InstancedBufferAttribute(iOffsets, 3, 1));
  geometry.addAttribute('iRotation',
      new THREE.InstancedBufferAttribute(iRotations, 4, 1));
  geometry.addAttribute('iColor',
      new THREE.InstancedBufferAttribute(iColors, 4, 1));

  // we will change position and offset on every change. I'm not 
  // sure this has much effect but according to documentation it 
  // allows the GPU drivers to somehow optimize memory-allocations.
  geometry.attributes.iRotation.setDynamic(true);
  geometry.attributes.iOffset.setDynamic(true);
  
  // simulation and manipulation of the attribute-buffers happens
  // in the Arrow-class defined below. For now just note that 
  // there is an array of arrows and each of the arrows has an
  // instance-index that will be used to compute where its position,
  // orientation and color are stored in these attribute-buffers.
  
  const arrows = [];
  for (let index = 0; index < numInstances; index++) {
    arrows.push(new Arrow(index, {
      position: iOffsets,
      rotation: iRotations,
      color: iColors
    }));
  }

  // create the mesh that now contains all of our instances. 
  // (the material is defined a bit further down)
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // frustrum-culling should always be disabled for instanced
  // geometries, as the real position of instances cannot be
  // determined from the mesh-position and bounding-box
  mesh.frustumCulled = false;

  // and here is our contribution to the renderloop:
  // store the time of the last update
  let t0 = performance.now();
  return t => {
    // limit the maximum timestep per call (otherwise arrows
    // will dissappear if you switch away from the tab for a while)
    const dt = Math.min((t - t0) / 1000, 0.1);

    // update the simulation for all arrows    
    for (let i=0; i < numInstances; i++) {
      arrows[i].update(dt);
    }
    
    // mark the instance-attributes as changed so they will 
    // get uploaded to the GPU
    geometry.attributes.iRotation.needsUpdate = true;
    geometry.attributes.iOffset.needsUpdate = true;

    t0 = t;
  };
}


/**
 * The Arrow-class implements the logic for simulation and 
 * buffer-updates for the arrow-instances.
 */
class Arrow {
  constructor(index, buffers) {
    this.index = index;
    this.buffers = buffers;
    
    // the offsets at which data for this arrow is located 
    // in the attribute-buffers
    this.offsets = {
      position: index * 3,
      rotation: index * 4,
      color: index * 4
    }

    // these properties store the current state of the arrow. those 
    // will be written to the attribute-buffers after updating.
    this.rotation = new THREE.Quaternion();
    this.position = new THREE.Vector3();
    this.color = new THREE.Color();
    
    this.init();
    this.update();
  }
  
  /**
   * Initialize arrow with randomized color, position and velocity.
   */
  init() {
    // colors won't be modified later, so write them to the
    // buffer right away
    this.color.setHSL( 0.55, rnd(0.3, 0.9), rnd(0.1, 0.9) );
    this.color.toArray(this.buffers.color, this.offsets.color);

    // random initial position
    this.position.set(rnd(-20, 20), rnd(-20, 20), rnd(20, 50));
  }

  /**
   * Update the velocity, position and orientation for a 
   * given timestep.
   *
   * NOTE: this is extremely hot code (4000 arrows: ~240k
   * calls/second). No allocations and preventable calculations
   * here.
   */
  update(dt) {
    const x = this.position.x;
    const y = this.position.y;
    const z = this.position.z;

    // Lorenz attractor equations
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    this.position.set(x + dx, y + dy, z + dz);

    // update rotation from direction of velocity
    v3.set(dx, dy, dz).normalize();
    this.rotation.setFromUnitVectors(ARROW_FORWARD, v3);
    
    // write updated values into attribute-buffers
    this.position.toArray(
        this.buffers.position, this.offsets.position);
    this.rotation.toArray(
        this.buffers.rotation, this.offsets.rotation);
  }
}


/**
 * Creates the arrow-geometry.
 * @return {THREE.BufferGeometry}
 */
function getArrowGeometry() {
  const shape = new THREE.Shape([
    [-0.8, -1], [-0.03, 1], [-0.01, 1.017], [0.0, 1.0185],
    [0.01, 1.017], [0.03, 1], [0.8, -1], [0, -0.5]
  ].map(p => new THREE.Vector2(...p)));

  const arrowGeometry = new THREE.ExtrudeGeometry(shape, {
    amount: 0.3,
    bevelEnabled: true,
    bevelSize: 0.05, 
    bevelThickness: 0.03, 
    bevelSegments: 2
  });

  // orient the geometry into x/z-plane, roughly centered
  const matrix = new THREE.Matrix4()
      .makeRotationX(Math.PI / 2)
      .setPosition(new THREE.Vector3(0, 0.15, 0));

  arrowGeometry.applyMatrix(matrix);

  // convert to buffer-geometry
  return new THREE.BufferGeometry().fromGeometry(arrowGeometry);
}


/**
 * The material required to render the instanced geometry. We are 
 * using a raw shader material so we don't have to deal with possible 
 * naming-conflics and so on.
 */
const material = new THREE.RawShaderMaterial({
  uniforms: {},
  vertexShader: `
    precision highp float;
    // uniforms (all provided by default by three.js)
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    
    // default attributes (from arrow-geometry)
    attribute vec3 position;
    attribute vec3 normal;

    // instance attributes
    attribute vec3 iOffset;
    attribute vec4 iRotation;
    attribute vec4 iColor;
    
    // shading-parameters
    varying vec3 vLighting;
    varying vec4 vColor;

    // apply a rotation-quaternion to the given vector 
    // (source: https://goo.gl/Cq3FU0)
    vec3 rotate(const vec3 v, const vec4 q) {
      vec3 t = 2.0 * cross(q.xyz, v);
      return v + q.w * t + cross(q.xyz, t);
    }

    void main() {
      // compute lighting (source: https://goo.gl/oS2vIY)
      vec3 ambientColor = vec3(1.0) * 0.7;
      vec3 directionalColor = vec3(1.0) * 0.9;
      vec3 lightDirection = normalize(vec3(-0.5, 1.0, 1.5));

      // diffuse-shading
      vec3 n = rotate(normalMatrix * normal, iRotation);
      vLighting = ambientColor + 
          (directionalColor * max(dot(n, lightDirection), 0.0));

      vColor = iColor;

      // instance-transform, mesh-transform and projection
      gl_Position = projectionMatrix * modelViewMatrix * 
          vec4(iOffset + rotate(position, iRotation), 1.0);
    }
  `,
  
  fragmentShader: `
    precision highp float;
    varying vec3 vLighting;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor * vec4(vLighting, 1.0);
      gl_FragColor.a = 1.0;
    }
  `,

  side: THREE.DoubleSide,
  transparent: false
});


/**
 * Random numbers, with range and optional bias.
 */
function rnd(min = 1, max = 0, pow = 1) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }

  const rnd = (pow === 1) ?
      Math.random() :
      Math.pow(Math.random(), pow);

  return (max - min) * rnd + min;
}


// ---- bootstrapping-code
//
// so here's the boring part, the three.js initialization

const width = window.innerWidth;
const height = window.innerHeight;

// create renderer-instance, scene, camera and controls
// .... renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true, 
  antialias: true
});
renderer.setSize(width, height);
renderer.setClearColor(0x000000);
if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
  console.error('ANGLE_instanced_arrays not supported');
}


// .... scene
const scene = new THREE.Scene();

// .... camera and controls
const camera = new THREE.PerspectiveCamera(
    60, width / height, 0.1, 1000);
const controls = new THREE.OrbitControls(camera);

camera.position.set(-0, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// .... run demo-code
// initialize simulation
const update = init(scene, camera);
requestAnimationFrame(function loop(time) {
  controls.update();

  // update simulation
  update(performance.now());
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
});

// .... bind events
window.addEventListener('resize', ev => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

document.body.appendChild(renderer.domElement);
