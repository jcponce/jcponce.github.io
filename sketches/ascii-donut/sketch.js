// ============================================================
// ASCII DONUT
// A rotating 3D torus rendered using ASCII characters.
//
// The basic idea:
// 1. Create a mathematical torus in 3D.
// 2. Rotate the torus around two axes.
// 3. Project the 3D points onto the 2D canvas.
// 4. Use a depth buffer to determine which points are visible.
// 5. Calculate lighting for each point.
// 6. Represent the brightness using ASCII characters.
// ============================================================

// Characters ordered from darkest to brightest.
// The character selected for each point depends on its
// calculated lighting value.
const chars = ".,-~:;=!*#$@";


// Rotation angles.
// A controls rotation around the X-axis.
// B controls rotation around the Z-axis.
let A = 0;
let B = 0;


// ------------------------------------------------------------
// TORUS PARAMETERS
// ------------------------------------------------------------
//
// A torus can be thought of as a circle of radius R1
// whose centre moves around a larger circle of radius R2.
//
// R1 = radius of the tube
// R2 = distance from the centre of the torus to the
//      centre of the tube
//
// Increasing R1 makes the tube thicker.
// Increasing R2 makes the hole larger.
//
// K2 controls the distance of the torus from the camera.
//
const R1 = 1;
const R2 = 2;
const K2 = 18;


function setup() {

  // Make the canvas fill the browser window.
  createCanvas(windowWidth, windowHeight);

  // A monospace font is important because every character
  // has approximately the same width.
  textFont("monospace");

  // Characters are positioned by their centre.
  textAlign(CENTER, CENTER);

  noStroke();
}


function draw() {

  background(0);


  // ----------------------------------------------------------
  // ASCII GRID
  // ----------------------------------------------------------
  //
  // Instead of treating every pixel as a possible position,
  // we divide the canvas into a grid of characters.
  //
  // charW and charH approximate the dimensions of one
  // character in the monospace font.
  //
  const charW = 10;
  const charH = 10;

  const cols = floor(width / charW);
  const rows = floor(height / charH);

  textSize(charH);


  // ----------------------------------------------------------
  // OUTPUT BUFFER
  // ----------------------------------------------------------
  //
  // output stores the ASCII character that will eventually
  // be drawn at each position on the screen.
  //
  // Initially every position contains a space.
  //
  const output = Array.from(
    { length: rows },
    () => Array(cols).fill(" ")
  );


  // ----------------------------------------------------------
  // DEPTH BUFFER (Z-BUFFER)
  // ----------------------------------------------------------
  //
  // Several 3D points can project onto the same 2D character
  // position.
  //
  // The zBuffer stores the depth of the point currently
  // visible at each position.
  //
  // This allows us to hide the back of the donut behind
  // the front of the donut.
  //
  const zBuffer = Array.from(
    { length: rows },
    () => Array(cols).fill(-Infinity)
  );


  // ----------------------------------------------------------
  // PRE-COMPUTE ROTATION VALUES
  // ----------------------------------------------------------
  //
  // We use the rotation angles A and B repeatedly, so we
  // calculate their sine and cosine once per frame rather
  // than repeatedly inside the loops.
  //
  const cosA = cos(A);
  const sinA = sin(A);

  const cosB = cos(B);
  const sinB = sin(B);


  // ----------------------------------------------------------
  // PERSPECTIVE SCALE
  // ----------------------------------------------------------
  //
  // K1 determines how large the donut appears on the screen.
  //
  // It is based on the smaller dimension of the window so
  // that the donut remains approximately the same size
  // regardless of the window's aspect ratio.
  //
  const K1 = min(width, height) * 0.2;
  //console.log(K1)


  // ==========================================================
  // GENERATE THE TORUS
  // ==========================================================
  //
  // A torus can be described parametrically using two angles:
  //
  // theta -> goes around the small circular tube
  // phi   -> goes around the large circular ring
  //
  // Both angles range from 0 to 2π.
  //
  for (let theta = 0; theta < TWO_PI; theta += 0.10) {

    const costheta = cos(theta);
    const sintheta = sin(theta);


    for (let phi = 0; phi < TWO_PI; phi += 0.04) {

      const cosphi = cos(phi);
      const sinphi = sin(phi);


      // --------------------------------------------------------
      // TORUS PARAMETRIC EQUATIONS
      // --------------------------------------------------------
      //
      // circlex represents the distance from the z-axis
      // to the current point on the tube.
      //
      // The torus is then described by:
      //
      // x = (R2 + R1 cos θ) cos φ
      // y = (R2 + R1 cos θ) sin φ
      // z = R1 sin θ
      //
      const circlex = R2 + R1 * costheta;

      let x = circlex * cosphi;
      let y = circlex * sinphi;
      let z = R1 * sintheta;


      // --------------------------------------------------------
      // ROTATION AROUND THE X-AXIS
      // --------------------------------------------------------
      //
      // Standard 3D rotation:
      //
      // y' = y cos(A) - z sin(A)
      // z' = y sin(A) + z cos(A)
      //
      let y1 = y * cosA - z * sinA;
      let z1 = y * sinA + z * cosA;


      // --------------------------------------------------------
      // ROTATION AROUND THE Z-AXIS
      // --------------------------------------------------------
      //
      // x' = x cos(B) - y sin(B)
      // y' = x sin(B) + y cos(B)
      //
      let x1 = x * cosB - y1 * sinB;
      let y2 = x * sinB + y1 * cosB;


      // Move the torus away from the camera.
      //
      // This ensures that z1 is positive and allows us to
      // perform the perspective projection below.
      z1 += K2;


      // --------------------------------------------------------
      // PERSPECTIVE PROJECTION
      // --------------------------------------------------------
      //
      // A simple perspective projection is used:
      //
      // screenX = K1 * x / z
      // screenY = K1 * y / z
      //
      // Objects farther away (larger z) appear smaller.
      //
      // We then shift the coordinates so that the donut
      // appears in the centre of the ASCII grid.
      //
      const xp = floor(
        cols / 2 + K1 * x1 / z1
      );

      const yp = floor(
        rows / 2 + K1 * y2 / z1
      );


      // Ignore points that fall outside the ASCII grid.
      if (
        xp < 0 ||
        xp >= cols ||
        yp < 0 ||
        yp >= rows
      ) {
        continue;
      }


      // ========================================================
      // SURFACE NORMAL
      // ========================================================
      //
      // To make the donut look 3D, we need to calculate how
      // strongly each part of its surface is illuminated.
      //
      // The normal vector describes the direction perpendicular
      // to the surface.
      //
      // For a torus:
      //
      // nx = cos(θ) cos(φ)
      // ny = cos(θ) sin(φ)
      // nz = sin(θ)
      //
      let nx = costheta * cosphi;
      let ny = costheta * sinphi;
      let nz = sintheta;


      // --------------------------------------------------------
      // Rotate the normal vector in exactly the same way
      // as the surface point.
      // --------------------------------------------------------

      // Rotation around X
      let ny1 = ny * cosA - nz * sinA;
      let nz1 = ny * sinA + nz * cosA;

      // Rotation around Z
      let nx1 = nx * cosB - ny1 * sinB;
      let ny2 = nx * sinB + ny1 * cosB;


      // ========================================================
      // LIGHTING
      // ========================================================
      //
      // The light direction determines which parts of the
      // donut are bright and which are dark.
      //
      // Here the light comes approximately from:
      //
      //       (1, -1, 1)
      //
      const lx = 0;
      const ly = -1;
      const lz = 1;


      // Length of the light vector.
      //
      // We divide by this value to normalize the vector.
      //
      const lightLength = sqrt(
        lx * lx +
        ly * ly +
        lz * lz
      );


      // --------------------------------------------------------
      // DOT PRODUCT
      // --------------------------------------------------------
      //
      // The dot product between the surface normal and the
      // light direction tells us how directly the surface
      // faces the light.
      //
      // Values near 1  -> facing the light
      // Values near 0  -> perpendicular to the light
      // Values below 0 -> facing away from the light
      //
      // max(0, ...) removes negative lighting values.
      //
      const lightValue = max(
        0,
        (
          nx1 * lx +
          ny2 * ly +
          nz1 * lz
        ) / lightLength
      );


      // ========================================================
      // DEPTH TEST
      // ========================================================
      //
      // Multiple points on the torus may project to the same
      // character position.
      //
      // We keep the point that is closest to the camera.
      //
      if (z1 > zBuffer[yp][xp]) {

        zBuffer[yp][xp] = z1;


        // ------------------------------------------------------
        // CONVERT LIGHTING TO AN ASCII CHARACTER
        // ------------------------------------------------------
        //
        // lightValue is approximately between 0 and 1.
        //
        // We map that value onto the character string:
        //
        //   dark                         bright
        //    |                              |
        //    . , - ~ : ; = ! * # $ @
        //

        let index;

        if (lightValue > 0.97) {
          index = chars.length - 1;
        } else {
          index = floor(
            lightValue / 0.97 * (chars.length - 1)
          );
        }

        output[yp][xp] = chars[index];
      }
    }
  }


  // ==========================================================
  // DRAW THE ASCII IMAGE
  // ==========================================================
  //
  // Once all 3D points have been processed, output contains
  // the final ASCII representation of the donut.
  //
  fill(255);

  for (let y = 0; y < rows; y++) {

    for (let x = 0; x < cols; x++) {

      text(
        output[y][x],

        // Convert ASCII-grid coordinates to canvas coordinates.
        x * charW + charW / 2,
        y * charH + charH / 2
      );
    }
  }


  // ==========================================================
  // ANIMATION
  // ==========================================================
  //
  // Increase the rotation angles slightly every frame.
  //
  // Smaller values produce slower, smoother rotation.
  //
  A += 0.006;
  B += 0.002;
}


// ============================================================
// RESPONSIVE CANVAS
// ============================================================
//
// When the browser window is resized, resize the p5.js canvas
// so that the ASCII donut continues to fill the window.
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
