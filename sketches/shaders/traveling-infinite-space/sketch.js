/*
 Original code by Steven C. Dollins
 Infinite Fun Space:
 https://infinitefunspace.com/p5/fly/
*/


let nS = 64, N = nS*nS*nS;

let seed;
let space;
let dust;
let ship;
let t = 0;
let bNoise = true;
let bLayers = false;
let bShowText = false;
let bSaveFrame = false;
let fr=60;
let vertFlip = 1;
let textBox;


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //space = createFramebuffer({ format: FLOAT });
  //space.begin();
  dust = createShader(vs, fs);
  seed = random(1<<24);
  noStroke();
  camera( 0, 0, 2.2,  0, 0, 0,  0, 1, 0 );
  //space.end();
  ship = new Ship();
  textBox = createGraphics( 160, 64 );
  textBox.textSize(16);
}

class Quat {
  constructor( axis, ang ) { 
    this.v = p5.Vector.mult( axis, sin( ang*0.5 )/axis.mag() );
    this.w = cos( ang*0.5 );
  }
  normalize() {
    let s = 1.0/sqrt( this.v.magSq() + this.w*this.w );
    this.v.mult( s );
    this.w *= s;
    return this;
  }
  rotate( p ) {
    // ( w*w - dot( v, v )) * p + 2 * dot( p, v ) * v + 2 * w * cross( v, p )
    return p5.Vector.mult( p, this.w*this.w - this.v.dot(this.v) )
      .add( p5.Vector.mult( this.v, 2 * p.dot(this.v) ) )
      .add( p5.Vector.mult( this.v, 2 * this.w ).cross( p ) );
  }
  unrotate( p ) {
    // ( w*w - dot( v, v )) * p + 2 * dot( p, v ) * v - 2 * w * cross( v, p )
    return p5.Vector.mult( p, this.w*this.w - this.v.dot(this.v) )
      .add( p5.Vector.mult( this.v, 2 * p.dot(this.v) ) )
      .sub( p5.Vector.mult( this.v, 2 * this.w ).cross( p ) );
  }
  rotateBy( q ) {
    let t = this.w*q.w - this.v.dot( q.v );
    this.v = q.v.cross( this.v )
      .add( p5.Vector.mult( this.v, q.w ) )
      .add( p5.Vector.mult( q.v, this.w ) );
    this.w = t;
    this.normalize();
    return this;
  }
}

class Ship {
  constructor() {
    this.speed = 0.01;
    this.pos = createVector( 0, 0, 0 );
    this.vel = createVector( 0, 0, 0 );
    this.rot = new Quat( p5.Vector.random3D(), random(TAU) );
    this.angVel = createVector( 0, 0, 0 );
  }
  move( dt ) {
    const SIDE_THRUST = 0.0003;
    const BACK_THRUST = 0.0012;
    const FORE_THRUST = 0.0006;
    this.speed += (keyIsDown(87) - keyIsDown(83)) * 0.02 * dt;
    let turn = createVector( 
      vertFlip*(keyIsDown( DOWN_ARROW )-keyIsDown( UP_ARROW )),
      keyIsDown( LEFT_ARROW )-keyIsDown( RIGHT_ARROW ), 
      keyIsDown( 68 )-keyIsDown( 65 ) );
    if ( document.pointerLockElement === canvas || touches.length > 0 ) {
      turn.add(createVector(movedY, -movedX).mult(0.25));
    }
    if( turn.magSq() > 0 ) {
      this.angVel.add( this.rot.rotate( turn.mult(dt) ) );
    }
    if( this.angVel.magSq() > 0 ) {
      this.rot.rotateBy( new Quat( this.angVel, this.angVel.mag() * dt ) );
      this.angVel.mult( pow(0.25, dt) );
    }

    let lclVel = this.rot.unrotate( this.vel );
    lclVel.x += ( lclVel.x < -SIDE_THRUST ) ? SIDE_THRUST :
      ( lclVel.x > SIDE_THRUST ) ? -SIDE_THRUST : -lclVel.x;
    lclVel.y += ( lclVel.y < -SIDE_THRUST ) ? SIDE_THRUST :
      ( lclVel.y > SIDE_THRUST ) ? -SIDE_THRUST: -lclVel.y;
    lclVel.z += ( lclVel.z > -this.speed+BACK_THRUST ) ? -BACK_THRUST :
      ( lclVel.z < -this.speed-FORE_THRUST ) ? FORE_THRUST :
      -lclVel.z - this.speed;
    this.vel = this.rot.rotate( lclVel );
    
    this.pos.add( p5.Vector.mult( this.vel, dt ) );
    this.pos.x = this.pos.x % 1;
    this.pos.y = this.pos.y % 1;
    this.pos.z = this.pos.z % 1;
  }
  setCamera() {
    let back = this.rot.rotate( createVector( 0, 0, 1 ) );
    let up = this.rot.rotate( createVector( 0, 1, 0 ) );
    camera( this.pos.x, this.pos.y, this.pos.z,
            this.pos.x-back.x, this.pos.y-back.y, this.pos.z-back.z,
            up.x, up.y, up.z );
    perspective( PI/3, width/height, 0.001, 10 );
    pointLight( 255, 255, 255, this.pos.x, this.pos.y, this.pos.z );
  }
}


function draw() {
  let dt = deltaTime / 1000;
  t += dt;
//  space.begin();
  ship.move( dt );
  ship.setCamera();
  background(0);
  dust.bindShader();
  dust.setUniform('seed', seed);
  dust.setUniform('bNoise', bNoise);
  dust.setUniform('bLayers', bLayers);
  dust.setUniform('N', floor(N));
  dust.setUniform( 'time', t );
  let gl = this._renderer.GL;
  gl.drawArrays( gl.TRIANGLES, 0, floor(N)*3 );
  dust.unbindShader();
//  space.end();
//  image( space, -width/3, -height/3 );

  fr = (frameRate()+59*fr)/60;
  if( bShowText ) {
    camera();
    perspective();
    gl.disable( gl.DEPTH_TEST );
    fill(64, 192);
    stroke( 255 );
    translate( 10-width/2, 10-height/2 );
    rect( 0, 0, 160, 64 );
    textBox.background(0,0);
    textBox.clear();
    textBox.fill( 255 );
    textBox.noStroke();
    textBox.text( 'N: '+floor(N)+ ' ('+nS+')', 8, 20 );
    textBox.text( 'fps: '+nf( fr, 0, 2 ), 8, 38 );
    textBox.text( 'spd: '+nf( 100*ship.speed, 0, 2 ), 8, 56 );
    image( textBox, 0, 0 );
    gl.enable( gl.DEPTH_TEST );
  }
}

function keyPressed() {
  if( keyCode == ENTER ) {
    seed = random(1<<24);
  } else if( key === 't' ) {
    bShowText = !bShowText;
  } else if( key === '[' ) {
    nS = max(2, nS-2);  N = nS*nS*nS;
  } else if( key === ']' ) {
    nS += 2;  N = nS*nS*nS;
  } else if( key === 'n' ) {
    bNoise = !bNoise;
  } else if( key === 'l' ) {
    bLayers = !bLayers;
  } else if( key === '/' ) {
    vertFlip = -vertFlip;
  }
}

function windowResized() {
  resizeCanvas( windowWidth, windowHeight );
}

function mousePressed() {
  if ( document.pointerLockElement === canvas ) {
     exitPointerLock();
  } else {
    requestPointerLock();
  }
}

function mouseWheel( e ) {
  ship.speed -= e.delta / 32768;
}

let vs = `#version 300 es
precision highp float;
precision highp int;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float seed;
uniform bool bNoise;
uniform bool bLayers;
uniform float N;
uniform float time;

out vec3 vColor;
out vec2 vTexCoord;
out float u;
out vec3 center;
out float radius;
out vec3 ray;
out vec4 orient;
out mat3 c2o;

#define TAU 6.283185307179586
#define PHI 0.618033988749895
#define S3 1.732050807568877


float sn( float t ) { return sin( TAU * t ); }
float cs( float t ) { return cos( TAU * t ); }
float snn( float t ) { return 0.5+0.5*sin( TAU * t ); }
float csn( float t ) { return 0.5+0.5*cos( TAU * t ); }

vec2 rot( in vec2 p, float a ) {
  return cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

vec3 erot( vec3 p, vec3 ax, float ro ) {
  return mix( dot( ax, p ) * ax, p, cos( ro ) ) + sin( ro ) * cross( ax, p );
}

vec3 hsb2rgb( in vec3 c ) {
   vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,  0.0,  1.0 );
   rgb = rgb*rgb*(3.0-2.0*rgb);
   return c.z * mix( vec3(1.0), rgb, c.y);
}

// http://www.jcgt.org/published/0009/03/02/
// https://www.shadertoy.com/view/XlGcRh
uvec4 pcg4d( uvec4 v ) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y*v.w;  v.y += v.z*v.x;  v.z += v.x*v.y;  v.w += v.y*v.z;
  v ^= v >> 16u;
  v.x += v.y*v.w;  v.y += v.z*v.x;  v.z += v.x*v.y;  v.w += v.y*v.z;
  return v;
}
vec4 pcg4df( int a, int b, int c, int d ) {
  return vec4((pcg4d( uvec4( a, b, c, d ) ) >> 8)) / float( 1<<24 );
}

vec3 randomPointOnUnitSphere( vec2 rnd ) {
  float a = TAU * rnd.x;
  float z = 2. * rnd.y - 1.;
  return vec3( sqrt( max( 1.-z*z, 0. ) ) * vec2( cos(a), sin(a) ), z );
}

vec3 randomPointInUnitSphere( vec3 rnd ) {
  float r = pow( rnd.z, 1./3. );
  return randomPointOnUnitSphere( rnd.xy ) * r;
}


// psrdnoise (c) Stefan Gustavson and Ian McEwan,
// ver. 2021-12-02, published under the MIT license:
// https://github.com/stegu/psrdnoise/

vec4 permute(vec4 i) {
     vec4 im = mod(i, 289.0);
     return mod(((im*34.0)+10.0)*im, 289.0);
}

float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient)
{
  const mat3 M = mat3(0.0, 1.0, 1.0, 1.0, 0.0, 1.0,  1.0, 1.0, 0.0);
  const mat3 Mi = mat3(-0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5,-0.5);
  vec3 uvw = M * x;
  vec3 i0 = floor(uvw), f0 = fract(uvw);
  vec3 g_ = step(f0.xyx, f0.yzz), l_ = 1.0 - g_;
  vec3 g = vec3(l_.z, g_.xy), l = vec3(l_.xy, g_.z);
  vec3 o1 = min( g, l ), o2 = max( g, l );
  vec3 i1 = i0 + o1, i2 = i0 + o2, i3 = i0 + vec3(1.0);
  vec3 v0 = Mi * i0, v1 = Mi * i1, v2 = Mi * i2, v3 = Mi * i3;
  vec3 x0 = x - v0, x1 = x - v1, x2 = x - v2, x3 = x - v3;
  if(any(greaterThan(period, vec3(0.0)))) {
    vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
    vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
    vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
  if(period.x > 0.0) vx = mod(vx, period.x);
  if(period.y > 0.0) vy = mod(vy, period.y);
  if(period.z > 0.0) vz = mod(vz, period.z);
  i0 = floor(M * vec3(vx.x, vy.x, vz.x) + 0.5);
  i1 = floor(M * vec3(vx.y, vy.y, vz.y) + 0.5);
  i2 = floor(M * vec3(vx.z, vy.z, vz.z) + 0.5);
  i3 = floor(M * vec3(vx.w, vy.w, vz.w) + 0.5);
  }
  vec4 hash = permute( permute( permute( 
              vec4(i0.z, i1.z, i2.z, i3.z ))
            + vec4(i0.y, i1.y, i2.y, i3.y ))
            + vec4(i0.x, i1.x, i2.x, i3.x ));
  vec4 theta = hash * 3.883222077;
  vec4 sz = hash * -0.006920415 + 0.996539792;
  vec4 psi = hash * 0.108705628;
  vec4 Ct = cos(theta), St = sin(theta);
  vec4 sz_prime = sqrt( 1.0 - sz*sz );
  vec4 gx, gy, gz;
  if(alpha != 0.0) {
    vec4 px = Ct * sz_prime, py = St * sz_prime, pz = sz;
    vec4 Sp = sin(psi), Cp = cos(psi), Ctp = St*Sp - Ct*Cp;
    vec4 qx = mix( Ctp*St, Sp, sz), qy = mix(-Ctp*Ct, Cp, sz);
    vec4 qz = -(py*Cp + px*Sp);
    vec4 Sa = vec4(sin(alpha)), Ca = vec4(cos(alpha));
    gx = Ca*px + Sa*qx; gy = Ca*py + Sa*qy; gz = Ca*pz + Sa*qz;
  }
  else {
    gx = Ct * sz_prime; gy = St * sz_prime; gz = sz;  
  }
  vec3 g0 = vec3(gx.x, gy.x, gz.x), g1 = vec3(gx.y, gy.y, gz.y);
  vec3 g2 = vec3(gx.z, gy.z, gz.z), g3 = vec3(gx.w, gy.w, gz.w);
  vec4 w = 0.5-vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
  w = max(w, 0.0); vec4 w2 = w * w, w3 = w2 * w;
  vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));
  float n = dot(w3, gdotx);
  vec4 dw = -6.0 * w2 * gdotx;
  vec3 dn0 = w3.x * g0 + dw.x * x0;
  vec3 dn1 = w3.y * g1 + dw.y * x1;
  vec3 dn2 = w3.z * g2 + dw.z * x2;
  vec3 dn3 = w3.w * g3 + dw.w * x3;
  gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);
  return 39.5 * n;
}


struct Ball {
  vec3 pos;
  vec3 col;
  vec4 rot;
  float rad;
};

vec3 oldpnoise( float seed, vec3 x, vec3 prd, float a ) {
  vec3 grd;
  return vec3(
    psrdnoise(prd*(x+vec3(mod(seed/65536.,256.),0.,0.)), prd, a, grd),
    psrdnoise(prd*(x+vec3(0.,mod(seed/256.,256.),0.)), prd, a, grd),
    psrdnoise(prd*(x+vec3(0.,0.,mod(seed,256.))), prd, a, grd)
  );
}

vec3 pnoise( float seed, vec3 x, vec3 prd, float a ) {
  vec3 grd;
  vec3 offs = vec3( mod(seed/65536.,256.), mod(seed/256.,256.), mod(seed,256.) );
  float t = psrdnoise( prd*(x+offs), prd, a, grd );
  return grd;
}

Ball randomBox( int idx, float time, vec3 camPos ) {
  Ball b;
  vec4 rnd0 = pcg4df( int(seed), idx, 752, 7254 );
  vec4 rnd1 = pcg4df( int(seed), idx, 6235, 52 );
  vec4 rndr = pcg4df( int(seed), idx, 237, 1064 );
  b.rot = vec4( randomPointOnUnitSphere(rndr.xy), rndr.z+0.3*pow(rndr.w,1.)*time );
  b.rad = 0.018*(1.+7.*pow(rnd0.w,24.)) / pow(N, 1./3.);
  u = float(idx)/N;
  int ns = int(pow(N, 1./3.));
  b.pos = rnd0.xyz;
  if( bLayers ) { b.pos.z = floor(b.pos.z*8.)/8.; }
  //b.pos = vec3( float(idx/ns/ns), float((idx/ns)%ns), float(idx%ns))+0.*rnd0.xyz+vec3(0.5);
  //b.pos /= float(ns);
  if( bNoise ) {
    float swirltime = 0.02*time;
    b.pos += 0.03125*( 0.
      //+ pnoise( seed, b.pos, vec3(2.), swirltime )
      + pnoise( seed+1436., b.pos.yzx, vec3(4.), 2.03*swirltime )*0.5
      //+ pnoise( seed+61234., b.pos.zyx, vec3(8.), 3.95*swirltime )*0.25
      //+ pnoise( seed+6134., b.pos.zyx, vec3(16.), 7.97*swirltime )*0.125
      );
  } else {
    vec3 vel = 0.002*randomPointInUnitSphere( rnd1.xyz );
    b.pos += time * vel;
  }
  b.pos = fract( b.pos - camPos + vec3(0.5) ) - vec3(0.5);
  float fadeIn = smoothstep( 0., 0.05, 0.5-length( b.pos ) );
  b.rad *= fadeIn;
  b.pos += camPos;
  vec4 rndc = pcg4df( int(seed), idx, 28634, 5683 );
  b.col = vec3(.5) + 0.5*rndc.rgb;
  b.col *= fadeIn;
  return b;
}

const vec2 vpos[3] = vec2[]( vec2(0., 2.), vec2(-S3, -1.), vec2(S3, -1.) );

void main() {
  int iTri = gl_VertexID / 3;
  int iVert = gl_VertexID % 3;
  vec3 camPos = -uModelViewMatrix[3].xyz * mat3(uModelViewMatrix);
  Ball b = randomBox( iTri, time, camPos );
  center = (uModelViewMatrix * vec4( b.pos, 1. )).xyz;
  vec3 xBasis = normalize( cross( center, vec3( 0, 1, 0 ) ) );
  vec3 yBasis = normalize( cross( xBasis, center ) );
  float l = length( center );
  float s = l * b.rad / sqrt( l * l - b.rad * b.rad );
  vec4 position = vec4( center + xBasis*s*vpos[iVert].x + yBasis*s*vpos[iVert].y, 1. );
  position.xyz *= (l-b.rad)/l;  // put the triangle in front of the sphere
  radius = b.rad;
  ray = position.xyz;
  orient = b.rot;
  c2o = transpose( mat3( uModelViewMatrix ) );
  gl_Position = uProjectionMatrix * position;
  b.col *= 7.5/(pow(12.*center.z,2.)+6.);
  vColor = b.col;
 }
`;


let fs = `#version 300 es
precision highp float;
precision highp int;
uniform mat4 uProjectionMatrix;
in vec3 vColor;
in float u;
in vec3 center;
in vec3 ray;
in float radius;
in mat3 c2o;
in vec4 orient;
out vec4 fragColor;

#define TAU 6.283185307179586
#define S3 1.732050807568877

vec2 rot( in vec2 p, float a ) {
  return cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

vec3 erot( vec3 p, vec3 ax, float ro ) {
  return mix( dot( ax, p ) * ax, p, cos( ro ) ) + sin( ro ) * cross( ax, p );
}

float sphereDist( vec3 eray, vec3 cen, float rad ) {
  float a = dot( eray, eray );
  float half_b = dot( cen, eray );
  float c = dot( cen, cen ) - rad*rad;
  float discriminant = half_b*half_b - a*c;
  return (discriminant < 0.0) ? -1.0 : (half_b - sqrt(discriminant)) / a;
}

float sdBox( vec3 p, vec3 b ) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdTorus( vec3 p, vec2 r ) {
  vec2 q = vec2( length(p.xy) - r.x, p.z );
  return length(q) - r.y;
}

float sdSqTwist( vec3 p, vec2 r ) {
  vec2 q = vec2( length(p.xy) - r.x, p.z );
  q = rot( q, floor(u*50.)*0.25*atan(p.y,p.x) );
  vec2 d = abs(q)-r.yy;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float getDist( vec3 p ) {
  p = erot(c2o*(p-center), orient.xyz, TAU*orient.w);
  vec3 q = p*10000.0;
  return (u < 0.4) ? (u < 0.1) ? 
    sdSqTwist( p, radius * vec2(0.7, 0.2) ) : 
    sdTorus( p, radius * vec2( 0.64, 0.35 ) ) : (u< 0.7) ?
    sdBox( p, vec3( radius/S3)*(0.96+0.03*sin(q.x)*sin(q.y)*sin(q.z)) ) :
    length(p)-radius*(0.97+0.02*sin(q.x)*sin(q.y)*sin(q.z));
}

vec3 getNormal( vec3 p ) {
  vec2 eps = vec2( 1.0e-6, 0. );
  float d = getDist( p );
  vec3 n = d - vec3( getDist(p-eps.xyy), getDist(p-eps.yxy), getDist(p-eps.yyx) );
  return normalize( n );
}

void main() {
  vec3 col = vColor;
  float t = sphereDist( ray, center, radius );
  if( t < 0. ) discard;

  vec3 rd = normalize(ray);
  float far = length(center) + radius;
  t = 0.;
  vec3 p;
  for( int i=0; i<80; i++ ) {
    p = rd * t;
    float d = getDist(p);
    t += d;
    if( d < 1.0e-6 ) break;
    if( t > far ) discard;
  }
  p = rd * t;
  vec3 n = getNormal( p );
  float dif = clamp( dot( n, -rd ), 0., 1. );
  col *= dif;
  
  vec4 clip = uProjectionMatrix * vec4( p, 1. );
  gl_FragDepth = (clip.z / clip.w + 1.0) * 0.5;
  fragColor = vec4( col, 1. );
}

//void main() {
//  vec3 col = vColor;
//  float t = sphereDist( ray, center, radius );
//  if( t < 0. ) discard;
//  vec3 p = ray * t;
//  vec3 n = normalize( p - center );
//  float bri = -dot( normalize( ray ), n );
//  n = c2o * n;
//  n = erot( n, orient.xyz, TAU*orient.w );
//  if( u < 0.9 ) {
//    vec3 v = 8192.*radius*n;
//    float g = (sin(v.x)*cos(v.y)+sin(v.y)*cos(v.z)+cos(v.x)*sin(v.z))/(1.+u);
//    if( u < 0.1 ) g = abs(g);
//    else if( u < 0.2 ) g = 1.-abs(g);
//    col = mix( col, 0.75*col.gbr, clamp(1.-g, 0., 1.) )*0.75;
//  } else { 
//    vec3 c = vec3(0.6) + 0.4*fract( 1024.*radius * n );
//    col *= c; 
//  }
//  col *= bri;
//  vec4 clip = uProjectionMatrix * vec4( p, 1. );
//  gl_FragDepth = (clip.z / clip.w + 1.0) * 0.5;
//  fragColor = vec4( col, 1. );
//}
`;