// Original shader by
// Thomas Hooper https://twitter.com/tdhooper
// 08-Aug-2022
// Link: https://www.shadertoy.com/view/NtcyRB
// This version by Juan Carlos Ponce Campuzano
// 05-Sep-2022

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform float iTime;
uniform float iParam;

uniform bool iView;
//*******************//

varying vec2 vTexCoord;

#define PI 3.14159265359

// HG_SDF
void pR(inout vec2 p, float a) {
    p = cos(a) * p + sin(a) * vec2(p.y, -p.x);
}


float smin(float a, float b, float k){
    float f = clamp(0.5 + 0.5 * ((a - b) / k), 0., 1.);
    return (1. - f) * a + f  * b - f * (1. - f) * k;
}

struct Model {
    float d;
    vec3 col;
};

Model map(vec3 p) {
    
    vec3 col = normalize(p) * .5 + .5;
    p -= vec3(6,-2,4);
    float d = length(p) -16.;
    p += vec3(1.2,-.8,.8) * 12.; // Medium sphere
    d = smin(d, length(p) - 9., 4.);
    p += vec3(1.8,.4,.6) * 5.; // Small sphere
    d = smin(d, length(p) - 4., 3.);
    col = vec3(0.11, 0.51, .99);
    return Model(d, col);
}

// In absence of bitwise operators in WebGL 1.0, 
// I used these methods as substitute
// by Elu Davis https://github.com/EliCDavis
// Source code: 
// https://gist.github.com/EliCDavis/f35a9e4afb8e1c9ae94cce8f3c2c9b9a

int RShift(int num, float shifts){
    return int(floor(float(num) / pow(2.0, shifts)));
}

int AND(int n1, int n2){
    
    float v1 = float(n1);
    float v2 = float(n2);
    
    int byteVal = 1;
    int result = 0;
    
    for(int i = 0; i < 32; i++){
        bool keepGoing = v1 > 0.0 || v2 > 0.0;
        if(keepGoing){
            
            bool addOn = mod(v1, 2.0) > 0.0 && mod(v2, 2.0) > 0.0;
            
            if(addOn){
                result += byteVal;
            }
            
            v1 = floor(v1 / 2.0);
            v2 = floor(v2 / 2.0);
            byteVal *= 2;
        } else {
            return result;
        }
    }
    return result;
}
//**************************//

// compile speed optim from IQ https://www.shadertoy.com/view/Xds3zN
vec3 calcNormal(vec3 pos){
    vec3 n = vec3(0.0);
    for( int i=0; i<4; i++ )
    {
        vec3 e = 0.5773*(2.0*vec3( AND( RShift((i+3), 1.0), 1 ) ,
                                  AND(RShift(i, 1.0), 1),
                                  AND(i, 1) )-1.0
                        );
        n += e*map(pos+0.0005*e).d;
    }
    return normalize(n);
}

mat3 calcLookAtMatrix(vec3 ro, vec3 ta, vec3 up) {
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww,up));
    vec3 vv = normalize(cross(uu,ww));
    return mat3(uu, vv, ww);
}


void main() {
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;

    // vec2 uv = ( fragCoord -.5* iResolution.xy ) / iResolution.y;

    float u = coord.x * 2.0 - 1.0;
    float v = coord.y * 2.0 - 1.0;
    const float scale = 1.5;

    // Make sure pixels are square
    u = u * scale * iResolution.x / iResolution.y;
    v = v * scale;
  
    float smoothness = iParam;
    //float smoothness = sin(u_time * .15 - PI * .5) * .5 + .5; // This creates the animation
    float voxelSize = mix(5., .2, smoothness);
  
    vec2 p = vec2(u, v);
  
    vec3 camPos = vec3(0,0,64);
  
    vec2 im = vec2(.6,.2);//iMouse.xy / iResolution.xy;
  
    //if (iView == false || iMouse.y < -0.745)
    //{
    //im = vec2(.6,.2);
    //}

    pR(camPos.yz, (0.5 - im.y) * PI / 2.5);
    pR(camPos.xz, (0.5 - sin(iTime * .08 - PI * .5) * .5 + .5) * PI * 2.5);
    //pR(camPos.xz, (.5 - im.x) * PI * 2.5); // Maybe :)


    mat3 camMat = calcLookAtMatrix(camPos, vec3(0), vec3(0,1,0));

    camPos = camPos;

    float focalLength = 3.;
    vec3 rayDirection = normalize(camMat * vec3(p.xy, focalLength));
    
    vec3 rayPosition = camPos;
    float rayLength = 0.;
    Model model;
    float dist = 0.;
    bool bg = true;
    vec3 bgcol = vec3(0.99); //.08, 0.21, 0.96
    vec3 col = bgcol;
    bool hitVoxel = false;
    vec3 voxelPosition;
    vec3 closestPosition;
    float closestDist = 1e12;

    // Get close to surface
    for (int i = 0; i < 100; i++) {
        rayLength += dist;
        rayPosition = camPos + rayDirection * rayLength;
        model = map(rayPosition);
        dist = model.d;
        
        if (dist < closestDist) {
            closestPosition = rayPosition;
            closestDist = dist;
        }

        if (!hitVoxel && abs(dist) < voxelSize) {
            bg = false;
            voxelPosition = rayPosition;
            hitVoxel = true;
        }
        
        if (rayLength > 100.) {
            break;
        }
    }
    
    vec3 side, mask;
    
    // Intersect with voxel
    // Shane https://shadertoy.com/view/MdVSDh
    if (!bg)
    {
        bg = true;

        vec3 rayOrigin = voxelPosition - rayDirection * voxelSize;
        //rayOrigin = camPos;
        voxelPosition = (floor(rayOrigin / voxelSize) + .5) * voxelSize;
    
    	vec3 dRd = 1. / abs(rayDirection); // 1./max(abs(rd), vec3(.0001));
        vec3 voxelDirection = sign(rayDirection);
        side = dRd * (voxelDirection * (voxelPosition - rayOrigin) + .5 * voxelSize);

        mask = vec3(0);

        for (int i = 0; i < 100; i++) {

            model = map(voxelPosition);

            if (model.d < 0.) {
                bg = false;
                break;
            }
            
            mask = step(side, side.yzx)*(1. - step(side.zxy, side));
            side += mask * dRd * voxelSize;
            voxelPosition += mask * voxelDirection * voxelSize;
        }
    }
        
    if (!bg) {
    
    	vec3 tCube = (voxelPosition - camPos - .5 * sign(rayDirection) * voxelSize) / rayDirection;
        float t = max(max(tCube.x, tCube.y), tCube.z);
	    vec3 surfacePosition = camPos + rayDirection * t;

        col = model.col;
        //col = surfacePosition / 10.; // Adds color to the solid
        vec3 snor = calcNormal(surfacePosition);
        vec3 nor = calcNormal(closestPosition);
        vec3 vnor = -(mask * sign(rayDirection));
                
        float blendSmooth = smoothstep(.8, 1., smoothness);
        nor = mix(snor, nor, blendSmooth);
        
        vec3 lp = normalize(vec3(0,2,-1));
        col *= mix(clamp(dot(lp, vnor) * .8 + .6, 0., 1.), .5, blendSmooth);
        col *= clamp(dot(lp, nor) * .5 + .5, 0., 1.);
        col *= sqrt(clamp(.5 + .5 * nor.y, 0., 1.));
        float fog = 1. - exp((rayLength - 6.) * -.5);
    }
  
    col = pow(col, vec3(1.0/2.2));

  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col, 1.0);
}