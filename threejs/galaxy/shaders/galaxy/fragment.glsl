void main (){

    float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
    //strength = step(0.5, strength);
    strength = 2.0 * strength;
    strength = 1.0 - strength;

    vec3 color = vec3(strength);

    gl_FragColor = vec4(color, 1.0);

    //#include <colorspace_fragment>
}