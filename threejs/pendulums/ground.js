import * as THREE from 'three';

function loadTexture(loader, url) {
  const texture = loader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 10);
  return texture;
}

function createGround() {
  const loader = new THREE.TextureLoader();

  const textureColor = loadTexture(loader, './public/paving_color.jpg');
  const textureRoughness = loadTexture(loader, './public/paving_roughness.jpg');
  const textureNormal = loadTexture(loader, './public/paving_normal.jpg');
  const textureAmbientOcclusion = loadTexture(loader, './public/paving_ambient_occlusion.jpg');

  const planeGeometry = new THREE.PlaneGeometry(1000, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: textureColor,
    normalMap: textureNormal,
    normalScale: new THREE.Vector2(2, 2),
    roughness: 1,
    roughnessMap: textureRoughness,
    aoMap: textureAmbientOcclusion,
    aoMapIntensity: 1,
  });
  const mesh = new THREE.Mesh(planeGeometry, planeMaterial);

  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -5;

  return mesh;
}

export default createGround;