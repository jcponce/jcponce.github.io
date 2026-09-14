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

  // Ray direction (unchanged)
  vec3 dir = normalize(vec3(C + C, 0.0) - iResolution.xyy);

  // ----- Orbit camera around the object's centre -----
  float MN = min(iResolution.x, iResolution.y);
  float ax = -iMouse.y * 6.3 / MN;   // pitch
  float ay = -iMouse.x * 6.3 / MN;   // yaw

  vec3 pivot = vec3(0.0);            // object centre = world origin
  vec3 ro    = vec3(0.0, 0.0, 1.7);  // camera position (this is what
                                     // the old `p.z += 1.7` implied)

  // Rotate camera position around the pivot…
  // vec3 rel = ro - pivot;
  // rel.yz *= rot2D(ax);
  // rel.xz *= rot2D(ay);
  // ro = rel + pivot;

  // …and rotate the direction by the same amount, so the ray still
  // passes through the pivot after the rotation.
  // dir.yz *= rot2D(ax);
  // dir.xz *= rot2D(ay);
  // ---------------------------------------------------

  vec4 O = vec4(0.0);
  float z = 0.0;
  float d = 0.0;
  float r = 0.0;

  for (int i = 0; i < 100; i++) {
    vec3 p = ro + z * dir;   // <-- now includes the camera offset

    // (the old `p.z += 1.7;` line is gone — it's baked into `ro`)

    p.yz *= 0.1 * mat2(7.0, 6.0, -6.0, 8.0);

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
  gl_FragColor = vec4(1.0 - O.rgb, 1.0);   // white background
}