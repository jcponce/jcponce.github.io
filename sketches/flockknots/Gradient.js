class Gradient {	
  constructor() {		
		this.colors = []
  }
	
	addColor(color) {
    this.colors.push(color);
  }
	
	sample(value){
		var v = map(value, 0, 1, 0, this.colors.length -1);
		var s = floor(v);
		var e = s + 1;
		return lerpColor(this.colors[s], this.colors[e], v % 1);
	}
}