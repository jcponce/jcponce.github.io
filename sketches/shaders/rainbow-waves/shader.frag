/*

Learning Shaders 
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 31/May/2022

*/

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

uniform float iFrame;
varying vec2 vTexCoord;

#define M_PI 3.14159265358979
#define M_E  2.71828182845904

// Convert from Hue,Saturation/Value to RGB
    // http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
    vec3 hsv2rgb(vec3 c)
    {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // https://github.com/d3/d3-color
    vec3 cubehelix(vec3 c) {
      float a = c.y * c.z * (1.0 - c.z);
      float cosh = cos(c.x + M_PI / 2.0);
      float sinh = sin(c.x + M_PI / 2.0);
      return vec3(
        (c.z + a * (1.78277 * sinh - 0.14861 * cosh)),
        (c.z - a * (0.29227 * cosh + 0.90649 * sinh)),
        (c.z + a * (1.97294 * cosh))
      );
    }
    
    // https://github.com/d3/d3-scale-chromatic
    vec3 cubehelixDefault(float t) {
      return cubehelix(vec3(mix(300.0 / 180.0 * M_PI, -240.0 / 180.0 * M_PI, t), 0.5, t));
    }
    
    // https://github.com/d3/d3-scale-chromatic
    vec3 cubehelixRainbow(float t) {
      if (t < 0.0 || t > 1.0) t -= floor(t);
      float ts = abs(t - 0.5);
      return cubehelix(vec3((360.0 * t - 100.0) / 180.0 * M_PI, 1.5 - 1.5 * ts, 0.8 - 0.9 * ts));
    }
		
		
void main() {
  
  // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;

    float u = coord.x * 2.0 - 1.0;
    float v = coord.y * 2.0 - 1.0;
    const float scale = 2.0;

    // Make sure pixels are square
    u = u * scale * iResolution.x / iResolution.y + 0.5;
    v = v * scale + 0.5;

    vec2 uv = vec2(u, v);
   
   // Calculate the to center distance
    float d = length(uv - 0.5) * 2.0;
    
    // Calculate the ripple time
    float t = d * d * 15.0 - iTime * 33.0;
    
    // Calculate the ripple thickness
    d = (cos(t) * 0.5 + 0.5) * (1.5 - d);
    
    // Time varying pixel color
    vec3 col = 0.5 + 0.5 * cos(cubehelixRainbow(t / 40.0) + uv.xyx + vec3(3.0,1.0,1.0));

    // Set the output color to rgb channels and the thickness to alpha channel
    
    gl_FragColor = vec4(col, d);

	
}