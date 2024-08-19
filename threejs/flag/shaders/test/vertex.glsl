uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float sqrtX = 0.5 * modelPosition.x * uFrequency.x*modelPosition.x * uFrequency.x;
    float sqrtY = 0.5 * modelPosition.y * uFrequency.y*modelPosition.y * uFrequency.y;

    float elevation = sin(sqrtX + sqrtY - uTime * 2.5) * 0.03;
    elevation += sin(sqrtX + sqrtY - uTime * 2.5) * 0.03;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = elevation;
}