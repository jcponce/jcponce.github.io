window.CONST = {
	g : 0.05,
	friction : 0.8,
	restitution : 0.3,
	damping : 1.0,
	x : 0,
	y : 0,
	palette : [
		'#4D3BF4',
		'#42EACA',
		'#F46D5B',
		'#FFF'
	]
}

document.addEventListener('mousemove', function(e) {
	CONST.x = e.clientX,
	CONST.y = e.clientY
})