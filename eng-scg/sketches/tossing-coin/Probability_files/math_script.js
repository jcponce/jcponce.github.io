//arrays of data

var Xmas = new Array();
var Ymas = new Array();
var Rmas = new Array();

//calculate mean X

function get_mean_X(){
    var sum = 0;
    for(var i = 0; i < Xmas.length; i++)
        sum += Xmas[i];
    return sum / Xmas.length;
}

//calculate mean Y

function get_mean_Y(){
    var sum = 0;
    for(var i = 0; i < Ymas.length; i++)
        sum += Ymas[i];
    return sum / Ymas.length;
}

//calculate standart deviation for X

function get_Sx(){
    var sum = 0;
    var mX = get_mean_X();
    for(var i = 0; i < Xmas.length; i++)
        sum += Math.pow(Xmas[i] - mX, 2);
   return sum / (Xmas.length - 1);
}

//calculate standart deviation for Y

function get_Sy(){
    var sum = 0;
    var mY = get_mean_Y();
    for(var i = 0; i < Ymas.length; i++)
        sum += Math.pow(Ymas[i] - mY, 2);
    return sum / (Ymas.length - 1);
}

//calculate correlation

function get_r(){
    var Sx = Math.sqrt(get_Sx());
    var mX = get_mean_X();
    var Sy = Math.sqrt(get_Sy());
    var mY = get_mean_Y();
    var sum = 0;
    for(var i = 0; i < Xmas.length; i++)
        sum += ((Xmas[i] - mX) / Sx) * ((Ymas[i] - mY) / Sy);
    return sum / (Xmas.length - 1);
}

//calculate b-coefficient of least-squares line

function get_b(){
    return get_r() * Math.sqrt(get_Sy()) / Math.sqrt(get_Sx());
}

//calculate a-coefficient of least-squares line

function get_a(b){
    return get_mean_Y() - b * get_mean_X();
}

//calculete a-coefficient of residual line from point (x, y)

function get_res_line_a(b, x, y){
    return y - b * x;
}

//calculete X coordinate of cross-point of least-squares line and residual line from point (x, y)

function get_cross_x(x, y){
    var b = get_b();
    var a = get_a(b);
    var an = get_res_line_a(-1 / b, x, y);
    return (an - a) / (b + 1 / b);
}

function get_border_x(){
    var tmax = Xmas[0];
    var tmin = Xmas[0];
    for(var i = 0; i < Xmas.length; i++){
        if(Xmas[i] > tmax)
            tmax = Xmas[i];
        if(Xmas[i] < tmin)
            tmin = Xmas[i];
    }
    return {
        min : tmin,
        max : tmax
    }
}

function get_border_y(){
    var tmax = Ymas[0];
    var tmin = Ymas[0];
    for(var i = 0; i < Ymas.length; i++){
        if(Ymas[i] > tmax)
            tmax = Ymas[i];
        if(Ymas[i] < tmin)
            tmin = Ymas[i];
    }
    return {
        min : tmin,
        max : tmax
    }
}

function calculate_res_x(){
    Rmas = new Array();
    var b = get_b();
    var a = get_a(b);
    for(var i = 0; i < Xmas.length; i++){
        var y = b * Xmas[i] + a;
        var r = Ymas[i] - y;
        Rmas.push(r);
    }
}

function get_border_r(){
    var tmin = Rmas[0];
    var tmax = Rmas[0];
    for(var i = 0; i < Rmas.length; i++){
        if(Rmas[i] > tmax)
            tmax = Rmas[i];
        if(Rmas[i] < tmin)
            tmin = Rmas[i];
    }
    return {
        min : tmin,
        max : tmax
    }
}

function get_sum_X(){
    var sum = 0;
    for(var i = 0; i < Xmas.length; i++)
        sum+= Xmas[i];
    return sum;
}