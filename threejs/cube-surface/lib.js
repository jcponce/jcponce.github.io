import * as THREE from "three";
import { SubsurfaceScatteringShader } from "jsm/shaders/SubsurfaceScatteringShader.js";

function isOutOfBounds({ box, numCols, numRows }) {
  const b = box.userData;
  return b.col + b.size > numCols || b.row - b.size + 1 < 0 || b.row + b.size > numRows;
}
function areOverlapping(newBox, extantBox) {
  const nb = newBox.userData;
  const eb = extantBox.userData;
  let colsOverlap =
    (nb.col <= eb.col && nb.col + nb.size > eb.col) ||
    (eb.col <= nb.col &&
      eb.col + eb.size > nb.col);
  let rowsOverlap =
    (nb.row >= eb.row && nb.row - nb.size < eb.row) ||
    (eb.row >= nb.row &&
      eb.row - eb.size < nb.row);
  const areIndeedOverlapping = colsOverlap && rowsOverlap;
  return areIndeedOverlapping;
}

const texLoader = new THREE.TextureLoader();
const imgTexture = texLoader.load('./sss/white.jpg');
const defaultColor = new THREE.Color(0xFFFF00);
function getSSSMaterial(color = defaultColor) {
  const shader = SubsurfaceScatteringShader;
  const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  uniforms['map'].value = imgTexture;
  uniforms["diffuse"].value = new THREE.Vector3(0, 0, 0);
  uniforms["shininess"].value = 100;
  uniforms['thicknessMap'].value = imgTexture;
  let { r, g, b } = color;
  uniforms["thicknessColor"].value = new THREE.Vector3(r, g, b);
  uniforms["thicknessDistortion"].value = 0.1;
  uniforms["thicknessAmbient"].value = 0.1;
  uniforms["thicknessAttenuation"].value = 0.05;
  uniforms["thicknessPower"].value = 2.0;
  uniforms["thicknessScale"].value = 16.0;

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    lights: true,
  });
  material.extensions.derivatives = true;
  return material;
}

function getSunlight() {
  const sunlight = new THREE.DirectionalLight(0xFFFFFF, 50);
  sunlight.position.y = 30;
  sunlight.position.z = 10;
  sunlight.target.position.set(0, 0, -10);
  sunlight.shadow.camera.near = 1;
  sunlight.shadow.camera.far = 100;
  sunlight.shadow.camera.right = 20;
  sunlight.shadow.camera.left = -20;
  sunlight.shadow.camera.top = 20;
  sunlight.shadow.camera.bottom = -20;

  sunlight.castShadow = true;
  sunlight.shadow.mapSize.width = 4096;
  sunlight.shadow.mapSize.height = 4096;
  const dHelper = new THREE.DirectionalLightHelper(sunlight, 5);
  // scene.add(dHelper);
  return sunlight;
}

export { areOverlapping, getSSSMaterial, getSunlight, isOutOfBounds };