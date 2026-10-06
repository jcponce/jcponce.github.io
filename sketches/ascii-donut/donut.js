               chars=".,-~:;=!*#$@"; 
             A = 0; B = 0; R1 = 1; R2 = 2; 
           K2 = 18; setup = _ => { /*...*/
         createCanvas(windowWidth, windowHeight);
       textFont("monospace"); }; draw = _ => {
     background(0); w = 12; h = w; c = floor(width
    / w); r = floor(height / h); o = Array.from({
   length: r }, () => Array(c).fill(" ")); z =
  Array.from({ length: r }, () => Array(c).fill(-1 /
 0)); a = cos(A); b = sin(A); d = cos(B); e = sin(B);
 k = min(width, height) * .2; for(t = 0; t < TAU; t +=
.1) { q = cos(t); s = sin(t); for(p = 0; p < TAU; p
+= .04) { C = cos(p);          S = sin(p); X = (R2 +
R1 * q) * C; Y = (R2            + R1 * q) * S; Z = R1
* s; Y1 = Y * a - Z              * b; X1 = X * d - Y1
* e; Y2 = X * e + Y1            * d; Z1 = Y * b + Z
* a + K2; xp = floor(c          / 2 + k * X1 / Z1); yp
= floor(r / 2 + k * Y2 / Z1); if(xp < 0 || xp >= c ||
 yp < 0 || yp >= r || Z1 <= z[yp][xp]) continue; nx =
 q * C; ny = q * S; nz = s; ny1 = ny * a - nz * b; nx1
 = nx * d - ny1 * e; ny2 = nx * e + ny1 * d; nz1 =
   ny * b + nz * a; L = max(0, (ny2 * -1 + nz1) /
    sqrt(2)); z[yp][xp] = Z1; o[yp][xp] = chars[
     min(chars.length - 1, floor(L / .97 * (chars.
       length - 1)))] } } fill(255); for(y = 0;
         y < r; y++) for(x = 0; x < c; x++)
            text(o[y][x], x * w + w / 2,
               y * h + h / 2); A += .02;
                   B += .01; };/*...*/