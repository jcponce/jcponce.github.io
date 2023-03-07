const frag = `precision mediump float;
  varying highp vec2 vVertTexCoord;

  uniform sampler2D bg;
  uniform float time;
	uniform float aspect;
	
	#define PI ${Math.PI}
	
	mat4 axisAngleRotation(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
	}
	
	float map(float val, float inA, float inB, float outA, float outB) {
		return (val - inA) / (inB - inA) * (outB - outA) + outA;
	}

	vec4 sampleBackground(vec3 normal, sampler2D bg) {
		// x = rho sin(phi) cos(theta)
		// y = rho cos(phi)
		// z = rho sin(phi) sin(theta)
		// rho = 1 after normalization
		float phi = acos(normal.y);
		float sinPhi = sin(phi);
		float theta =
			abs(sinPhi) > 0.0001
				? acos(normal.x / sinPhi)
				: 0.;
		vec2 coord = vec2(
			map(theta, 0., PI, 0., 1.),
			map(phi, 0., PI, 1., 0.)
		);
		coord.x = fract(coord.x + time * 0.01);
		return texture2D(bg, coord);
	}
	
	float rand(float n) {
    return fract(sin(n) * 43758.5453123);
  }
  float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
  }
	
	// An attempt at an accretion disc, but not used because it turns out
	// it's going to take more than my distortion approximation, which is
	// based entirely on a normal
	float distToDisc(vec3 angle) {
		float dist = length(vec2(angle.x, angle.y * 10.));
		return (1. - smoothstep(0.3, 0.48, dist)) * map(noise(dist * 40.), 0., 1., 0.8, 1.);
		// * smoothstep(0.3, 0.32, dist);
	}

	void main() {
		vec2 coord = vVertTexCoord;
		if (aspect > 1.) {
			coord.y = (coord.y - 0.5) / aspect + 0.5;
		} else {
			coord.x = (coord.x - 0.5) * aspect + 0.5;
		}

    vec3 eye = vec3(0.5, 0.5, map(max(aspect - 1., 1. - aspect), 0., 4., 0.27, 0.05));
		eye.x += sin(time*0.055)*0.16;
		eye.y += sin(time*0.03)*0.12;
		eye.z += map(sin(time*0.15), -1., 1., 0., 0.2);
		vec3 pixel = vec3(coord, 0.);
		vec3 angle = normalize(pixel - eye);
		vec3 distortedAngle = angle;
		
		vec3 toBlackHole = normalize(vec3(0.5, 0.5, 0.) - eye);
		float dotToBlackHole = dot(angle, toBlackHole);
		
		vec3 color = vec3(0., 0., 0.);
		if (dotToBlackHole < 0.96) {
			float angleToBlackHole = acos(dotToBlackHole);
			
			vec3 normalToBlackHole = vec3(-coord.y + 0.5, coord.x - 0.5, 0.);
			float distortAmount = pow(map(angleToBlackHole, ${Math.acos(0.98)}, 2. * PI, 1., 0.), 6.); 
			mat4 rotateAboutNormal = axisAngleRotation(
				normalToBlackHole,
				map(distortAmount, 0., 1., 0., PI + angleToBlackHole)
			);
			distortedAngle = (rotateAboutNormal * vec4(angle, 0.)).xyz;
			float distortion = map(dot(angle, distortedAngle), -1., 1., 1., 0.);
			float brighten = pow(distortion * 1.5, 2.);
			
			color = (sampleBackground(distortedAngle, bg).xyz + 1.*pow(distortion, 20.));
			color += pow(clamp(map(dotToBlackHole, 0.92, 0.96, 0., 1.), 0., 1.), 5.);
			
			// Uncomment to try out my broken accretion disc
			// color += distToDisc(distortedAngle);
		} else {
			color += pow(map(dotToBlackHole, 0.96, 1., 1., 0.), 8.);
		}

    gl_FragColor = vec4(color, 1.);
  }
`

// Just a pass-through vertex shader, nothing fancy here
const vert = `attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying highp vec2 vVertTexCoord;

  void main(void) {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vVertTexCoord = aTexCoord;
  }
`