import * as THREE from 'three';

/**
 * Base Setup
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

/**
 * Shader Material
 */
const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
    iTime:       { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) }
};

const fragmentShader = /* glsl */`
/*
Based upon YoheiNishitsuji's work:
https://twigl.app/?ol=true&ss=-OgMbTexmkAwvg_2mnM_
https://yoheinishitsuji.com/
*/
precision highp float;

uniform float iTime;
uniform vec3  iResolution;

/*
    Rotate a 3D vector around an arbitrary axis.

    a = rotation angle in radians
    v = axis of rotation

    This uses Rodrigues' rotation formula, which constructs
    a 3x3 rotation matrix from an angle and a unit vector.
    https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
*/
mat3 rotate3D(float a, vec3 v) {

    // Ensure that the rotation axis has length 1.
    v = normalize(v);

    // Precompute trigonometric values used in the matrix.
    float c = cos(a);
    float s = sin(a);
    float k = 1.0 - c;

    // Return the 3x3 rotation matrix.
    // Multiplying a vector by this matrix rotates it by
    // angle a around the axis v.
    return mat3(
        c+k*v.x*v.x,     k*v.x*v.y+s*v.z, k*v.x*v.z-s*v.y,
        k*v.x*v.y-s*v.z, c+k*v.y*v.y,     k*v.y*v.z+s*v.x,
        k*v.x*v.z+s*v.y, k*v.y*v.z-s*v.x, c+k*v.z*v.z
    );
}


/*
    Convert HSV (Hue, Saturation, Value) to RGB.

    h = hue        (colour family)
    s = saturation (0 = grayscale, 1 = fully saturated)
    v = value      (brightness)

    The function produces an RGB colour without using
    conditional statements to handle different hue ranges.
*/
vec3 hsv(float h, float s, float v) {

    // Create three phase-shifted versions of the hue.
    // Each component corresponds to a different RGB channel.
    vec3 p = abs(
        fract(h + vec3(0.0, 2.0/3.0, 1.0/3.0))*6.0 - 3.0
    );

    // Clamp the colour channels to [0, 1], then interpolate
    // between white and the hue-dependent RGB values.
    // Multiplication by v controls the final brightness.
    return v * mix(
        vec3(1.0),
        clamp(p - 1.0, 0.0, 1.0),
        s
    );
}


void main() {

    vec2 fragCoord = gl_FragCoord.xy;

    // Screen resolution and elapsed time.
    vec2 r = iResolution.xy;
    float t = iTime;

    // Accumulated pixel colour.
    vec3 col = vec3(0.0);

    // g, e and s are working variables used by the
    // iterative geometric transformation and shading.
    float g = 0.0;
    float e = 0.0;
    float s = 0.0;


    // OUTER LOOP:
    // Perform 99 iterations, accumulating colour at each step.
    // The changing value of g also affects the next iteration's
    // initial 3D point.
    for (int i = 0; i < 99; i++) {

        // Map the pixel coordinates into a scaled coordinate
        // system centred on the screen.
        //
        // Dividing by screen height preserves the aspect ratio.
        // Multiplying by 5 zooms the coordinate system.
        // Adding (0, 9) shifts the pattern vertically.
        // The current value of g supplies the z-coordinate.
        vec3 p = vec3(
            (fragCoord - 0.5*r)/r.y*5.0 + vec2(0.0, 9.0),
            g
        );

        // Rotate the point around a time-dependent axis.
        // The cosine changes the rotation angle slowly,
        // while sin(t) slightly changes the axis direction.
        p *= rotate3D(
            -1.15 - cos(t*0.2)*0.05,
            vec3(1.0, 11.0 + sin(t)*0.2, -1.5)
        );


        // Reset the scale-like variable for this iteration.
        s = 2.0;


        // INNER LOOP:
        // Repeatedly transform the point p.
        // These nonlinear transformations generate the
        // intricate, fractal-like geometry of the shader.
        for (int j = 0; j < 19; j++) {

            // Calculate a scale factor from the current point.
            //
            // dot(p, p*0.51) is a weighted sum of the
            // squared coordinates. The max prevents division
            // by a value too close to zero.
            //
            // Multiplying s by e accumulates the scale changes.
            s *= e = 7.1 / max(dot(p, p*0.51), 0.00001);

            // Transform the point:
            // 1. Multiply each coordinate by the scale e.
            // 2. Take absolute values to fold space.
            // 3. Subtract from a fixed reference vector.
            // 4. Fold again using absolute values.
            //
            // Repeating this operation creates the complex,
            // self-similar-looking structures.
            p = vec3(0.08, 4.0, -1.0)
              - abs(abs(p)*e - vec3(3.0, 4.0, 3.0));
        }

        // Update g using the transformed y-coordinate.
        // The accumulated scale s affects its contribution.
        // This value feeds into the next outer iteration.
        g += p.y/s;


        // Calculate a brightness-related quantity.
        //
        // log2 compresses the range of s.
        // exp(min(e, 80)) limits the exponential input
        // to reduce the risk of overflow.
        s = log2(max(s, 0.00001))
          / exp(min(e, 80.0));


        // Convert the current iteration into a colour.
        //
        // Hue:       fixed at 0.1
        // Saturation: depends on g and e
        // Value:      depends on s
        //
        // The small vec3(0.01) offset and subtraction are
        // intentional: the result is accumulated over all
        // 99 iterations rather than simply replacing the colour.
        col += vec3(0.01)
             - hsv(0.1, g*0.016 - e*0.3, s/200.0);
    }


    // Output the final accumulated RGB colour.
    // Alpha = 1.0 means fully opaque.
    gl_FragColor = vec4(col, 1.0);
}
`;

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: /* glsl */`
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: fragmentShader,
    depthTest: false,
    depthWrite: false
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Renderer & Sizing
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

const updateSize = () => {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);

    // Match the drawing-buffer size so gl_FragCoord.xy == iResolution.xy scale
    uniforms.iResolution.value.set(width * pixelRatio, height * pixelRatio, 1);
};

window.addEventListener('resize', updateSize);
updateSize();

/**
 * Animate
 */
const timer  = new THREE.Timer();
const camera = new THREE.Camera();

const tick = () => {
    timer.update();
    uniforms.iTime.value = timer.getElapsed();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();