/**
 * Verlet Typography
 * @author <hazru.anurag@gmail.com>
 */

window.onload = function () {
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');
  let width = 800;
  let height = window.innerHeight - 4;
  canvas.width = width;
  canvas.height = height;

  let verly = new Verly(50, canvas, ctx);

  

  //verly.createCloth(200, 200, 200, 200, 10, 3)
  let rope = verly.createRope(20, 25, 55, 14, 0);
  rope.pin(rope.points.length - 1);
  //rope.pin(rope.points.length / 2);
  
  /*
  mix.addStick(5, 143) //A
  mix.addStick(21, 150) //S
  // mix.addStick(29, 155) //K
  mix.addStick(34, 155) //K
  mix.addStick(48, 160) //B
  mix.addStick(64, 168, 125) //U
  mix.addStick(71, 168) //U
  mix.addStick(85, 174) //D
  mix.addStick(103, 179) //D2
  mix.addStick(120, 184) //I
  mix.addStick(134, 188) //E
  */


  function animate() {
    ctx.clearRect(0, 0, width, height);

    verly.update();
    verly.render();
    verly.interact();
    // verly.renderPointIndex();

    requestAnimationFrame(animate);
  }
  animate();
}