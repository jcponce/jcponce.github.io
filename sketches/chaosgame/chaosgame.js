/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-June-2018
 * Based upon Rodrigo Batista's code
 * https://www.openprocessing.org/user/76545
 * Chaos Game
 * https://www.openprocessing.org/sketch/498742
 */

var verts = [];

var s = 0.5;
var r = 0;

function setup() {
    createCanvas(512, 512);
    background(242, 242, 242);
    textAlign(LEFT,TOP);
    verts = poly(4);
    
    for(var i = 0;i<verts.length;i++)
        point(verts[i][0],verts[i][1]);
}

var timeJump = 5000;

function draw() {
    fill(242);
    noStroke();
    rect(0,0,50,32);
    fill(0);
    text("Rule: " + r,0,0);
    text("Sides: " + verts.length, 0, 20);
    stroke(random(10,200),random(90,100),random(200,255),50);
    for(var t = 0;t<timeJump;t++)
        if(!chaosPoint(20)) {
            timeJump = 1;
            print("Infinity Loop");
        }
}

var randomRule;

function keyPressed(){
    if(keyCode == 39) r+=0.5;
    if(keyCode == 37) r-=0.5;
    if(keyCode == 38) verts = poly(verts.length+1);
    if(keyCode == 40) verts = poly(verts.length-1);
    if(r<0){
        randomRule = RandomRule();
        print(randomRule);
        r = -1;
    }
    background(242);
    timeJump = 5000;
}

function chaosPoint(n){
    var x = random(height);
    var y = random(width);
    var p = [-1,-1,-1,-1,-1];
    for(var i = 0;i<n;i++){
        var er = 0;
        do{
            var v = floor(random(verts.length));
            er++;
            if(er>verts.length*100) {return false;}
        }
        while (!rule(p,v));
        p.unshift(v);
        p.pop();
        x = x+(verts[v][0]-x)*(s);
        y = y+(verts[v][1]-y)*(s);
    }
    point(x,y);
    return true;
}

function rule(p,v){
    if(p[p.length-1]<0) return true;
    function d(i){
        var dis = (v-p[i]);
        if(dis<0) dis+= verts.length;
        return dis;
    }
    switch (r){
        case -1:
            return randomRule.return(p,v);
        case 0:
            return (d(0)!=0);
        case 1:
            return (d(0)!=2);
        case 2:
            return (d(0)!=1);
        case 3:
            return (d(0)!=1 && d(1)!=3);
        case 4:
            return (d(0)!=2 && d(1)!=2);
        case 5:
            return ((d(1)!=1&&d(1)!=3) || d(0)!=2);
        case 6:
            return ((d(0)!=1&&d(0)!=3) || (d(1)==1||d(1)==3));
        case 7:
            return d
        case 10:
            return (d(1)!=2);
        case 11:
            return (d(2)!=2);
        case 12:
            return (d(3)!=2);
        case 13:
            return (d(4)!=2)
        default:
            return true;
    }
}

function poly(n){
    var v = [];
    var a = PI/(n);
    for(var i = 0;i<n;i++){
        var x = height/2*sin(a) + height/2;
        var y = height/2*cos(a) + height/2;
        v[i] = [x,y];
        a+=TWO_PI/n;
    }
    return v;
}

function RandomRule(){
    var r = random(1);
    //return new condition([floor(random(2)),floor(r*r*r*5),floor(random(4))]);
    return new condition([1,0,0]);
}

var condition = function(condit){
    this.operation = false; // false- &&   // true- ||
    this.con = condit; //condit = [Operator,i,d] or [condit,condit,...]
    this.return = function(p,v){
        this.d = [];
        function d(i){
            var dis = (v-p[i]);
            if(dis<0) dis+= verts.length;
            return dis;
        }
        //if(typeof this.con[0]=='number'){
        switch (this.con[0]){
            case 0:
                return d(this.con[1]) == this.con[3];
            case 1:
                return d(this.con[1]) != this.con[3];
        }
        //} else{
        var bo = this.con[0].return;
        for(var i = 1;i<this.con.length;i++){
            if(this.con[i].operation)
                bo = bo||this.con[i].return;
            else
                bo = bo==this.con[i].return;
        }
        return bo;
        //}
    }
}
