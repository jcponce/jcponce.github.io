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

  // ============================================================
  // 1. Convert the texture coordinates into pixel coordinates
  // ============================================================

  // vTexCoord is normally in the range [0, 1] × [0, 1].
  // Multiplying by the screen resolution converts it to
  // pixel-like coordinates.
  //
  // For example, if the canvas is 800 × 600:
  //     vTexCoord = (0.5, 0.5)
  // gives
  //     C = (400, 300)
  vec2 C = vTexCoord * iResolution.xy;


  // p5.js and Shadertoy can use opposite conventions for the
  // vertical texture coordinate.
  //
  // If the resulting image appears vertically flipped, use:
  //
  // C.y = iResolution.y - C.y;


  // ============================================================
  // 2. Construct the viewing ray
  // ============================================================

  // Create a 3D direction vector from the pixel position.
  //
  // C + C is simply 2*C.
  // iResolution.xyy = (width, height, height).
  //
  // The resulting vector points from the camera toward the
  // corresponding pixel in the image plane.
  //
  // normalize() makes it a unit vector.
  vec3 dir = normalize(vec3(C + C, 0.0) - iResolution.xyy);


  // ============================================================
  // 3. Set up an orbiting camera
  // ============================================================

  // MN = smaller canvas dimension.
  // Using the smaller dimension makes mouse rotation behave
  // consistently for different canvas aspect ratios.
  float MN = min(iResolution.x, iResolution.y);


  // Convert the mouse position into rotation angles.
  //
  // iMouse.x controls horizontal rotation (yaw).
  // iMouse.y controls vertical rotation (pitch).
  //
  // 6.3 is approximately 2π, so the mouse can control roughly
  // one complete revolution.
  float ax = -iMouse.y * 6.3 / MN;   // pitch
  float ay = -iMouse.x * 6.3 / MN;   // yaw


  // The object is centred at the origin.
  vec3 pivot = vec3(0.0);


  // Initial camera position.
  //
  // The camera is placed 1.7 units in front of the origin
  // along the z-axis.
  vec3 ro = vec3(0.0, 0.0, 1.7);


  // ============================================================
  // 4. Rotate the camera around the object
  // ============================================================

  // Express the camera position relative to the pivot.
  //
  // Since pivot = (0,0,0), this is initially just ro.
  vec3 rel = ro - pivot;


  // Rotate around the x-axis.
  //
  // Multiplying the yz components by a 2D rotation matrix
  // produces a rotation in the yz-plane.
  //
  // This corresponds to pitching the camera up/down.
  rel.yz *= rot2D(ax);


  // Rotate around the y-axis.
  //
  // Multiplying the xz components rotates in the xz-plane.
  //
  // This corresponds to yawing the camera left/right.
  rel.xz *= rot2D(ay);


  // Convert back from relative coordinates to world coordinates.
  ro = rel + pivot;


  // ============================================================
  // 5. Rotate the viewing direction as well
  // ============================================================

  // The camera has been rotated, so the viewing ray must be
  // rotated by exactly the same angles.
  //
  // Otherwise the camera would move around the object while
  // continuing to look in its original direction.
  dir.yz *= rot2D(ax);
  dir.xz *= rot2D(ay);


  // ============================================================
  // 6. Variables used by the ray marcher
  // ============================================================

  // O = accumulated colour.
  //
  // It starts at zero and colour contributions are added as
  // the ray travels through the scene.
  vec4 O = vec4(0.0);


  // z = distance travelled along the ray.
  //
  // It is gradually increased inside the loop.
  float z = 0.0;


  // d = estimated distance from the current point to the
  // procedural structure.
  //
  // This is what controls how far the ray can safely advance.
  float d = 0.0;


  // r = radial distance in the xz-plane.
  float r = 0.0;


  // ============================================================
  // 7. Ray marching
  // ============================================================

  // For every pixel, march a ray through 3D space.
  //
  // 100 iterations gives the ray up to 100 opportunities to
  // encounter the procedural object.
  for (int i = 0; i < 100; i++) {


    // Find the current 3D position along the ray.
    //
    // ro = ray origin (camera position)
    // dir = ray direction
    // z  = distance travelled
    //
    // Therefore:
    //
    //       p = ro + z * dir
    //
    // describes a point moving along the ray.
    vec3 p = ro + z * dir;


    // The old shader apparently had:
    //
    //     p.z += 1.7;
    //
    // That translation is no longer necessary because the
    // camera position ro already contains the 1.7 offset.


    // ==========================================================
    // 8. Apply a linear transformation to the yz-plane
    // ==========================================================

    // Scale and rotate/shear the y and z coordinates.
    //
    // The matrix
    //
    //     [ 7   6 ]
    //     [-6   8 ]
    //
    // is applied to (y,z), with an additional scale factor 0.1.
    //
    // This creates a linear transformation of the geometry,
    // producing the characteristic distorted structure.
    p.yz *= 0.1 * mat2(
        7.0,  6.0,
       -6.0,  8.0
    );


    // ==========================================================
    // 9. Create a time-dependent scalar field
    // ==========================================================

    // length(p.xz) is the radial distance from the y-axis.
    //
    // p.y - length(p.xz)
    //
    // compares the vertical position with the radial distance.
    //
    // Multiplying by 5 controls the spatial frequency.
    //
    // + z + iTime makes the pattern move over time.
    //
    // - 5.8 shifts the pattern.
    float s =
        (p.y - length(p.xz)) * 5.0
        + z
        + iTime
        - 5.8;


    // ==========================================================
    // 10. Convert the scalar field into four oscillating values
    // ==========================================================

    // cos() creates periodic oscillations.
    //
    // The four components use different phase shifts:
    //
    //     0
    //     11
    //     33
    //     0
    //
    // These different phases help generate colour variation.
    vec4 k = cos(
        vec4(s)
        - vec4(0.0, 11.0, 33.0, 0.0)
    );


    // ==========================================================
    // 11. Transform the xz-plane
    // ==========================================================

    // Construct another 2 × 2 matrix from the cosine values.
    //
    //     [ k.x  k.y ]
    //     [ k.z  k.w ]
    //
    // This matrix is applied to (x,z).
    //
    // The factor 4.0 increases the spatial scale.
    //
    // Because k changes with s, this transformation also changes
    // continuously throughout space and time.
    p.xz *= 4.0 * mat2(
        k.x, k.y,
        k.z, k.w
    );


    // ==========================================================
    // 12. Calculate radial distance
    // ==========================================================

    // Distance from the y-axis in the xz-plane.
    //
    // r = sqrt(x² + z²)
    r = length(p.xz);


    // ==========================================================
    // 13. Estimate the distance to the structure
    // ==========================================================

    // This is the key part of the ray marcher.
    //
    // d controls how far the ray advances during this iteration.
    //
    // The expression contains three contributions:

    // ----------------------------------------------------------
    // A. Sinusoidal detail
    // ----------------------------------------------------------

    // sin(p.xz * 4.0 + 1.0)
    //
    // produces repeating waves in the xz-plane.
    //
    // length() combines the two components into one magnitude.
    // Dividing by 7 controls its influence.
    float detail =
        length(sin(p.xz * 4.0 + 1.0)) / 7.0;


    // ----------------------------------------------------------
    // B. Vertical/radial interaction
    // ----------------------------------------------------------

    // p.y * r couples the vertical coordinate with the
    // radial distance.
    //
    // abs() makes the value symmetric about zero.
    //
    // pow(..., 3.0) strongly emphasises larger values.
    float vertical =
        pow(abs(p.y * r), 3.0) / 20.0;


    // ----------------------------------------------------------
    // C. Radial contribution
    // ----------------------------------------------------------

    // A small contribution proportional to the distance
    // from the y-axis.
    float radial =
        r / 45.0;


    // Combine the three components.
    //
    // The -0.1 shifts the resulting field.
    //
    // The denominator:
    //
    //     2.0 + r + r
    //
    // reduces the step size as r becomes larger.
    d = (
          detail
        + vertical
        + radial
        - 0.1
    ) / (2.0 + r + r);


    // ==========================================================
    // 14. Advance along the ray
    // ==========================================================

    // Move the ray forward by the estimated distance d.
    //
    // This is the fundamental idea of ray marching:
    // take larger steps when far from the structure and
    // smaller steps when approaching it.
    z += d;


    // ==========================================================
    // 15. Accumulate colour
    // ==========================================================

    // Generate a colour contribution based on the radial
    // position r.
    //
    // sin(r + phase) produces smoothly varying RGB values.
    //
    // Adding 1 shifts the range:
    //
    //     sin(...) ∈ [-1,1]
    //
    // becomes
    //
    //     [0,2]
    //
    // so the contribution is non-negative.
    //
    // The denominator controls how strongly this contribution
    // appears.
    //
    // d*d*1e9 makes the contribution much stronger when d
    // becomes small — that is, when the ray approaches the
    // interesting structure.
    O +=
        (sin(
            r + vec4(3.0, 2.0, 1.0, 0.0)
        ) + 1.0)
        /
        (120.0 + d * d * 1e9);
  }


  // ============================================================
  // 16. Tone mapping / contrast adjustment
  // ============================================================

  // tanh4() applies the hyperbolic tangent to the accumulated
  // colour values.
  //
  // This compresses very large values and prevents the colour
  // from becoming excessively bright.
  //
  // sqrt() then changes the brightness/contrast response,
  // making weaker contributions more visible.
  O = sqrt(tanh4(O));


  // ============================================================
  // 17. Output the final pixel colour
  // ============================================================

  // O.rgb = final red, green and blue values.
  //
  // The alpha value is set to 1.0, meaning fully opaque.
  //
  // Areas where no colour was accumulated remain black.
  gl_FragColor = vec4(O.rgb, 1.0);
}