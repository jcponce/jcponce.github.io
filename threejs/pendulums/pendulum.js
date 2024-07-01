import * as THREE from 'three';

// Assuming these paths are correct relative to your project structure
import marbleTextureColorPath from './public/marble_color.jpg';
import marbleTextureRoughnessPath from './public/marble_roughness.jpg';

function createStringMesh(scene) {
  const geometry = new THREE.CylinderGeometry(0.001, 0.001, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0, metalness: 0.2 });
  const string = new THREE.Mesh(geometry, material);
  scene.add(string);
  return string;
}

async function createBallMesh(scene) {
  const loader = new THREE.TextureLoader();

  // Load marble textures asynchronously
  const marbleTextureColor = await new Promise((resolve, reject) => {
    loader.load(marbleTextureColorPath, resolve, undefined, reject);
  });

  const marbleTextureRoughness = await new Promise((resolve, reject) => {
    loader.load(marbleTextureRoughnessPath, resolve, undefined, reject);
  });

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

export async function createPendulum(scene, origin, frequency = 1, amplitude = 0.5) {
  const stringMesh = createStringMesh(scene);
  stringMesh.position.add(origin);
  stringMesh.translateY(6);
  stringMesh.geometry.translate(0, -4, 0);

  const ballMesh = await createBallMesh(scene);
  ballMesh.position.add(origin);
  ballMesh.translateY(6);
  ballMesh.geometry.translate(0, -8.5, 0);

  const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
  return pendulum;
}
