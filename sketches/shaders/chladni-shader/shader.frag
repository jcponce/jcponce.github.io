// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform vec2 u_resolution;

uniform int iFrame;

uniform float av, bv, mv, nv, pv1, pv2, pv3, pv4;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

float Chladni(float a, float b, float m, float n, vec4 p, vec2 z, float t) {
  float v1 = a * sin(PI * n * z.x + p.x * t ) * sin(PI * m * z.y + p.y * t);
  float v2 = b * sin(PI * m * z.x + p.z * t) * sin(PI * n * z.y + p.w * t);
  return v1 + v2;
} 

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

 // Convert from Hue,Saturation/Value to RGB
 // http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
 vec3 hsv2rgb(vec3 c) {
   vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
   vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
   return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
 }

// Noise Function 

float hash( float n ){
	return fract(sin(n)*43758.5453);
}

float noise( vec3 x ){
// The noise function returns a value in the range -1.0f -> 1.0f

 vec3 p = floor(x);
 vec3 f = fract(x);

 f = f*f*(3.0-2.0*f);
 float n = p.x + p.y*57.0 + 113.0*p.z;

 return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
			mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
			mix(mix( hash(n+113.0), hash(n+114.0),f.x),
			mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z)-.5;
}

void main(){
  
  // copy the vTexCoord
  // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
  // we can use it to access every pixel on the screen
  vec2 coord = vTexCoord;

  float a = coord.x * 2.0 - 1.0;
  float b = coord.y * 2.0 - 1.0;
  const float scale = 1.5;

  // Make sure pixels are square
  a = a * scale * u_resolution.x / u_resolution.y;
  b = b * scale;

  vec2 c = vec2(a, b);
  vec4 po = vec4(pv1, pv2, pv3, pv4);
  
  //vec3 t = (float(iFrame)*vec3(1.0,2.0,3.0)/1.0)/100.0;

  float col = Chladni(av, bv, mv, nv, po, c, float(iFrame) * 0.03);
  float c1 = map(col, -1.0, 1.0, 0.0, 1.0);
  
  vec3 hsv = vec3(1, 0, col);
  //vec3 hsv = vec3(_arg, 1.0, 1.0);
  vec3 rgb = hsv2rgb( hsv );

  // Let's color pixels :)
  gl_FragColor = vec4(rgb, 1.0);

}