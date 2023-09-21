// Shader Park API avaible here:
// https://docs.shaderpark.com/references-js/

// Note: this function is treated as a string, so you will
// not be able to access constants you define outside this function
// Shader Park will convert this code into a shader for you.
function shaderParkCode() {
	let scale = 6.0;
	let s = getSpace();
	//rotateX(time*20.8);
	let n =  0.04 * noise(scale * s + vec3(0,0,time) + 0.05 * noise(scale * s +  vec3(0,-time,time) ));
	setGeometryQuality(20);
	shine(0.8);
	color(vec3(n)*0.1+0.5*normal*0.2+vec3(0,0,1));
	sphere(0.7+n);
}