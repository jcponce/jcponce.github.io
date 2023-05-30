/*

Original code by Increment: 
https://www.shadertoy.com/view/slsBWN

*/

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 u_resolution;
//uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vTexCoord;

float TAU = 2.0*3.14159256;

// 3d simplex noise from https://www.shadertoy.com/view/XsX3zB

vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos( 6.28318*(c * t + d) );
}


void main() {
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;

    float u = coord.x * 2.0 - 1.0;
    float v = coord.y * 2.0 - 1.0;
    const float scale = 1.21;

    // Make sure pixels are square
    u = u * scale * u_resolution.x / u_resolution.y;
    v = v * scale;

    vec2 uv = vec2(u, v);
    vec2 uv0 = vec2(u, v);
  
    vec3 col = vec3(0.0);
    
    // Found a way to loop 3D noise.  Seems to work, decently.
	float speed = u_time / 4.0;
    float n = simplex3d(vec3(sin(speed + uv.x * 1.3), cos(speed + uv.y * 1.3), uv.y + uv.x));
    for(float i = 0.0; i < 7.0; i++){
      float circleSDF = abs( length(uv) - (0.8 - 0.07 * i) + n * n ) - 0.001;  
	  //float circleSDF = abs( length(uv) - (0.8 - 0.07 * i) + n * n ) - 0.001;
	  vec3 colrs = palette(length(uv0) + i*.9 - u_time*.4);
      //col += mix(vec3(0.05), col, smoothstep(-0.02, 0.02, circleSDF));
	  //circleSDF = pow(0.01/circleSDF, 1.);
	  col += mix(colrs, col, smoothstep(-0.02, 0.02, circleSDF));
	 // col += palette(2.1 * length(uv) + 5.0 * n * n);
    }
  

  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col, 1.0);
}