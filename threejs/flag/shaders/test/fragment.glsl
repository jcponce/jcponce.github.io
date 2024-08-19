uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

//varying float vRandom;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    
    textureColor.rgb *= vElevation * 2.0 + .65;
    gl_FragColor = textureColor;
    //gl_FragColor = vec4(vUv, vRandom, 1.0);
}