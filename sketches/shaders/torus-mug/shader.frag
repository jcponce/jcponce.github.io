/*

You can use this shader as a template for ray marching shaders

Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 13/Oct/2023

*/


// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif


// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;
//uniform sampler2D iTexture01;

varying vec2 vTexCoord;

#define PI 3.14159265
#define MAXIT 200
#define EPSILON 0.001
 
#define minx4(a, b) ((a.w) < (b.w) ? (a) : (b))
#define minx2(a, b) ((a.x) < (b.x) ? (a) : (b))



mat3 rotX(float a)
{
    return mat3(
        1., 0., 0.,
        0., cos(a), -sin(a),
        0., sin(a), cos(a)
    );
}
 
mat3 rotY(float a)
{
    return mat3(
        cos(a), 0.0, -sin(a),
        0., 1., 0.,
        sin(a), 0.0, cos(a)
    );
}
 
mat3 rotZ(float a)
{
    return mat3(
        cos(a), -sin(a), 0.,
        sin(a), cos(a), 0.,
        0., 0., 1.
    );
}
 
float t;
 
float sphere(vec3 r, float a)
{
    return length(r) - a;
}
 
float torus(vec3 r, vec2 a)
{
    vec2 p = vec2(length(r.xz) - a.x, r.y);
    return length(p) - a.y;
}

float mug(vec3 r, float m)
{
	vec2 p = abs(vec2(length(r.xz), r.y)) - vec2(2.);
    float cyl = (min(max(p.x, p.y), 0.0) + length(max(p, 0.)));
    
	p = abs(vec2(length(r.xz), r.y - 1. - 4. * (1. - m)*4.)) - vec2(1.5 - (1.-m)*3., 3.);
    float icyl = (min(max(p.x, p.y), 0.0) + length(max(p, 0.)));
    
    vec3 rr = r;
    rr.x += 1.5;
    p = vec2(length(rr.xy) - 1.5, rr.z);
    float tor = (length(p) - 0.25);
	
	return min(max(-icyl, cyl), max(-icyl, tor)) * m;
}

float torusm(vec3 r, float m)
{
    vec3 rr = r;
    rr.x += 1.7;
    vec2 p = vec2(length(rr.xy) - 1.5, rr.z);
    float tor = (length(p) - 0.55); //thinner/thicker
	
    return tor * m;
}
 
float plane(vec3 r, vec3 o, vec3 n)
{
    return dot(r - o, n);
}

float cylinder(vec3 r, vec2 a)
{
	vec2 p = abs(vec2(length(r.xz), r.y)) - a;
	
	return min(max(p.x, p.y), 0.0) + length(max(p, 0.));
}

float hash(vec2 r)
{
    return fract(sin(dot(r, vec2(15.5921, 96.654654))) * 23626.3663);
}

float box(vec3 r, vec3 a)
{	
    vec3 p = (abs(r) - a);
    
    return length(max(p, 0.));
}

float shade(vec3 n, vec3 rd)
{
    return clamp(max(dot(n, -rd), 0.9) + 1., 0.9, 1.0);
}
 
vec3 fog(float z, vec3 col, vec3 fogCol)
{
    return mix(fogCol, col, exp(-z));
}

mat3 obj;

vec2 map(vec3 r)
{    
    obj = rotY(t) * rotX(sin(t*0.33) * 0.1 - 0.2);
    
    r = obj * r;
    
    float m = (sin(t * 0.5) + 1.) * 0.5;
        
    r.x -= (1.-m) * 1.5;
    
    float d = torusm(r, 1. - m);
    d += mug(r, m);
    
    return vec2(d, 1.);
}

vec3 matCol(vec2 o)
{
    return vec3(0.0, 0.0, 0.9); //Mug color
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
    //vec2 fragCoord = vTexCoord;

    float u = coord.x * 2.0 - 1.0;
    float v = coord.y * 2.0 - 1.0;
    const float scale = 2.0;

    // Make sure pixels are square
    u = u / scale * iResolution.x / iResolution.y;
    v = v / scale;
  
    t = iTime/3.5;

    vec2 uv = vec2(u, v);
  
    mat3 cam = rotY(-PI) * rotX(0.5);
       
    vec3 ro = vec3(0., 3.0, -5.0);
    vec3 rd = cam * normalize(vec3(uv * 2., -1.));
    vec3 r = ro;
   
    vec3 bcol = vec3(.5, (.4+uv.y)*0.91, (.95+uv.y*0.1)*0.8)*2. + vec3(0.9); //background color
    vec4 col = vec4(0.);
    col.rgb = bcol;
   
    float sh = 1.;
   
    //int ch = 1;
   
    for (int i = 0; i < MAXIT; ++i) {
        vec2 d = map(r);
        float z = length(r - ro);
    
        if (d.x < EPSILON) {
            col.rgb = mix(col.rgb, 
				matCol(d), 
				shade(normalize(r), rd));
            col.rgb = fog(z * 0.04, col.rgb, bcol); //darker/lighter mug
            break;
        }
       
        d.x *= 0.6 - 0.1 * hash(uv);
		r += rd * d.x;
        
        sh = (float(i) / float(MAXIT));
    }
   
    
	col.rgb *= exp(-sh * 0.5);
      
  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col.rgb, 1.0);
}