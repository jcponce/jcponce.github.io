const NUM_IMGS = 17,
  imgs = [];
let currentImg = 0;

function preload() {
  for (let i = 0; i < NUM_IMGS; i++) {
    imgs[i] = loadImage(`assets/Page${i+1}.jpg`);
  }
}

function setup() {
  createCanvas(800, 500);

  setupButtons();
}

function draw() {
  image(imgs[currentImg], 0, 0);
}

const setupButtons = _ => {
  previous = createButton('Prev');
  previous.position(width*0.5 - 100, height + 20);
  
  previous.mouseClicked(_ => {
    if (currentImg > 0) currentImg--;
  });

  next = createButton('Next');
  next.position(width*0.5 + 100, height + 20);
  
  next.mouseClicked(_ => {
    if (currentImg < imgs.length - 1) currentImg++;
  });
};