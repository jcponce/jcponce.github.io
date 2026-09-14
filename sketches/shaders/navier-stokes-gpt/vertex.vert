// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

// Vertex attributes
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Pass-through to the fragment shader
varying vec2 vTexCoord;

void main() {
    // Pass texture coordinates to the fragment shader
    vTexCoord = aTexCoord;

    // Transform the position into normalized device coordinates (NDC)
    vec4 positionVec4 = vec4(aPosition, 1.0);

    // Scale and shift to NDC (Normalize Device Coordinate) range [-1, 1]
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

    // Set the final position of the vertex
    gl_Position = positionVec4;
}
