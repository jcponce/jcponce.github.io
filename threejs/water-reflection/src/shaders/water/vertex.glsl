#include ../noise.glsl;

uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;

varying vec4 vWPosition;
varying vec3 vNormal;

float getElevation(vec3 pos) {
  float e = cnoise(pos.xyz * uFrequency + uTime * 0.85) * uAmplitude;
  e += cnoise(pos.xyz * uFrequency * 4. + uTime * 2.) * uAmplitude * 0.2;
  return e;
}

void main() {
  vec3 pos = position;
  vec4 wPosition = modelMatrix * vec4(pos,1.0);
  float e = 0.1;
  vec3 wPositionX = wPosition.xyz + vec3(e,0.,0.);
  vec3 wPositionZ = wPosition.xyz + vec3(0.,0.,e);

  wPosition.y += getElevation(wPosition.xyz);
  wPositionX.y += getElevation(wPositionX.xyz);
  wPositionZ.y += getElevation(wPositionZ.xyz);
  vNormal = normalize(cross(wPositionX.xyz - wPosition.xyz, wPositionZ.xyz - wPosition.xyz));

  vWPosition = wPosition;

  gl_Position = projectionMatrix * viewMatrix * wPosition;
}