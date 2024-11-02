/*
 * Inspired by Kishimisu
 * https://www.shadertoy.com/user/kishimisu
 * https://www.shadertoy.com/view/DsBGRz 
 * This version by Juan Carlos Ponce Campuzano
 * 03/Nov/2024
 */

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec3 iMouse;
uniform vec4 iColor;
uniform float iTime;

varying vec2 vTexCoord;

void main(void) {
  
  // Normalize coordinates with aspect ratio
    float scale = 0.85;
    vec2 coord = (vTexCoord * 2.0 - 1.0) / vec2(scale * iResolution.y / iResolution.x, scale);
    vec2 p = coord; // Keep p as a modified version of coord
  
    vec2 mouse = vec2(iMouse.x, iMouse.y) /scale;
    
    float mouseActive = iMouse.x + iMouse.y;
    if (mouseActive == 0.) mouse = vec2(cos(iTime * 0.15 - 1.4), sin(iTime * 0.15 -1.4)) * 0.98; // default mouse animation
    
    vec3 colm, colj;                 // mandelbrot & julia colors

    vec2 zm = vec2(0.0);              // mandelbrot starting point
    vec2 zj = p;                     // julia starting point
    
    vec2 cm = p - vec2(0.55, 0.0);     // mandelbrot iteration point
    vec2 cj = mouse - vec2(0.55, 0.0); // julia iteration point   
  
  for (float iter = 0.0; iter < 200.0; iter++) {
        zm = vec2(zm.x * zm.x - zm.y * zm.y, 2.0 * zm.x * zm.y) + cm; // mandelbrot iteration
        zj = vec2(zj.x * zj.x - zj.y * zj.y, 2.0 * zj.x * zj.y) + cj; // julia iteration
        
        if (dot(zm,zm) > 40.0) { // stop mandelbrot
            colm = vec3(iter / 80.0);
            zm = vec2(0.0);
            cm = vec2(0.0);
        }
        
        if (dot(zj,zj) > 40.0) { // stop julia
            float smooth_iter = iter + 2.0 - log2(log(dot(zj, zj)));
            colj = clamp(cos(iColor.rgb * pow(smooth_iter * 2.0, iColor.w)), 0.0, 1.0);
            zj = vec2(0.0); 
            cj = vec2(0.0);
        }
        
        if(dot(cm, cm) == 0.0 && dot(cj, cj) == 0.0) break; // break if both mandelbrot & julia stopped
    }
  
  if (mouseActive == 0.0 || iMouse.z > 0.0) {
        colj = mix(colm, colj, clamp(length(colj), 0.0, 1.0)); // mix between mandelbrot and julia
        colj = mix(colj, vec3(0.0, 1.0, 1.0), smoothstep(0.03, 0.02, length(mouse - p))); // add dot
    }
   
  
  gl_FragColor = vec4(colj, 1.0);
}