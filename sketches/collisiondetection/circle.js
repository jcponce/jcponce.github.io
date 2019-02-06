/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 */

class Circle {
    
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
        this.r = random(12, 30);
        this.speed = random(0.5, 2);
        this.hit = false;
        this.R = 120;//0,150,255,150
        this.G = 155;
        this.B = 200;
    }
    
    update() {
        this.y += this.speed;
        if (this.y > height+50){
            this.x = random(width);
            this.y = random(-height,-50);
        }
        this.hit = circleCircle(this.x, this.y, this.r, cx, cy, cr);
    }
    
    display() {
        if (!this.hit) fill(this.R, this.G, this.B, 190);
        else fill(255, 0, 0, 200);
        noStroke();
        ellipse(this.x, this.y, this.r*2, this.r*2);
        
        if (this.hit) {
            playNote(notes[1], 788);
            
        }else osc.fade(0,0.5);
    }
}
