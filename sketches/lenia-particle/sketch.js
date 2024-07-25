/*
  Based upon this Tutorial by Alexander Mordvintsev:
  Particle Lenia from scratch
  https://observablehq.com/@znah/particle-lenia-from-scratch
  
  The simulation shows Particle Lenia: the system of 
  particles that move to minimize local energy of their 
  interaction, leading to the formation of complex and 
  diverse structures. 
	
	https://arxiv.org/pdf/2305.16706
  
  This version by Juan Carlos Ponce Campuzano
  12/Jul/2024
  https://www.patreon.com/jcponce
*/

let params = {
    mu_k: 4.0, sigma_k: 1.0, w_k: 0.022,
    mu_g: 0.6, sigma_g: 0.15, c_rep: 1.0,
    dt: 0.1
  };
  
  let point_n = 200;
  let points;
  let fields;
  let steps_per_frame; // Adjust this based on desired speed
  let randomCol;
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    points = init(new Float32Array(point_n * 2));
    fields = {
      R_val: new Float32Array(point_n),
      U_val: new Float32Array(point_n),
      R_grad: new Float32Array(point_n * 2),
      U_grad: new Float32Array(point_n * 2)
    };
    
    colorMode(RGB, 200, 200, 200, 200);
    noStroke();
    
    steps_per_frame = int(random(3, 12));
    
    randomCol = random();
      
    //console.log(randomCol);
  }
  
  function draw() {
    for (let i = 0; i < steps_per_frame; ++i) step();
    background(0, 30);
    translate(width / 2, height / 2);
    scale(width / 45.0);
    strokeWeight(0.1);
  
    for (let i = 0; i < point_n; ++i) {
      let x = points[i * 2], y = points[i * 2 + 1];
      let r = params.c_rep / (fields.R_val[i] * 5.0);
      
      if(randomCol < 0.3){
        fill((i)/point_n* 200, 70, 100);
      } else if(0.3 <= randomCol && randomCol < 0.6) {
        fill(90, 80, (i)/point_n* 200);
      } else {
        fill(20, (i)/point_n* 200, 180);
      }
      
      ellipse(x, y, r * 2, r * 2);
    }
  }
  
  function init(points) {
    for (let i = 0; i < point_n; ++i) {
      points[i * 2] = (Math.random() - 0.5) * 12;
      points[i * 2 + 1] = (Math.random() - 0.5) * 12;
    }
    return points;
  }
  
  function add_xy(a, i, x, y, c) {
    a[i * 2] += x * c;
    a[i * 2 + 1] += y * c;
  }
  
  function compute_fields() {
    const { R_val, U_val, R_grad, U_grad } = fields;
    const { c_rep, mu_k, sigma_k, w_k } = params;
    R_val.fill(repulsion_f(0.0, c_rep)[0]);
    U_val.fill(peak_f(0.0, mu_k, sigma_k, w_k)[0]);
    R_grad.fill(0);
    U_grad.fill(0);
  
    for (let i = 0; i < point_n - 1; ++i) {
      for (let j = i + 1; j < point_n; ++j) {
        let rx = points[i * 2] - points[j * 2];
        let ry = points[i * 2 + 1] - points[j * 2 + 1];
        const r = Math.sqrt(rx * rx + ry * ry) + 1e-20;
        rx /= r;
        ry /= r;
  
        if (r < 1.0) {
          const [R, dR] = repulsion_f(r, c_rep);
          add_xy(R_grad, i, rx, ry, dR);
          add_xy(R_grad, j, rx, ry, -dR);
          R_val[i] += R;
          R_val[j] += R;
        }
        const [K, dK] = peak_f(r, mu_k, sigma_k, w_k);
        add_xy(U_grad, i, rx, ry, dK);
        add_xy(U_grad, j, rx, ry, -dK);
        U_val[i] += K;
        U_val[j] += K;
      }
    }
  }
  
  function repulsion_f(x, c_rep) {
    const t = Math.max(1.0 - x, 0.0);
    return [0.5 * c_rep * t * t, -c_rep * t];
  }
  
  function fast_exp(x) {
    let t = 1.0 + x / 32.0;
    t *= t;
    t *= t;
    t *= t;
    t *= t;
    t *= t;
    return t;
  }
  
  function peak_f(x, mu, sigma, w = 1.0) {
    const t = (x - mu) / sigma;
    const y = w / fast_exp(t * t);
    return [y, -2.0 * t * y / sigma];
  }
  
  function step() {
    const { R_val, U_val, R_grad, U_grad } = fields;
    const { mu_g, sigma_g, dt } = params;
    compute_fields();
    let total_E = 0.0;
    for (let i = 0; i < point_n; ++i) {
      const [G, dG] = peak_f(U_val[i], mu_g, sigma_g);
      const vx = dG * U_grad[i * 2] - R_grad[i * 2];
      const vy = dG * U_grad[i * 2 + 1] - R_grad[i * 2 + 1];
      add_xy(points, i, vx, vy, dt);
      total_E += R_val[i] - G;
    }
    return total_E / point_n;
  }
  
  function mousePressed() {
    params.mu_k = random(1.0, 5.0);
    params.sigma_k = random(0.1, 2.0);
    params.w_k = random(0.01, 0.07);
    params.mu_g = random(0.1, 1.0);
    params.sigma_g = random(0.05, 0.3);
    params.c_rep = random(0.1, 2.0);
    // Debugg
    //console.log(params);
  }