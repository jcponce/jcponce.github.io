// Source: Real-Time Fluid Dynamics for Games by Jos Stam - http://www.intpowertechcorp.com/GDC03.pdf

var N = 128;
var size;
var u = [];
var v = [];
var u_prev = [];
var v_prev = [];
var dens = [];
var dens_prev = [];
var om = [];
var source = 10;
var diff = 0.0;
var visc = 0.0;
var dt = 0.01;
var dx = 1.0;
var vc = 5.0;

function IX( i = 0, j = 0 ) {
  return i + (N + 2) * j;
}

function PX( x = 0, y = 0 ) {
  return (x + width * y) * 4;
}

function normalize(x, y) {
	var length = sqrt(x*x + y*y)+1e-5;
	x = x / length;
	y = y / length;
}

function setup() {
  createCanvas(windowWidth, 400);
  pixelDensity(1);
  background(0);
  stroke(255,0,0);
  initSim();
}

function initSim() {
  size = (N + 2) * (N + 2);
  for (var i = 0; i < size; i++) {
    u[i] = 0.0;
    v[i] = 0.0;
    dens[i] = 0.0;
		om[i] = 0.0;
  }
}

function draw() {
  background(0);
  dens_prev = dens.slice();
  u_prev = u.slice();
  v_prev = v.slice();
  add_density();
  add_velocity();
  vel_step();
  dens_step();
	vort_step();
	//drawVelocity();
  drawDensity();
	drawVorticity();
}

function add_density() {
  if (mouseIsPressed) {
    dens[IX(int( (N / width) * mouseX ), int( (N / height) * mouseY ))] += source;
    dens[IX(int( (N / width) * mouseX - 1), int( (N / height) * mouseY ))] += source / 2;
    dens[IX(int( (N / width) * mouseX + 1), int( (N / height) * mouseY ))] += source / 2;
    dens[IX(int( (N / width) * mouseX), int( (N / height) * mouseY - 1))] += source / 2;
    dens[IX(int( (N / width) * mouseX), int( (N / height) * mouseY + 1))] += source / 2;
  }
	dens[IX(N/2,N-3)] += source/4;
}

function add_velocity() {
  var i;
  if (mouseIsPressed) {
    i = IX(int( (N / width) * mouseX ), int( (N / height) * mouseY ));
    var xv = (N / width) * (mouseX - pmouseX);
    var yv = (N / height) * (mouseY - pmouseY);
    u[i] += xv * (2 / (abs(xv) + 1)) * 15;
    v[i] += yv * (2 / (abs(yv) + 1)) * 15;
  }
	v[IX(N/2,N-3)] -= source/4;
}

function calc_vorticity(om0, u0, v0) {
	for ( var i=1 ; i<=N ; i++ ) {
      for ( var j=1 ; j<=N ; j++ ) {
				om0[IX(i,j)] = (u0[IX(i,j+1)] - u0[IX(i,j-1)]) / dx - (v0[IX(i+1,j)] - v0[IX(i-1,j)]) / dx;
			}
	}
	set_bnd ( 1, om0 );
}

function confine_vorticity(om0, u0, v0) {
	var omgrad_x, omgrad_y;
	for ( var i=1 ; i<=N ; i++ ) {
      for ( var j=1 ; j<=N ; j++ ) {
				omgrad_x = abs(om0[IX(i-1,j)]) - abs(om0[IX(i+1,j)]);
				omgrad_y = abs(om0[IX(i,j-1)]) - abs(om0[IX(i,j+1)]);
				normalize(omgrad_x, omgrad_y);
				u0[IX(i,j)] += omgrad_y * om0[IX(i,j)] * vc * dt;
				v0[IX(i,j)] += -omgrad_x * om0[IX(i,j)] * vc * dt;
			}
	}
}

function diffuse( b, x, x0, diff0 ) {
  var a = dt * diff0 * N * N;
  for ( var k=0 ; k<20 ; k++ ) {
    for ( var i=1 ; i<=N ; i++ ) {
      for ( var j=1 ; j<=N ; j++ ) {
        x[IX(i,j)] = ( x0[IX(i,j)] + a * (x[IX(i-1,j)] + x[IX(i+1,j)] + x[IX(i,j-1)] + x[IX(i,j+1)]) ) / (1 + 4 * a);
      }
    }
    set_bnd ( b, x );
  }
}

function advect( b, d, d0, u0, v0 ) {
  var i0, j0, i1, j1;
  var x, y, s0, t0, s1, t1, dt0;
  dt0 = dt * N;
  for ( var i=1 ; i<=N ; i++ ) {
    for ( var j=1 ; j<=N ; j++ ) {
      x = i - dt0 * u0[IX(i,j)];
      y = j - dt0 * v0[IX(i,j)];
      if (x < 0.5) x = 0.5;
      if (x > N + 0.5) x = N + 0.5;
      i0 = int(x);
      i1 = i0+1;
      if (y < 0.5) y = 0.5;
      if (y > N + 0.5) y = N + 0.5;
      j0 = int(y);
      j1 = j0 + 1;
      s1 = x - i0;
      s0 = 1 - s1;
      t1 = y - j0;
      t0 = 1 - t1;
      d[IX(i,j)] = s0 * (t0 * d0[IX(i0,j0)] + t1 * d0[IX(i0,j1)]) + s1 * (t0 * d0[IX(i1,j0)] + t1 * d0[IX(i1,j1)]);
    }
  }
  set_bnd ( b, d );
}

function dens_step() {
  //SWAP ( x0, x );
  diffuse( 0, dens_prev, dens, diff );
  //SWAP ( x0, x );
  advect( 0, dens, dens_prev, u, v );
}

function vel_step() {
  //SWAP( u0, u );
  diffuse( 1, u_prev, u, visc );
  //SWAP( v0, v );
  diffuse( 2, v_prev, v, visc );
  project( u_prev, v_prev, u, v );
  //SWAP( u0, u );
  //SWAP( v0, v );
  advect( 1, u, u_prev, u_prev, v_prev );
  advect ( 2, v, v_prev, u_prev, v_prev );
  project( u, v, u_prev, v_prev );
}

function vort_step() {
	calc_vorticity(om, u, v);
	confine_vorticity(om, u, v);
}

function project ( u0, v0, p, div ) {
  var h = 1.0 / N;
  for ( var i=1 ; i<=N ; i++ ) {
    for ( var j=1 ; j<=N ; j++ ) {
      div[IX(i,j)] = 0.5 * h * ( u0[IX(i+1,j)] - u0[IX(i-1,j)] + v0[IX(i,j+1)] - v0[IX(i,j-1)] );
      p[IX(i,j)] = 0;
    }
  }
  set_bnd ( 0, div );
  set_bnd ( 0, p );
	var residual;
  for ( var k=0 ; k<100 ; k++ ) {
    for ( i=1 ; i<=N ; i++ ) {
      for ( j=1 ; j<=N ; j++ ) {
				residual = -4 * p[IX(i,j)] + p[IX(i-1,j)] + p[IX(i+1,j)] + p[IX(i,j-1)] + p[IX(i,j+1)] - div[IX(i,j)];
        p[IX(i,j)] += residual * (1.7/4);
      }
    }
    set_bnd ( 0, p );
  }
  for ( i=1 ; i<=N ; i++ ) {
    for ( j=1 ; j<=N ; j++ ) {
      u0[IX(i,j)] -= 0.5 * ( p[IX(i+1,j)] - p[IX(i-1,j)] ) / h;
      v0[IX(i,j)] -= 0.5 * ( p[IX(i,j+1)] - p[IX(i,j-1)] ) / h;
    }
  }
  set_bnd ( 1, u0 );
  set_bnd ( 2, v0 );
}

function set_bnd ( b, x ) {
  for ( var i=1 ; i<=N ; i++ ) {
    x[IX(0,i)] = b == 1 ? -x[IX(1,i)] : x[IX(1,i)];
    x[IX(N+1,i)] = b == 1 ? -x[IX(N,i)] : x[IX(N,i)];
    x[IX(i,0)] = b == 2 ? -x[IX(i,1)] : x[IX(i,1)];
    x[IX(i,N+1)] = b == 2 ? -x[IX(i,N)] : x[IX(i,N)];
  }
  x[IX(0 ,0 )] = 0.5 * ( x[IX(1,0 )] + x[IX(0 ,1)] );
  x[IX(0 ,N+1)] = 0.5 * ( x[IX(1,N+1)] + x[IX(0 ,N )] );
  x[IX(N+1,0 )] = 0.5 * ( x[IX(N,0 )] + x[IX(N+1,1)] );
  x[IX(N+1,N+1)] = 0.5 * ( x[IX(N,N+1)] + x[IX(N+1,N )] );
}


function drawDensity() {
  var dx, dy, ddx, ddy;
  var df, di;
  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      dx = (N / width) * x;
      ddx = dx - int(dx);
      dy = (N / height) * y;
      ddy = dy - int(dy);
      df = (dens[IX(floor(dx), floor(dy))] * (1.0 - ddx) + dens[IX(ceil(dx), floor(dy))] * ddx) * (1.0 - ddy) + (dens[IX(floor(dx), ceil(dy))] * (1.0 - ddx) + dens[IX(ceil(dx), ceil(dy))] * ddx) * ddy;
      di = int(df * 255);
      if (di < 0) di = 0;
      if (di > 255) di = 255;
      pixels[PX(x, y)] = pixels[PX(x, y)] * (1-df) + di*df;
      pixels[PX(x, y) + 1] = 0;
      pixels[PX(x, y) + 2] = 0;
      pixels[PX(x, y) + 3] = 255;
    }
  }
  updatePixels();
}

function drawVorticity() {
  var dx, dy, ddx, ddy;
  var df, di, din;
  loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      dx = (N / width) * x;
      ddx = dx - int(dx);
      dy = (N / height) * y;
      ddy = dy - int(dy);
      df = (om[IX(floor(dx), floor(dy))] * (1.0 - ddx) + om[IX(ceil(dx), floor(dy))] * ddx) * (1.0 - ddy) + (om[IX(floor(dx), ceil(dy))] * (1.0 - ddx) + om[IX(ceil(dx), ceil(dy))] * ddx) * ddy;
      di = int(df * 255);
			din = -di;
			if (di < 0) di = 0;
      if (di > 255) di = 255;
      if (din < 0) din = 0;
      if (din > 255) din = 255;
      pixels[PX(x, y) + 1] = di;
			pixels[PX(x, y) + 2] = din;
    }
  }
  updatePixels();
}

function drawVelocity() {
  var sx = width / N;
  var sy = height / N;
  for (var x = 1; x <= N; x++) {
    for (var y = 1; y <= N; y++) {
      var i = IX(x, y);
      line(int((x - 0.5) * sx), int((y - 0.5) * sy), int((x - 0.5) * sx + u[i] * 50), int((y - 0.5) * sy + v[i] * 50));
    }
  }
}