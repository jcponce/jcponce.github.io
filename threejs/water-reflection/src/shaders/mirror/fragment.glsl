uniform sampler2D uReflectionMap;
uniform float uPixelation;
uniform float uReflectivity;
uniform float uRoughness;
uniform float uRoughnessScale;

varying vec4 vWPosition;

#include ../noise.glsl;
#include ../functions.glsl;

void main() {

  ivec2 iRes = textureSize(uReflectionMap, 0);
  vec2 uv = gl_FragCoord.xy / (vec2(iRes) * uPixelation );
  uv.y = 1.0 - uv.y;
  vec2 texel = vec2(1.0) / vec2(iRes.x, iRes.y);

  float noiseF = uRoughnessScale;

  vec2 t = vec2(cnoise(vWPosition.xyz * noiseF),cnoise(vWPosition.xyz * noiseF + 10.)) * 0.5;
  vec2 t2 = vec2(cnoise(vWPosition.xyz * noiseF * 500.),cnoise(vWPosition.xyz * noiseF * 500. + 10.));
  vec2 t3 = vec2(cnoise(vWPosition.xyz * noiseF * 1000.),cnoise(vWPosition.xyz * noiseF * 1000. + 10.));
  vec2 t4 = vec2(cnoise(vWPosition.xyz * noiseF * 2000.),cnoise(vWPosition.xyz * noiseF * 2000. + 10.));

  vec3 reflection = texture( uReflectionMap, uv + t * uRoughness ).rgb;

  // reflection /= 1. + float(iteration * iteration);
  
  // grid
  float tx = fract(vWPosition.x * 0.25);
  tx = smoothstep(0.,fwidth(tx) * 3.,tx);
  float tz = fract(vWPosition.z * 0.25);
  tz = smoothstep(0.,fwidth(tz) * 3.,tz);

  vec3 grid = vec3(mix(tx,tz,1. - tz));
  vec3 color = mix(vec3(0.0),vec3(0.05),1. - grid);

  color = mix(reflection * (uReflectivity),color, 1. - grid);
  // reflection;

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
	#include <colorspace_fragment>

}