import * as THREE from 'three';

import textureColorPath from './public/paving_color.jpg';
import textureRoughnessPath from './public/paving_roughness.jpg';
import textureNormalPath from './public/paving_normal.jpg';
import textureAmbientOcclusionPath from './public/paving_ambient_occlusion.jpg';

async function loadTexture(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 10);
        resolve(texture);
      },
      undefined,
      (error) => {
        reject(new Error('Failed to load texture: ' + url));
      }
    );
  });
}

export async function createGround() {
  const loader = new THREE.TextureLoader();

  const textureColor = await loadTexture(loader, textureColorPath);
  const textureRoughness = await loadTexture(loader, textureRoughnessPath);
  const textureNormal = await loadTexture(loader, textureNormalPath);
  const textureAmbientOcclusion = await loadTexture(loader, textureAmbientOcclusionPath);

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
