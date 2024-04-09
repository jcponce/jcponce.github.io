/*
 
"RayMarching starting point" 
by Martijn Steinrucken aka The Art of Code/BigWings - 2020
The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions: The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software. 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.

Email: countfrolic@gmail.com
Twitter: @The_ArtOfCode
YouTube: youtube.com/TheArtOfCodeIsCool
Facebook: https://www.facebook.com/groups/theartofcode/

You can use this shader as a template for ray marching shaders

Title: Koch 3d spherical
Tutorial: https://youtu.be/__dSLc7-Cpo
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 21/Dec/2023

*/


// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif


// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform sampler2D iTexture01;

varying vec2 vTexCoord;

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define TAU 6.283185
#define PI 3.141592
#define S smoothstep
#define T iTime

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float sdBox(vec3 p, vec3 s) {
    p = abs(p)-s;
	return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}

vec2 N(float angle) {
  // Angle to vector
    return vec2(sin(angle), cos(angle));
}

vec2 Koch(vec2 uv) {
  
  uv.x = abs(uv.x);
    
    vec3 col = vec3(0);
    float d;
    
    float angle = 0.;
    vec2 n = N((5./6.)*3.1415);
    
    uv.y += tan((5./6.)*3.1415)*.5;
   	d = dot(uv-vec2(.5, 0), n);
    uv -= max(0.,d)*n*2.;
    
    float scale = 1.;
    
    n = N((2./3.)*3.1415);
    uv.x += .5;
    for(int i=0; i<10; i++) {
        uv *= 3.;
        scale *= 3.;
        uv.x -= 1.5;
        
        uv.x = abs(uv.x);
        uv.x -= .5;
        d = dot(uv, n);
        uv -= min(0.,d)*n*2.;
    }
  
  uv/=scale;
  
  return uv;
  
}


float GetDist(vec3 p) {
    float d = sdBox(p, vec3(1));
  
  
  //p.xz *= Rot(iTime * 0.2);
  
    /*
    //straight intersection
    vec2 xy = Koch(p.xy);
    vec2 yz = Koch(p.yz);
    vec2 xz = Koch(p.xz); 
    
    d = max(xy.y, max(yz.y, xz.y));
    
    */
  
  vec2 xy = Koch(vec2(length(p.xz), p.y));
  vec2 yz = Koch(vec2(length(p.yz), p.x));
  vec2 xz = Koch(vec2(length(p.xy), p.z));
  d = max(xy.y, max(yz.y, xz.y));
  
  d = mix(d, length(p)-0.5, 0.1);
  
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
    vec2 e = vec2(.001, 0);
    vec3 n = GetDist(p) - 
        vec3(GetDist(p-e.xyy), GetDist(p-e.yxy),GetDist(p-e.yyx));
    
    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 
        f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u;
    return normalize(i);
}


//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.198, 0.438, 0.698);
    vec3 b = vec3(-0.262, 0.208, 0.238);
    vec3 c = vec3(2.238, 2.168, 1.000);
    vec3 d = vec3(-0.052, 0.333, 0.667);

    return a + b * cos( 6.28318*(c * t + d) );
}




void main() {
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;
    vec2 uv = ( coord * 2.0 - 1.0 ) * iResolution.xy / iResolution.y;

    //vec2 uv0 = vec2(u, v);
  
    vec2 m = iMouse.xy/iResolution.xy;

    vec3 ro = vec3(0, 3, -3);
    ro.yz *= Rot(-m.y*PI+1.);
    ro.xz *= Rot(-m.x*TAU);
    
    vec3 rd = GetRayDir(uv, ro, vec3(0,0.,0), 5.0);
    vec3 col = vec3(0);
   
    float d = RayMarch(ro, rd);

    if(d<MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = GetNormal(p);
        vec3 r = reflect(rd, n);

        float dif = dot(n, normalize(vec3(1,2,3)))*.5+.5;
        col = vec3(dif);
      
        col = n * 0.5 + 0.5;
        vec4 tex = texture2D(iTexture01, r.yz);
        col *= tex.xyz;
    }
  
    //col *= 0.0;
  
   // vec2 st = Koch(uv) * 4.0;
    
    //col = vec3(st.y);
      
    col = pow(col, vec3(.4545));	// gamma correction
    
    
    //col =  palette(col.z  - iTime*.08); // Funny colors
      
  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col, 1.0);
}