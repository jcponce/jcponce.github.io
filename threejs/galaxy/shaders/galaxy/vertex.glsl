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

float myPoly(float u) {
    float v = 0.0002248964217 * pow(u, 4.0) 
              - 0.0054089716545 * pow(u, 3.0)
              - 0.0545497636448 * pow(u, 2.0)
              + 2.45554124608158 * pow(u, 1.0);
    return v;
}

float animationSpeed(float u) {
    float v;
    if(0.0 <= u && u < 20.0){
        v = myPoly(u);
    } else{
        v = u;
    }
    return v;
}


void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * animationSpeed(uTime);
    angle +=angleOffset;
    modelPosition.x = cos(angle)* distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Size
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = color;

}