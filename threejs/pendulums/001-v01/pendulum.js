import * as THREE from 'three';

function createStringMesh(scene) {
  const geometry = new THREE.CylinderGeometry(0.001, 0.001, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0, metalness: 0.2 });
  const string = new THREE.Mesh(geometry, material);
  scene.add(string);
  return string;
}

function loadTexture(loader, texturePath) {
  return new Promise((resolve, reject) => {
    loader.load(texturePath, resolve, undefined, reject);
  });
}

function createBallMesh(scene, marbleTextureColor, marbleTextureRoughness) {
  const geometry = new THREE.SphereGeometry(0.5);
  const material = new THREE.MeshStandardMaterial({
    map: marbleTextureColor,
    roughness: 1,
    roughnessMap: marbleTextureRoughness,
    metalness: 0.2,
  });
  const ball = new THREE.Mesh(geometry, material);
  ball.castShadow = true;
  scene.add(ball);
  return ball;
}

export class Pendulum {
  constructor(stringMesh, ballMesh, frequency, amplitude) {
    this.string = stringMesh;
    this.ball = ballMesh;
    this.frequency = frequency;
    this.amplitude = amplitude;
  }

  update(totalTime) {
    // Update pendulum rotation based on frequency and amplitude
    this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime) / 1000);
    this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime) / 1000);
  }
}

export function createPendulum(scene, origin, frequency = 1, amplitude = 0.5) {
  const stringMesh = createStringMesh(scene);
  stringMesh.position.add(origin);
  stringMesh.translateY(6);
  stringMesh.geometry.translate(0, -4, 0);

  const loader = new THREE.TextureLoader();

  // Adjust these paths according to your project structure
  const marbleTextureColorPath = './public/marble_color.jpg';
  const marbleTextureRoughnessPath = './public/marble_roughness.jpg';

  // Load all textures concurrently
  const marbleTextureColorPromise = loadTexture(loader, marbleTextureColorPath);
  const marbleTextureRoughnessPromise = loadTexture(loader, marbleTextureRoughnessPath);

  return Promise.all([marbleTextureColorPromise, marbleTextureRoughnessPromise])
    .then(([marbleTextureColor, marbleTextureRoughness]) => {
      const ballMesh = createBallMesh(scene, marbleTextureColor, marbleTextureRoughness);
      ballMesh.position.add(origin);
      ballMesh.translateY(6);
      ballMesh.geometry.translate(0, -8.5, 0);

      const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
      return pendulum;
    })
    .catch(error => {
      console.error('Error loading textures:', error);
      throw error; // Propagate the error further if needed
    });
}
