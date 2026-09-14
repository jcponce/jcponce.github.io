/*
 
 Navier-Stokes by Xor
 This version by Juan Carlos Ponce Campuzano
 14/Sep/2026
 https://www.patreon.com/jcponce
 
 Adapted from the original code by Xor
 https://fragcoord.xyz/s/nsm4hiif
 The Navier-Stokes visualization made by Xor
 I guess this was inspired from ChatGPT's solution to the 
 Navier–Stokes existence and smoothness problem.
 https://openai.com/index/navier-stokes-solution/
 
*/

// These are necessary definitions that let your graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;

varying vec2 vTexCoord;

// 2D rotation
mat2 rot2D(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// GLSL ES 1.00 has no tanh(), so roll our own
vec4 tanh4(vec4 x) {
  vec4 e = exp(2.0 * x);
  return (e - 1.0) / (e + 1.0);
}

void main() {
  // Shadertoy-style pixel coordinates (gl_FragCoord.xy in Shadertoy)
  vec2 C = vTexCoord * iResolution.xy;

  // p5's vTexCoord may be y-flipped w.r.t. Shadertoy.
  // If the image comes out upside-down, uncomment this line:
  // C.y = iResolution.y - C.y;

  // The ray direction is CONSTANT across the loop, so hoist it out.
  vec3 dir = normalize(vec3(C + C, 0.0) - iResolution.xyy);

  // Optional: orbit the camera with the mouse (from your old template)
  // float MN = min(iResolution.x, iResolution.y);
  // dir.yz *= rot2D(-iMouse.y * 6.3 / MN);
  // dir.xz *= rot2D(-iMouse.x * 6.3 / MN);

  vec4  O = vec4(0.0);
  float z = 0.0;   // travelled distance
  float d = 0.0;   // step size
  float r = 0.0;   // radial distance in the folded space

  for (int i = 0; i < 99; i++) {
    vec3 p = z * dir;

    p.z += 1.7;
    p.yz *= 0.1 * mat2(7.0, 6.0, -6.0, 8.0);

    // cos( (p.y - len(p.xz))*5 + z + iTime - 5.8 ) - vec4(0,11,33,0)
    float s = (p.y - length(p.xz)) * 5.0 + z + iTime - 5.8;
    vec4  k = cos(vec4(s) - vec4(0.0, 11.0, 33.0, 0.0));
    p.xz *= 4.0 * mat2(k.x, k.y, k.z, k.w);

    r = length(p.xz);

    d = ( length(sin(p.xz * 5.0 + 1.0)) / 6.0
        + pow(abs(p.y * r), 3.0) / 20.0
        + r / 45.0 - 0.1
        ) / (2.0 + r + r);

    z += d;

    O += (sin(r + vec4(3.0, 2.0, 1.0, 0.0)) + 1.0)
       / (120.0 + d * d * 1e9);
  }

  O = sqrt(tanh4(O));

  gl_FragColor = vec4(O.rgb, 1.0);
}