class circlesGroup {
    constructor(coeffData) {
        this.orig = coeffData[0];
        this.data = [];
        for (var n in coeffData) {
            if (n != 0) {
                this.data.push([n, coeffData[n]]);
            }
        }
        this.data.sort(function (a, b) {
            var m1 = a[1].mag();
            var m2 = b[1].mag();
            return m2 - m1;
        });
        this.circles = [];
        this.points = [];
        var end = this.orig;
        for (var i in this.data) {
            var cir = new circle(end, this.data[i][1], this.data[i][0]);
            this.circles.push(cir);
            end = cir.getEnd();
        }
        this.points.push(end);
    }

    update() {
        var newEnd = this.orig;
        for (var i in this.circles) {
            this.circles[i].update(newEnd);
            newEnd = this.circles[i].getEnd();
        }
        this.points.push(newEnd);
    }

    show() {
        for (var i in this.circles) {
            this.circles[i].show();
        }
        stroke(0, 0, 255);
        beginShape();
        for (var i in this.points) {
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape();
    }
}