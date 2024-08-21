uniform float uTime;
uniform float uSize;

uniform float uSigma;
uniform float uRho;
uniform float uBeta;

attribute float aScale;
attribute vec3 aRandomness;


varying vec3 vColor;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.5;
    angle +=angleOffset;
    modelPosition.x = cos(angle)* distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    //  // Lorenz system
    // vec3 pos = modelPosition.xyz;  // Introduce some initial randomness
    // float dt = 0.01 * uTime;  // Small time step scaled by uTime

    // for (int i = 0; i < 10; i++) {  // Accumulate the motion over multiple small steps
    //     float dx = uSigma * (pos.y - pos.x);
    //     float dy = pos.x * (uRho - pos.z) - pos.y;
    //     float dz = pos.x * pos.y - uBeta * pos.z;

    //     pos.x += dx * dt;
    //     pos.y += dy * dt;
    //     pos.z += dz * dt;
    // }

    // modelPosition.xyz = pos;
    

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Size
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = color;

}