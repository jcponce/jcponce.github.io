// https://www.shadertoy.com/view/DsBGRz by
// https://www.shadertoy.com/user/kishimisu

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

void main(void)
{
  
  vec2 coord = vTexCoord;

  float u = coord.x * 2.0 - 1.0;
  float v = coord.y * 2.0 - 1.0;
  const float scale = 0.85;

  // Make sure pixels are square
  u = u / scale * iResolution.x / iResolution.y;
  v = v / scale;
  
  vec2 p = vec2(u, v);
  
    vec2 mouse = vec2(iMouse.x, iMouse.y) /scale;
    
    float mouseActive = iMouse.x + iMouse.y;
    if (mouseActive == 0.) mouse = vec2(cos(iTime*.15-1.4), sin(iTime*.15-1.4))*.98; // default mouse animation
    
    vec3 colm, colj;                 // mandelbrot & julia colors

    vec2 zm = vec2(0.);              // mandelbrot starting point
    vec2 zj = p;                     // julia starting point
    
    vec2 cm = p - vec2(.55, .0);     // mandelbrot iteration point
    vec2 cj = mouse - vec2(.55, .0); // julia iteration point
    
    //colj = vec3(0.,0.,0.);   
  
  for (float iter = 0.; iter < 200.; iter++) {
        zm = vec2(zm.x*zm.x - zm.y*zm.y, 2.*zm.x*zm.y) + cm; // mandelbrot iteration
        zj = vec2(zj.x*zj.x - zj.y*zj.y, 2.*zj.x*zj.y) + cj; // julia iteration
        
        if (dot(zm,zm) > 40.) { // stop mandelbrot
            colm = vec3(iter/80.);
            zm = vec2(0.); cm = vec2(0.);
        }
        
        if (dot(zj,zj) > 40.) { // stop julia
            float smooth_iter = iter + 2. - log(log(dot(zj,zj)))/log(2.);
            colj = clamp(cos(vec3(iColor.x,iColor.y,iColor.z) * pow(smooth_iter * 2., iColor.w)), 0., 1.);
            zj = vec2(0.); cj = vec2(0.);
        }
        
        if(dot(cm, cm) == 0. && dot(cj, cj) == 0.) break; // break if both mandelbrot & julia stopped
    }
  
  if (mouseActive == 0. || iMouse.z > 0.) {
        colj = mix(colm, colj, clamp(length(colj), 0., 1.)); // mix between mandelbrot and julia
        colj = mix(colj, vec3(0.,1.,1.), smoothstep(.03, .02, length(mouse - p))); // add dot
    }
   
  
  gl_FragColor = vec4(colj, 1.0);
}