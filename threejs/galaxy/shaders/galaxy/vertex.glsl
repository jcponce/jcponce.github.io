uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandomness;


varying vec3 vColor;

float myPoly(float u) {
    float v = + 0.0019462767 * pow(u, 3.0) 
              - 0.1296830403 * pow(u, 2.0)
              + 3.0256530414 * pow(u, 1.0);
    return v;
}

float animationSpeed(float u) {
    float v;
    if(0.0 <= u && u < 25.0){
        v = myPoly(u);
    } else{
        v = u * 0.2 + 20.0;
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