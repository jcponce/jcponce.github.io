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

  /*
  const textureColor = loadTexture(loader, './public/paving_color.jpg');
  const textureRoughness = loadTexture(loader, './public/paving_roughness.jpg');
  const textureNormal = loadTexture(loader, './public/paving_normal.jpg');
  const textureAmbientOcclusion = loadTexture(loader, './public/paving_ambient_occlusion.jpg');
  */
  ///*
  //https://3dtextures.me/2024/06/22/wood-wicker-011/
  const textureColor = loadTexture(loader, './textures/Wood_Wicker_011_basecolor.png');
  const textureRoughness = loadTexture(loader, './textures/Wood_Wicker_011_roughness.png');
  const textureNormal = loadTexture(loader, './textures/Wood_Wicker_011_normal.png');
  //*/

  const planeGeometry = new THREE.PlaneGeometry(1000, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: textureColor,
    normalMap: textureNormal,
    normalScale: new THREE.Vector2(3, 3),
    roughness: 1,
    roughnessMap: textureRoughness,
    //alphaMap: textureOpacity,
    //aoMap: textureAmbientOcclusion,
    //aoMapIntensity: 0,
  });
  const mesh = new THREE.Mesh(planeGeometry, planeMaterial);

  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -5;

  return mesh;
}

export default createGround;