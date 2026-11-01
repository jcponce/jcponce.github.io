import * as THREE from 'three';

/**
 * Base Setup
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const camera = new THREE.Camera();

/**
 * Shader Material
 */
const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
    iTime:       { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) }
};

// Shadertoy-style code goes here (needs mainImage + iTime/iResolution)
const shadertoyCode = /* glsl */`
/*
Inspired by Xor
https://x.com/XorDev/status/1452126090634403842
*/

// Use simplex noise wherever N(...) appears. Returns roughly [-1, 1].
#define N snoise3D

// Rodrigues rotation matrix: rotates by angle a around axis.
mat3 rotate3D(float a, vec3 axis) {
    vec3 n = normalize(axis);
    float s = sin(a), c = cos(a), oc = 1.0 - c;
    return mat3(
        oc*n.x*n.x + c,     oc*n.x*n.y + n.z*s, oc*n.x*n.z - n.y*s,
        oc*n.x*n.y - n.z*s, oc*n.y*n.y + c,     oc*n.y*n.z + n.x*s,
        oc*n.x*n.z + n.y*s, oc*n.y*n.z - n.x*s, oc*n.z*n.z + c
    );
}

// ---- 3D simplex noise (Ashima Arts / Ian McEwan, MIT license) ----
vec3 mod289(vec3 x) { return x - floor(x*(1.0/289.0))*289.0; }
vec4 mod289(vec4 x) { return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

float snoise3D(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_*D.wyz - D.xzx;

    vec4 j  = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);

    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ==== main ====
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2  r = iResolution.xy;
    float t = iTime;

    // Slowly precessing frame for the disk/noise
    mat3 A = rotate3D(t/10.0, vec3(0.0, 2.0, 9.0));

    float i = 0.0;      // step counter
    float R = 0.0;      // squared distance from the hole
    float a = 0.015;    // brightness / transmittance (also scales stars)
    vec3  q;            // position in the rotating, scaled noise frame

    // Camera on +X looking toward -X
    vec3 d = (vec3(0.0, fragCoord)*2.0 - vec3(r.x, r.x, r.y)) / r.x;
    vec3 p = vec3(3.0, 0.0, 0.0) + d;

    vec3 o = vec3(0.0); // accumulated colour

    // Ray march
    for (; i++ < 150.0; ) {
        q = p * A / 0.1;
        R = dot(p, p);

        // Event horizon: fade rays that fall in
        a *= min(R, 0.25) / 0.25;

        // Thin, noisy accretion disk emission
        o += (1.0 - d)
           * (N(q) + N(q*0.3) + 1.0)
           * a
           / max(q.z*q.z, R)
           / R;

        // Fake gravity: bend the ray toward the origin
        d -= p / (400.0 * R * R);

        // Advance the ray
        p += d / 40.0;
    }

    // Stars sampled along the final (bent) ray direction
    o = max(o, vec3((N(normalize(d)*A*70.0) - 0.7) * a * 100.0));

    fragColor = vec4(o, 1.0);
}
`;

// Wrap the Shadertoy code so it works as a Three.js fragment shader
const fragmentShader = /* glsl */`
precision highp float;

uniform float iTime;
uniform vec3  iResolution;

${shadertoyCode}

void main() {
    vec4 color;
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = vec4(color.rgb, 1.0);
}
`;

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader,
    depthTest: false,
    depthWrite: false
});

const mesh = new THREE.Mesh(geometry, material);
mesh.frustumCulled = false;
scene.add(mesh);

/**
 * Renderer & Sizing
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false // pointless for a full-screen shader, and costs fill-rate
});

// This shader is heavy (150 steps x several noise calls per pixel), so cap the pixel ratio
const MAX_PIXEL_RATIO = 1.5;

const updateSize = () => {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);

    // Drawing-buffer size, so gl_FragCoord.xy matches iResolution.xy
    uniforms.iResolution.value.set(width * pixelRatio, height * pixelRatio, 1);
};

window.addEventListener('resize', updateSize);
updateSize();

/**
 * Animate
 */
const timer = new THREE.Timer();

const tick = () => {
    timer.update();
    uniforms.iTime.value = timer.getElapsed();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();