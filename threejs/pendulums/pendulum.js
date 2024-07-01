import * as THREE from 'three';

function createStringMesh(scene) {
  const geometry = new THREE.CylinderGeometry(0.005, 0.005, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0, metalness: 0.2 });
  const string = new THREE.Mesh(geometry, material);
  scene.add(string);
  return string;
}

function createBallMesh(scene) {
  const loader = new THREE.TextureLoader();

  const marbleTextureColor = loader.load('./matcaps/6.png');
  const marbleTextureRoughness = loader.load('./public/marble_roughness.jpg');

  const geometry = new THREE.SphereGeometry(0.5);
  //const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
  const material = new THREE.MeshMatcapMaterial({
    //map: marbleTextureColor,
    matcap: marbleTextureColor,
    //roughness: 1,
    //roughnessMap: marbleTextureRoughness,
    //metalness: 0.1,
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
    this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime) / 1000);
    this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime) / 1000);
  }
}

function createPendulum(
  scene,
  origin,
  frequency = 1,
  amplitude = 0.5
) {
  const stringMesh = createStringMesh(scene);
  stringMesh.position.add(origin);
  stringMesh.translateY(6);
  stringMesh.geometry.translate(0, -4, 0);

  const ballMesh = createBallMesh(scene);
  ballMesh.position.add(origin);
  ballMesh.translateY(6);
  ballMesh.geometry.translate(0, -8.5, 0);

  const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);
  return pendulum;
}

export default createPendulum;