uniform float uTime;
uniform float uSize;

uniform float uSigma;
uniform float uRho;
uniform float uBeta;

attribute float aScale;
attribute vec3 aRandomness;


varying vec3 vColor;

vec3 thomas(vec3 position, float dt) {
    float speed = 400.0;
    float dx = (sin(position.y) -  0.208186 * position.x) * speed;
    float dy = (sin(position.z) -  0.208186 * position.y) * speed;
    float dz = (sin(position.x) -  0.208186 * position.z) * speed;
    
    position.x += dx * dt;
    position.y += dy * dt;
    position.z += dz * dt;

    return position;
}


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.1;
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

    // Apply the Lorenz system
    // float dt = 1.01 * uTime; // Scale time for better control
    // vec3 newPosition = thomas(modelPosition.xyz, dt);
    // modelPosition = vec4(newPosition, 1.0);

    // Apply the Thomas attractor directly to the initial position
    // vec3 newPosition = position;

    // Time factor for attractor dynamics
    // float totalTime = uTime * 0.0001; // Adjust this to control speed
    // for (int i = 0; i < 100; i++) {  // Increase the iteration count for smoother paths
    //     newPosition = thomas(newPosition, totalTime);
    // }

     // Damping to prevent expansion
    //float damping = 0.79; // Damping factor (less than 1 to reduce expansion)
    //newPosition *= damping;

    
    //vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Size
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = color;

}