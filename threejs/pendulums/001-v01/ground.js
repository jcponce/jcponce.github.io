import * as THREE from 'three';

/*const textureColorPath = './public/paving_color.jpg';
const textureRoughnessPath = './public/paving_roughness.jpg';
const textureNormalPath = './public/paving_normal.jpg';
const textureAmbientOcclusionPath = './public/paving_ambient_occlusion.jpg';
*/

function loadTexture(loader, url) {
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

export function createGround() {
  const loader = new THREE.TextureLoader();

  // Construct full URLs assuming they are served from the same base URL as the script
  const baseTextureUrl = window.location.origin + window.location.pathname + 'public/';
  const textureColorUrl = baseTextureUrl + 'paving_color.jpg';
  const textureRoughnessUrl = baseTextureUrl + 'paving_roughness.jpg';
  const textureNormalUrl = baseTextureUrl + 'paving_normal.jpg';
  const textureAmbientOcclusionUrl = baseTextureUrl + 'paving_ambient_occlusion.jpg';

  // Load all textures concurrently
  const textureColorPromise = loadTexture(loader, textureColorUrl);
  const textureRoughnessPromise = loadTexture(loader, textureRoughnessUrl);
  const textureNormalPromise = loadTexture(loader, textureNormalUrl);
  const textureAmbientOcclusionPromise = loadTexture(loader, textureAmbientOcclusionUrl);

  return Promise.all([
    textureColorPromise,
    textureRoughnessPromise,
    textureNormalPromise,
    textureAmbientOcclusionPromise
  ]).then(([textureColor, textureRoughness, textureNormal, textureAmbientOcclusion]) => {
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
  }).catch(error => {
    console.error('Failed to load textures:', error);
    throw error; // Propagate the error further if needed
  });
}
