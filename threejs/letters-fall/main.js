/**
 * Author: Paul
 * Source: https://codepen.io/prisoner849/pen/vYMvpXX
 */

import * as THREE from "three";
import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";
import * as TWEEN from "three/addons/libs/tween.module.js";
import {
  SimplexNoise
} from "three/addons/math/SimplexNoise.js";

let simplex = new SimplexNoise();

class TextTerrain extends THREE.Object3D {
  constructor(anisotropy) {
    super();
    // atlas
    let alphabet = [..."⨉∈-+∞∞≅≆∩∪∫∬∭∮∯⊂⊃⊄⊅⊆⊇⊈⊉⨀⨁⨂0123456789𝛂𝛃𝛄𝛅𝛆𝛇𝛈𝛉𝛊𝛋𝛌𝛍𝛎𝛏𝛑𝛒𝛓𝛔𝛕𝛖𝛗𝛘𝛙𝛚𝛛𝛜𝛝𝛞𝛟ℕℤ𝕀ℚℝℂ∀∂∃∄∅∆∇⇒⇔xyz𝚺𝚷"];
    let textTexture = (() => {
      let c = document.createElement("canvas");
      let ctx = c.getContext("2d");
      let texSize = 2048;
      c.width = texSize;
      c.height = texSize;
      ctx.clearRect(0, 0, texSize, texSize);
      let dim = 8;
      let dimStep = texSize / dim;
      for (let i = 0; i < alphabet.length; i++) {
        let tileX = i % 8;
        let tileY = Math.floor(i / 8);
        let x = (tileX + 0.5) * dimStep;
        let y = texSize - (tileY + 0.5) * dimStep;
        ctx.fillStyle = `rgba(250, 250, 250, 1)`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${dimStep * 0.9}px Arial`;
        ctx.fillText(alphabet[i], x, y);
      }
      let tex = new THREE.CanvasTexture(c);
      tex.colorSpace = "srgb";
      tex.anisotropy = anisotropy;
      return tex;
    })(); // atlas

    let tileDim = 200;

    let g = new THREE.PlaneGeometry();
    g.setAttribute("letterIdx", new THREE.InstancedBufferAttribute(new Float32Array(Array.from({
      length: tileDim * tileDim
    }, () => {
      return THREE.MathUtils.randInt(0, alphabet.length - 1)
    })), 1));
    
    let m = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      alphaTest: 0.01,
      side: THREE.DoubleSide,
      //forceSinglePass: true,
      onBeforeCompile: shader => {
        shader.vertexShader = `
        	attribute float letterIdx;
          varying float vLetterIdx;
        	${shader.vertexShader}
        `.replace(
          `#include <uv_vertex>`,
          `#include <uv_vertex>
          vLetterIdx = letterIdx;
          `
        );
        //console.log(shader.vertexShader);

        shader.fragmentShader = `
        	varying float vLetterIdx;
          ${shader.fragmentShader}
        `.replace(
          `#include <map_fragment>`,
          `
          float letterIdx = floor(vLetterIdx + 0.1);
          float tileStep = 1. / 8.;
          float u = mod(letterIdx, 8.);
          float v = floor(letterIdx / 8.);
          vec2 iUv = (vec2(u, v) + vMapUv) * tileStep;
          vec4 sampledDiffuseColor = texture2D( map, iUv );
					diffuseColor *= sampledDiffuseColor;
          `
        );
        //console.log(shader.fragmentShader);
      }
    });
    let io = new THREE.InstancedMesh(g, m, tileDim * tileDim);
    this.instancedMesh = io;

    this.dummy = new THREE.Object3D();

    this.finals = [];

    let tri = new THREE.Triangle();
    let n = new THREE.Vector3();
    let la = new THREE.Vector3();

    function getY(x, z) {
      return simplex.noise(x * 0.01, z * 0.01) * 7.5;
    }

    let setFinals = () => {
      let y0 = getY(this.dummy.position.x, this.dummy.position.z);
      let y1 = getY(this.dummy.position.x, this.dummy.position.z - 1);
      let y2 = getY(this.dummy.position.x + 1, this.dummy.position.z);
      this.dummy.position.y = y0;

      tri.a.set(this.dummy.position.x, y1, this.dummy.position.z - 1);
      tri.b.set(this.dummy.position.x, y0, this.dummy.position.z);
      tri.c.set(this.dummy.position.x + 1, y2, this.dummy.position.z);
      tri.getNormal(n);

      la.copy(this.dummy.position).add(n);
      this.dummy.lookAt(la);
      this.dummy.rotation.z = 0; // align along Z-axis of the terrain
      this.dummy.updateMatrix();

      this.finals.push({
        y: y0,
        pos: this.dummy.position.clone(),
        rot: this.dummy.rotation.clone(),
        dummy: new THREE.Object3D(),
        inAction: false,
        mediators: {
          v: new THREE.Vector3(),
          v2: new THREE.Vector3()
        }
      })
    }
    
    // make it grid
    for (let z = 0; z < tileDim; z++) {
      for (let x = 0; x < tileDim; x++) {
        this.dummy.position.x = -(tileDim - 1) * 0.5 + x;
        this.dummy.position.z = -(tileDim - 1) * 0.5 + z;
        setFinals(this.dummy.position);
        this.instancedMesh.setMatrixAt(z * tileDim + x, this.dummy.matrix);
      }
    } // make it grid

    this.add(io);
    
    // actions section
    this.actions = Array.from({
      length: 5000
    }, () => {
      let action = (delay) => {
				//console.log("action started");
        let getFreeLetterIndex = () => {
          let letterIndex = Math.floor(Math.random() * this.finals.length);;
          if (!this.finals[letterIndex].inAction) {
            return letterIndex;
          } else {
            return getFreeLetterIndex();
          }
        }

        let freeLetterIndex = getFreeLetterIndex();
        let freeLetter = this.finals[freeLetterIndex];
        let height = 30;
        let m = freeLetter.mediators;
        let v = m.v;
        let v2 = m.v2;

        v2.random().multiplyScalar(0.5).addScalar(0.5).multiplyScalar(Math.PI * 3 * Math.sign(Math.random() - 0.5));

        let tween = new TWEEN.Tween({
            val: 0
          }).to({
            val: 1
          }, 10000)
          .delay(delay)
          .onStart(() => {freeLetter.inAction = true;})
          .onUpdate(val => {
            v.lerpVectors(v2, freeLetter.rot, val.val);
            freeLetter.dummy.rotation.set(v.x, v.y, v.z);
            freeLetter.dummy.position.copy(freeLetter.pos);
            freeLetter.dummy.position.y = THREE.MathUtils.lerp(height, freeLetter.y, val.val);
            freeLetter.dummy.updateMatrix();
            io.setMatrixAt(freeLetterIndex, freeLetter.dummy.matrix);
          })
          .onComplete(() => {
          	freeLetter.inAction = false;
            action(Math.random() * 10000);
          });
          tween.start();
      }
      return action;
    }) // actions section
    
    //console.log(this.actions)


  }
}

let scene = new THREE.Scene();
scene.fog = new THREE.Fog("#000", 100, 150);
scene.background = new THREE.Color("#000");
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 500);
camera.position.set(0, 3, 8).setLength(50);
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//scene.add(new THREE.GridHelper());

let textTerrain = new TextTerrain(renderer.capabilities.getMaxAnisotropy());
scene.add(textTerrain);
textTerrain.actions.forEach(action => {
  action((Math.random() * 0.9 + 0.1) * 10000);
}); // start the actions

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  TWEEN.update();
  controls.update();
  textTerrain.instancedMesh.instanceMatrix.needsUpdate = true;
  renderer.render(scene, camera);
})