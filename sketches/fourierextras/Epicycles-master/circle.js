class circle {
    constructor(center, coeff, omega) {
        this.c = center;
        this.r = coeff.mag();
        this.ang = (coeff.heading() - (omega * Math.PI));
        this.sp = (2 * omega * Math.PI) / revolveResol;
        //this.ang -= (5 * this.sp);
        //this.sp = omega;
    }

    getEnd() {
        var vec = p5.Vector.fromAngle(this.ang, this.r);
        vec.add(this.c);
        return vec;
    }

    update(center) {
        this.c = center;
        this.ang += this.sp;
    }

    show() {
        stroke(0, 100);
        strokeWeight(1);
        ellipse(this.c.x, this.c.y, 2 * this.r, 2 * this.r);
        var end = this.getEnd();
        line(this.c.x, this.c.y, end.x, end.y);
    }
}