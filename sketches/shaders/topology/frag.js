let frag = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D iChannel0;
uniform float iChannel0Ratio;

uniform float iBass;
uniform float iTreble;
uniform float iMid;

/////////////////////////////////
// XBE
// Deformed
// Sphere + Plane + Noise
//
vec4 spect;

#define MRX(X) mat3(1., 0., 0. ,0., cos(X), -sin(X) ,0., sin(X), cos(X))	//x axis rotation matrix
#define MRY(X) mat3(cos(X), 0., sin(X),0., 1., 0.,-sin(X), 0., cos(X))	//y axis rotation matrix
#define MRZ(X) mat3(cos(X), -sin(X), 0.	,sin(X), cos(X), 0.	,0., 0., 1.)	//z axis rotation matrix
#define MRF(X,Y,Z) MRZ(Z)*MRY(Y)*MRX(X)	//x,y,z combined rotation macro

// Distance Functions for Raymarching
float sdSphere(vec3 p, float s)
{
    return length(p)-s;
}

float sdPlane(vec3 p)
{
	return p.y;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float opU(float d1, float d2)
{
	return (d1<d2) ? d1 : d2;
}

float smin( float a, float b, float k )
{
    float h = max( k-abs(a-b), 0.0 )/k;
    float m = h*h*0.5;
    float s = m*k*(1.0/2.0);
    return (a<b) ? a-s : b-s;
}

float opCheapBend(in vec3 p )
{
    float k = iBass;
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return sdTorus(p, vec2(1., 0.2));
}

float opTwist(in vec3 p )
{
    float k = 1.0 * iBass; // or some other amount
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return sdTorus(q * MRF((1. + iBass) * abs(sin(iTime)), 0., 0.), vec2(1. + iTreble + iMid, 0.2));
}

#define SMIN_COEF 0.5

float map(in vec3 pos)
{
	float d = opTwist(pos);
	d = smin(d, sdSphere(pos, 1.), SMIN_COEF);
	d = smin(d, opTwist(pos * MRF(iTime * 0.1, iTime * 0.1, iTime * 0.1)), SMIN_COEF);
	d = smin(d, opTwist(pos * MRF(120. + iTime * 0.1 * iMid, 50. + iTime * 0.1 * iMid, 10. + iTime * 0.1 * iMid)), SMIN_COEF);
	
	// for (float i=1.; i<10.; i++)
	// {
	// 		vec3 p = vec3(pos.x - cos(iTime * i) * sin(iTime * i) * 2., pos.y - cos(iTime * i) * 2., pos.z - sin(iTime * i * 2.) * 2.);
	// 		d = smin(d, sdSphere(p, iBass * 0.5), SMIN_COEF + iTreble);
	// }
	return d;
}

vec3 calcNormal(in vec3 pos)
{
	vec3 eps = vec3(0.001,0.0,0.0);
	return normalize(vec3(
		map(pos+eps.xyy) - map(pos-eps.xyy),
		map(pos+eps.yxy) - map(pos-eps.yxy),
		map(pos+eps.yyx) - map(pos-eps.yyx)));
}

// Raymarching
bool raymarch(vec3 origin, vec3 dir, out float dist, out vec3 norm)
{
	float epsilon = 0.003;
	float maxdist = 10.0;
	float marched = 0.0;
	float delta = 2.*epsilon;

	dist = -1.0;
	for (int steps=0; steps < 60; steps++)
	{
		if ((abs(delta) < epsilon) || (marched > maxdist)) continue;
		marched += delta;
		delta = map(origin + marched * dir);  
	}
	bool res = false;
	if (marched < maxdist)
	{
		norm = calcNormal(origin + marched * dir);
		dist = marched;
		res = true;
	}
	return res;
}

float calcAO(in vec3 pos, in vec3 nor)
{
	float totao = 0.0;
    float sca = 1.0;
    for(int aoi=0; aoi<5; aoi++)
    {
        float hr = 0.01 + 0.05*float(aoi);
        vec3 aopos =  nor * hr + pos;
        float dd = map(aopos);
        totao += -(dd-hr)*sca;
        sca *= 0.75;
    }
    return clamp(1.0 - 4.0*totao, 0.0, 1.0);
}

vec3 render(in vec3 ro, in vec3 rd)
{ 
    vec3 col = vec3(0.0);
	float dist = 0.;
	vec3 nor = vec3(0.,0.,0.);
	//
	vec3 lig = normalize(vec3(-0.6, 0.7, -0.5));
	vec3 sky = vec3(0.32,0.36,0.4) - rd.y*0.4;
	float sun = clamp(dot(rd,lig), 0.0, 1.0);
	sky += vec3(1.0,0.8,0.4)*0.5*pow(sun, 10.0);
	sky *= 0.9;
	//
    if (raymarch(ro, rd, dist, nor))
    {
        vec3 pos = ro + dist*rd;

		col = vec3(0.75);
		
        float ao = calcAO(pos, nor);

		float amb = clamp(0.5+0.5*nor.y, 0.0, 1.0);
        float dif = clamp(dot(nor, lig), 0.0, 1.0);
        float bac = clamp(dot(nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0)*clamp(1.0-pos.y,0.0,1.0);

		vec3 brdf = vec3(0.0);
		// brdf += 1.20*amb*vec3(0.1176, 1.0, 0.0)*ao;
		brdf += 1.20*amb*vec3(0.0118, 0.3059, 0.8863)*ao;
        brdf += 0.20*bac*vec3(0.9686, 0.0588, 0.0588)*ao;
        brdf += 1.00*dif*vec3(0.1176, 1.0, 0.0);

		float pp = clamp(dot(reflect(rd,nor), lig), 0.0, 1.0);
		float spe = pow(pp,16.0);
		float fre = ao*pow(clamp(1.0+dot(nor,rd),0.0,1.0), 2.0);

		col = col*brdf + vec3(0.8)*vec3(1.00,0.70,0.60)*spe + 0.2*fre*(0.5+0.5*col);
		col = mix(col, sky, 1.0-exp(-0.0025*dist*dist*dist));
	}
	else
	{
		col = sky;
	}

	return vec3(clamp(col,0.0,1.0));
}

void main()
{
	vec2 q = gl_FragCoord.xy/iResolution.xy;
	vec2 p = -1.0+2.0*q;
	p.x *= iResolution.x/iResolution.y;

    spect.x = 1.;

	float Time = 0.45*(15.0 + iTime) - 2.*spect.w;  

	// camera	
	// vec3 ro = vec3(4.0*cos(Time+45.), 0.5, 2.0*sin(Time));
	vec3 ro = vec3(3.0 * (1. + abs(cos(iTime * 0.2))), 0.5, 2.0);
	vec3 ta = vec3(0.0, 0.0, 0.0);
	
	// camera tx
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize(cross(cw,cp));
	vec3 cv = normalize(cross(cu,cw));
	vec3 rd = normalize(p.x*cu + p.y*cv + 2.5*cw);

    vec3 col = render(ro, rd);
	col = sqrt(col);
	
	gl_FragColor = vec4(clamp(col,0.,1.), 1.0);
}
`