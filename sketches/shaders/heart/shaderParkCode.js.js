// Shader Park API avaible here:
// https://docs.shaderpark.com/references-js/

// Note: this function is treated as a string, so you will
// not be able to access constants you define outside this function
// Shader Park will convert this code into a shader for you.




function shaderParkCode() {

	function myHeart(pn, tm) { 
		let r = 1.0;
		
		let ani = pow(0.5 + 0.5 * sin(2*PI * tm + pn.y/25), 4.0);
		pn *= 1.0 - 0.2 * vec3(1.0, 0.5, 1.0)*ani;
		pn.y -= 0.1*ani;
		
		let x = 1.1 * abs(pn.x);
		let y = pn.y - 3.0;
		let z = pn.z;
		y = 4.0 + y*1.3 - x * sqrt(max((12.0 - x) / 30.0, 0.0));
		z *= 2.0 - y/9.0;
		let d = sqrt(x * x + y * y + z * z) - r;
		d = d/3.0;
		return [d, 1, 0.5];
		
	}

	rotateY(0.15 * time); 

	let s = getSpace();
	let rad = length(s);
	let ds = myHeart(-1.5*s, time);

	shine(0.9);
	metal(0.4);
	color(nsin(3*ds[1]), 0, nsin(35*ds[2]));

	setSDF(ds[0]);
}