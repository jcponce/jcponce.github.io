/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 */

class Rectangle {
    
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
        this.w = random(10,40);
        this.h = random(10,40);
        this.speed = random(0.5, 2);
        this.hit = false;
        this.R = 130;//150,255
        this.G = 104;
        this.B = 180;
        this.ran = floor(random(0,6));
    }
    
    update() {
        this.y += this.speed;
        if (this.y > height+50){
            this.x = random(width);
            this.y = random(-height,-50);
        }
        this.hit = circleRect(cx, cy, cr, this.x, this.y, this.w, this.h);
    }
    
    display() {
        if (!this.hit) fill(this.R, this.G, this.B, 190);
        else fill(255, 200, 0, 200);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
        
        if (this.hit) {
            playNote(notesR[this.ran]);
            osc.fade(0,30);
        }
    }
}
