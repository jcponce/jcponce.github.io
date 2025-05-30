uniform sampler2D uReflectionMap;
uniform float uPixelation;
uniform float uReflectivity;
uniform float uRoughness;
uniform float uRoughnessScale;

varying vec4 vWPosition;
varying vec3 vNormal;

#include ../noise.glsl;
#include ../functions.glsl;

void main() {

  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vWPosition.xyz - cameraPosition);

  ivec2 iRes = textureSize(uReflectionMap, 0);
  vec2 uv = gl_FragCoord.xy / vec2(iRes);
  uv.y = 1.0 - uv.y;
  vec2 texel = vec2(1.0) / vec2(iRes.x, iRes.y);

  vec3 reflection = texture( uReflectionMap, uv + normal.xz * 0.06 ).rgb;
  float d = max(0.0, dot(normal, -normalize(vec3(3, 10, 7))));


  vec3 color = reflection;
  color *= pow(d,0.4);
  color += pow(smoothstep(0.9,.95,d),3.) * 0.9;

  float a  = 1. - smoothstep(3.,7.5,length(vWPosition.xyz));

  gl_FragColor = vec4(color, a);

  #include <tonemapping_fragment>
	#include <colorspace_fragment>

}