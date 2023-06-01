/*

Tutorial with Inigo to learn shaders
https://www.youtube.com/watch?v=Cfe5UQ-1L9Q&ab_channel=InigoQuilez

Learning Shaders - Ray casting
Author: Juan Carlos Ponce Campuzano
Website: https://jcponce.github.io
Date: 31/March/2023

*/

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif


// These are our passed in information from the sketch.js
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

varying vec2 vTexCoord;

float map(in vec3 pos){
    float d1 = length(pos) - 0.25;
    
    float d2 = pos.y - (-0.25);
    
    
    
    return min(d1, d2);
}

vec3 calcNormal(in vec3 pos){
    vec2 e = vec2(0.0001, 0.0);
    return normalize( vec3(map(pos+e.xyy)- map(pos-e.xyy),
                           map(pos+e.yxy)- map(pos-e.yxy), 
                           map(pos+e.yyx)- map(pos-e.yyx))
                     );
}

float castRay(in vec3 ro, vec3 rd){
  float t = 0.0;
    for(int i = 0; i< 100; i++){
        vec3 pos = ro + t * rd;
        
        float h = map(pos);
        if(h< 0.001)
            break;
        
        t += h;
        
        if(t>20.0) break;
    }
  if (t> 20.0) t=-1.0;
  
  return t;
}

void main() {
    // copy the vTexCoord
    // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
    // we can use it to access every pixel on the screen
  
    vec2 coord = vTexCoord;
    //vec2 fragCoord = vTexCoord;

    float u = coord.x * 2.0 - 1.0;
    float v = coord.y * 2.0 - 1.0;
    const float scale = 0.8;

    // Make sure pixels are square
    u = u / scale * iResolution.x / iResolution.y;
    v = v / scale;

    vec2 p = vec2(u, v);
   
    //vec2 p = (2.0 * fragCoord-iResolution.xy)/iResolution.y;
  
    float an = iTime*0.8;

    vec3 ro = vec3(1.0*sin(an), 0.0, 1.0*cos(an));
    vec3 ta = vec3(0.0, 0.0, 0.0);
  
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0,1,0)));
    vec3 vv = normalize(cross(uu, ww));
  
    //vec3 rd = normalize(vec3(p, -1.5));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );
  
    
    vec3 col = vec3(0.4, 0.75, 1.0) - 0.7 * rd.y;
    col = mix(col, vec3(0.7, 0.75, 0.9), 0.7*exp(-2.0 * rd.y)); 
    
    
    float t = castRay(ro, rd);
    
    if(t>0.0){
    
        vec3 pos = ro + t* rd;
        vec3 nor = calcNormal(pos);
      
        vec3 mate = vec3(0.18);
        
        vec3 sun_dir = normalize(vec3(0.8, 0.4, 0.2));
        float sun_dif = clamp(dot(nor, sun_dir), 0.0, 1.0);
        float sun_sha = step(castRay(pos + nor * 0.001, sun_dir), 0.0);
        float sky_dif =  clamp(0.5 + 0.5*dot(nor, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
        float bou_dif = clamp(0.5 + 0.5*dot(nor, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);
      
        col = mate*vec3(7.0, 5.0, 4.0) * sun_dif * sun_sha;
      
        col += mate*vec3(0.5, 0.8, 0.9) * sky_dif; 
      
        col += mate*vec3(0.7, 0.3, 0.2) * bou_dif;
      
        
    }
  
    col = pow(col, vec3(0.4545));
      
  // gl_FragColor is a built in shader variable, and your .frag file must contain it
  // We are setting the vec3 color into a new vec4, with a transparency of 1 (no opacity)
	gl_FragColor = vec4(col,1.0);
}