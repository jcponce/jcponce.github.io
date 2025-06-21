/*

"RayMarching" 

You can use this shader as a template for ray marching shaders

Based upon Kishimisy's video tutorials: https://youtu.be/khblXafu7iA

Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 06/Jan/2024

*/


// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif


// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
uniform bool iView;

//uniform sampler2D iTexture01;

varying vec2 vTexCoord;

// 2D rotation function
mat2 rot2D(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// Octahedron SDF - https://iquilezles.org/articles/distfunctions/
float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x+p.y+p.z-s)*0.57735027;
}

// Sphere
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

// Box
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

// Torus
float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

// Custom gradient - https://iquilezles.org/articles/palettes/
//vec3 palette(float t) {
//    return .5+.5*cos(6.28318*(t+vec3(.3,.416,.557)));
//}

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(2.0, 1.0, 0.0);
    vec3 d = vec3(0.50, 0.20, 0.25);

    return a + b*cos( 6.28318*(c*t+d) );
}


// Scene distance
float map(vec3 p) {
    p.z += iTime * 0.3;
  
    //Space repetition
	 	p.xy = (fract(p.xy) - 0.5); // spacing: 1
		p.z = mod(p.z, 0.25) - 0.125;
  
    return sdTorus(p, vec2(0.06, 0.02)); // distance to an object
}


void main() {
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;

    vec2 uv = ( coord * 2.0 - 1.0 ) * iResolution.xy / iResolution.y;
  
    vec3 ro = vec3(0.0, 0.0, -3.0); // ray origin
    vec3 rd = normalize(vec3(uv, 1.0)); // ray direction
    vec3 col = vec3(0.0); // final pixel color
    
    float t = 0.0; // total distance travelled
  
    // Updated thanks to Matthias Hurrle from this sketch
		// https://openprocessing.org/sketch/2679978
		float MN = min(iResolution.x,iResolution.y);
    // Horizontal camera rotation
    ro.yz *= rot2D(0.5-iMouse.y*6.3/MN);
    rd.yz *= rot2D(0.5-iMouse.y*6.3/MN);
  
    // Horizontal camera rotation
    ro.xz *= rot2D(-iMouse.x*6.3/MN);
    rd.xz *= rot2D(-iMouse.x*6.3/MN);
  
    // Raymarching
    for(int i = 0; i < 80; i++){
      vec3 p = ro + rd * t; // position aling the ray
			
			p.xy *= rot2D(t*0.05);  // rotate ray around z-axis
			
			p.y += sin(t*0.5)*0.35; // wiggle ray
  
      float d = map(p);  // current distance to the scene
    
      t += d;			// "march" the ray
      
      if (d < 0.001 || t > 100.0) break; // "d" early stop if close enough
																				 // "t" early stop if too far
			
    }
  
    // Coloring
      col = palette(t*0.03 + 0.05);
      
  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col, 1.0);
}