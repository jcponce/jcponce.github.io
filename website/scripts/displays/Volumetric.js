/** Volumetric.js - Visualisation of volumetric data for Three.js
 *
 * Copyright (C) 2017 The University of Queensland
 * Written by Isaac Lenton (aka ilent2)
 * Influenced by the waveguide visualisation by Samuel Peet.
 */

/** Create a new volumetric rendering object.
 *
 * @param resxm, resym, reszm : Maximum resolutions needed for texture buffer
 *    Note, the aspect ratio is important too, so we can't change
 *    the resolution aspect ratio latter either.  Perhaps there is a
 *    nicer way to do this.
 */
function Volumetric(width, height, depth, resxm, resym, reszm) {

  this.type = 'Volumetric';

  this.width = width;
  this.height = height;
  this.depth = depth;

  this.resx = resxm;
  this.resy = resym;
  this.resz = reszm;
  this.resi = 10;

  // The function used to calculate the volume (should be overridden)
  this.integrate = function(org, ray, dist, steps) {
    return [255, 255, 255, 255];
  };

  this.textureData = [
    new Uint8Array(4 * this.resx * this.resy),
    new Uint8Array(4 * this.resx * this.resz),
    new Uint8Array(4 * this.resy * this.resz)];

  this.atextureData = [
    new Uint8Array(4 * this.resx * this.resy),
    new Uint8Array(4 * this.resx * this.resz),
    new Uint8Array(4 * this.resy * this.resz)];

  this.material = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial()];

  this.createTextures();

  this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
  THREE.Mesh.call(this, this.geometry, this.material);
}

Volumetric.prototype = Object.create(THREE.Mesh.prototype);
Volumetric.prototype.constructor = Volumetric;

Volumetric.prototype.getMesh = function() {
  return this.mesh;
}

Volumetric.prototype.createTextures = function() {

  this.texture = [
    new THREE.DataTexture(this.textureData[0], this.resy, this.resx,
        THREE.RGBAFormat),
    new THREE.DataTexture(this.textureData[1], this.resx, this.resz,
        THREE.RGBAFormat),
    new THREE.DataTexture(this.textureData[2], this.resz, this.resy,
        THREE.RGBAFormat)];

  this.atexture = [
    new THREE.DataTexture(this.atextureData[0], this.resy, this.resx,
        THREE.RGBAFormat),
    new THREE.DataTexture(this.atextureData[1], this.resx, this.resz,
        THREE.RGBAFormat),
    new THREE.DataTexture(this.atextureData[2], this.resz, this.resy,
        THREE.RGBAFormat)];

  this.material[0].map = this.texture[2];
  this.material[0].alphaMap = this.atexture[2];
  this.material[1].map = this.texture[2];
  this.material[1].alphaMap = this.atexture[2];
  this.material[2].map = this.texture[1];
  this.material[2].alphaMap = this.atexture[1];
  this.material[3].map = this.texture[1];
  this.material[3].alphaMap = this.atexture[1];
  this.material[4].map = this.texture[0];
  this.material[4].alphaMap = this.atexture[0];
  this.material[5].map = this.texture[0];
  this.material[5].alphaMap = this.atexture[0];

  for (var i = 0; i < 6; ++i) {
    this.material[i].needsUpdate = true;
  }
}

Volumetric.prototype.setResolution = function(x, y, z, i) {
  this.resx = x;
  this.resy = y;
  this.resz = z;
  this.resi = i;

  this.textureData[0].length = 4*this.resx*this.resy;
  this.textureData[1].length = 4*this.resx*this.resz;
  this.textureData[2].length = 4*this.resy*this.resz;

  this.atextureData[0].length = 4*this.resx*this.resy;
  this.atextureData[1].length = 4*this.resx*this.resz;
  this.atextureData[2].length = 4*this.resy*this.resz;

  this.createTextures();
}

/** Calculate the ray to be traced from the camera to the object. */
Volumetric.prototype.calculateRay = function(camera, loc) {

  if (camera.isOrthographicCamera) {
    return camera.position.clone().negate();
  } else if (camera.isPerspectiveCamera) {
    return loc.clone().addScaledVector(camera.position, -1);
  } else {
    console.log("Error: Unknown camera type.");
    return new THREE.Vector3(0.0, 0.0, 1.0);
  }
}

/** Efficent algorithm for computing the collision of a ray
 * with an Axis Aligned Bounding Box (AABB).
 *
 * From waveguide3.js (Samuel Peet, 2015).
 */
Volumetric.prototype.checkIntersect = function(origin, direction) {

  var X0, Y0, Z0, X1, Y1, Z1;

  X0 = -this.width * 0.5;
  Y0 = -this.height * 0.5;
  Z0 = -this.depth * 0.5;
  X1 = this.width * 0.5;
  Y1 = this.height * 0.5;
  Z1 = this.depth * 0.5;

  // direction is unit direction vector of ray
  var dirfracX = 1.0 / direction.x;
  var dirfracY = 1.0 / direction.y;
  var dirfracZ = 1.0 / direction.z;

  // (X0, Y0, Z0) is the corner of AABB with minimal
  // coordinates, (X1, Y1, Z1) is maximal corner
  var t1 = (X0 - origin.x) * dirfracX;
  var t2 = (X1 - origin.x) * dirfracX;
  var t3 = (Y0 - origin.y) * dirfracY;
  var t4 = (Y1 - origin.y) * dirfracY;
  var t5 = (Z0 - origin.z) * dirfracZ;
  var t6 = (Z1 - origin.z) * dirfracZ;
  var tmin = Math.max(Math.max(Math.min(t1, t2),
      Math.min(t3, t4)), Math.min(t5, t6));
  var tmax = Math.min(Math.min(Math.max(t1, t2),
      Math.max(t3, t4)), Math.max(t5, t6));

  // if tmax < 0, ray is intersecting AABB, but whole AABB is behind us
  if (tmax < 0) {
    //t = tmax;
    return [false, tmin, tmax];
  }
  // if tmin > tmax, ray doesn't intersect AABB
  if (tmin > tmax) {
    return [false, tmin, tmax];
  }

  return [true, tmin, tmax];
};

/** Update the texture for a particular axis. */
Volumetric.prototype.updatePlane = function(camera, texid,
    res0, res1, org, sca0, sca1) {

  for (var i = 0; i < res0; ++i) {
    for (var j = 0; j < res1; ++j) {
      var x = (i + 0.5)/res0 - 0.5;
      var y = (j + 0.5)/res1 - 0.5;

      // Calculate the location of the pixel we are updating
      var loc0 = org.clone().addScaledVector(sca0, x).addScaledVector(sca1, y);

      // Calculate the ray we want to cast for this pixel
      var ray = this.calculateRay(camera, loc0).normalize();

      // Calculate the location of the two intersections
      var res = this.checkIntersect(loc0.clone().addScaledVector(ray,-1), ray);

      // Integrate the density function to get a colour and alpha value
      var value = this.integrate(loc0, ray, res[2]-res[1], this.resi);

      // Store the result in the textures
      this.textureData[texid][i*res1*4 + j*4 + 0] = value[0];
      this.textureData[texid][i*res1*4 + j*4 + 1] = value[1];
      this.textureData[texid][i*res1*4 + j*4 + 2] = value[2];
      this.textureData[texid][i*res1*4 + j*4 + 3] = 255;
      this.atextureData[texid][i*res1*4 + j*4 + 0] = value[3];
      this.atextureData[texid][i*res1*4 + j*4 + 1] = value[3];
      this.atextureData[texid][i*res1*4 + j*4 + 2] = value[3];
      this.atextureData[texid][i*res1*4 + j*4 + 3] = value[3];
    }
  }

  this.texture[texid].needsUpdate = true;
  this.atexture[texid].needsUpdate = true;
}

/** Update the textures for the current camera view. */
Volumetric.prototype.update = function(camera) {

  var x = this.width/2, y = this.height/2, z = this.depth/2;

  if (camera.position.x > 0) {
    this.updatePlane(camera, 2, this.resy, this.resz,
        new THREE.Vector3(x, 0, 0), new THREE.Vector3(0, this.height, 0),
        new THREE.Vector3(0, 0, -this.depth));
  } else {
    this.updatePlane(camera, 2, this.resy, this.resz,
        new THREE.Vector3(-x, 0, 0), new THREE.Vector3(0, this.height, 0),
        new THREE.Vector3(0, 0, this.depth));
  }

  if (camera.position.y > 0) {
    this.updatePlane(camera, 1, this.resz, this.resx,
        new THREE.Vector3(0, y, 0), new THREE.Vector3(0, 0, -this.depth),
        new THREE.Vector3(this.width, 0, 0));
  } else {
    this.updatePlane(camera, 1, this.resz, this.resx,
        new THREE.Vector3(0, -y, 0), new THREE.Vector3(0, 0, this.depth),
        new THREE.Vector3(this.width, 0, 0));
  }

  if (camera.position.z > 0) {
    this.updatePlane(camera, 0, this.resy, this.resx,
        new THREE.Vector3(0, 0, z), new THREE.Vector3(0, this.height, 0),
        new THREE.Vector3(this.width, 0, 0));
  } else {
    this.updatePlane(camera, 0, this.resy, this.resx,
        new THREE.Vector3(0, 0, -z), new THREE.Vector3(0, this.height, 0),
        new THREE.Vector3(-this.width, 0, 0));
  }
}

