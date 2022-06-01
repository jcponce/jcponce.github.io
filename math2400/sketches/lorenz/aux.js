function backHome() {
  window.open(
    'https://jcponce.github.io/strange-attractors/',
    '_blank' // <- This is what makes it open in a new window.
  );
}

function randomCurve() {
  for (var i = points.length - 1; i >= 0; i -= 1) {
    points.splice(i, 1);
  }
  attractor.randomize();

  initSketch();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

function touchStarted() {
  cursor('grabbing');
}

function touchEnded() {
  cursor('grab');
}

function mousePressed() {
  cursor('grabbing');
} // mousePressed() 

function mouseReleased() {
  cursor('grab');
}