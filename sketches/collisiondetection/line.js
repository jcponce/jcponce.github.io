/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 */

class Line {
    
    constructor( _x1, _y1,  _x2,  _y2){
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
        this.speed = random(0.5, 2);
        this.hit = false;
        this.R = 120;//150,255
        this.G = 150;
        this.B = 10;
        this.ran = floor(random(0,6));
    }
    
    update() {
        this.y1 += this.speed;
        this.y2 += this.speed;
        
        if (this.y1 > height+50 && this.y2 > height+50) {
            
            let x = random(width);
            let y = random(-height,-50);
            this.x1 = x;
            this.y1 = y;
            this.x2 = x+random(-20,20);
            this.y2 = y+random(-20,20);
            
        }
        this.hit = lineCircle(this.x1, this.y1, this.x2, this.y2, cx, cy, cr);
    }
    
    display() {
        if (!this.hit) stroke(this.R, this.G, this.B,  190);
        else stroke(255, 0, 0, 200);
        strokeWeight(5);
        line(this.x1, this.y1, this.x2, this.y2);
        
        if (this.hit) {
            playNote(notes[this.ran]);
            osc.fade(0,25);
        }
    }
}
