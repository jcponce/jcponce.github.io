varying vec4 vWPosition;

void main() {
  vec3 pos = position;
  vec4 wPosition = modelMatrix * vec4(pos,1.0);

  vWPosition = wPosition;

  gl_Position = projectionMatrix * viewMatrix * wPosition;
}