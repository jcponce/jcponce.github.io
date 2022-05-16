(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var analyzer, blue, btn, detector, el, enableMicrophone, enableMusic, getMediaStream, graph, green, makeAnalyzer, makeDetector, mathbox, music, present, props, ref, slides, stream, three;

makeAnalyzer = require('./viz/analyzer');

makeDetector = require('./viz/detector');

getMediaStream = require('./viz/mediastream');

blue = 0x3090FF;

green = 0x60A010;

window.mathbox = (ref = mathBox({
  plugins: ['core', 'controls', 'cursor'],
  controls: {
    klass: THREE.OrbitControls,
    parameters: {
      noPan: true
    }
  },
  camera: {
    fov: 60
  },
  splash: {
    color: 'blue'
  },
  mathbox: {
    inspect: false
  }
}), mathbox = ref.mathbox, three = ref.three, ref);

mathbox.set({
  scale: 720,
  focus: 3
});

three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1);

analyzer = makeAnalyzer();

detector = makeDetector(analyzer);

music = false;

btn = null;

stream = null;

el = null;

btn = document.createElement('button');

btn.setAttribute('style', 'position: absolute; z-index: 10000; top: 5px; right: 5px; text-align: center; font-size: 16px; line-height: 24px');

btn.onclick = function() {
  if (music) {
    return enableMicrophone();
  } else {
    return enableMusic();
  }
};

document.body.appendChild(btn);

enableMicrophone = function() {
  if (el) {
    el.pause();
    el.src = null;
    el = null;
  }
  stream = getMediaStream(function(stream) {
    analyzer.attachToStream(stream);
    return analyzer.passthroughVolume(0);
  });
  btn.innerHTML = "Use<br />Radio";
  return music = false;
};

enableMusic = function() {
  var attach, attached;
  el = document.createElement('audio');
  el.crossOrigin = 'anonymous';
  analyzer.passthroughVolume(0);
  attached = false;
  attach = function() {
    var ramp, volume;
    if (attached) {
      return;
    }
    analyzer.attachToElement(el);
    volume = 0;
    ramp = function() {
      volume += .02;
      analyzer.passthroughVolume(volume * volume);
      if (volume < 1) {
        return requestAnimationFrame(ramp);
      }
    };
    attached = true;
    ramp();
    return el.play();
  };
  el.oncanplay = attach;
  el.src = 'http://fm.acko.net/1337.mp3';
  el.play();
  btn.innerHTML = "Use<br />Microphone";
  return music = true;
};

if (window.location.host === 'localhost') {
  enableMicrophone();
} else {
  enableMusic();
}

three.on('update', analyzer.update);

present = mathbox.present();

slides = present.slide();

props = slides.shader({
  code: "uniform float skew;\nvoid main() { }",
  skew: 0
});

props.step({
  pace: 1.5,
  stops: [0, 0, 0, 0, 1, 2, 2, 3],
  script: [
    {
      props: {
        skew: 0
      }
    }, {
      props: {
        skew: 1
      }
    }, {
      props: {
        skew: 4
      }
    }, {
      props: {
        skew: 16
      }
    }
  ]
});

graph = slides.slide({
  steps: 10
});

graph.camera({
  proxy: false
}).step({
  rewind: 10,
  pace: 1.5,
  stops: [0, 0, 1, 1, 1, 2, 2, 3, 30, 35],
  script: {
    "0": {
      props: {
        position: [0, 0, 3],
        lookAt: [0, 0, 0]
      }
    },
    "1": {
      props: {
        position: [-3.4, .13, 2.12],
        lookAt: [0, -.25, 0]
      }
    },
    "2": {
      props: {
        position: [-4, 0, 0],
        lookAt: [0, 0, 0]
      }
    },
    "3": {
      props: {
        position: [-3.4, .13, 2.12],
        lookAt: [0, -.25, 0]
      }
    },
    "3.3": {
      props: {
        position: [-3.4, .13, 2.12],
        lookAt: [0, -.25, 0]
      }
    },
    "30": {
      props: {
        position: [-3.4, .13, -37.88],
        lookAt: [0, -.25, -40]
      }
    },
    "35": {
      props: {
        position: [-20, 8, -20],
        lookAt: [0, -.25, -20]
      }
    }
  }
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({}, {
  matrix: function() {
    var skew;
    skew = props.get('skew');
    return [1, 0, skew, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 1025
}).area({
  axes: 'yz',
  width: 2,
  height: 1025,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).end().interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().slide({
  steps: 0,
  from: 1,
  to: 11
}).reveal().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = props.get('skew');
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).end().end().end().slide({
  steps: 0,
  from: 2,
  to: 11
}).reveal({
  delayEnter: 1.5,
  duration: 1.5
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -2.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 15, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 960
}).area({
  axes: 'yz',
  width: 2,
  height: 960,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 15;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 14, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 896
}).area({
  axes: 'yz',
  width: 2,
  height: 896,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 14;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -7.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 13, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 832
}).area({
  axes: 'yz',
  width: 2,
  height: 832,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 13;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -10]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 12, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 768
}).area({
  axes: 'yz',
  width: 2,
  height: 768,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 12;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -12.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 11, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 704
}).area({
  axes: 'yz',
  width: 2,
  height: 704,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 11;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -15.0]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 10, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 640
}).area({
  axes: 'yz',
  width: 2,
  height: 640,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 10;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -17.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 9, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 576
}).area({
  axes: 'yz',
  width: 2,
  height: 576,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 9;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -20]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 8, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 512
}).area({
  axes: 'yz',
  width: 2,
  height: 512,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 8;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -22.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 7, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 448
}).area({
  axes: 'yz',
  width: 2,
  height: 448,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 7;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -25]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 6, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 384
}).area({
  axes: 'yz',
  width: 2,
  height: 384,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 6;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -27.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 5, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 320
}).area({
  axes: 'yz',
  width: 2,
  height: 320,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 5;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -30]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 4, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 256
}).area({
  axes: 'yz',
  width: 2,
  height: 256,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 4;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -32.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 192
}).area({
  axes: 'yz',
  width: 2,
  height: 192,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 3;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -35]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 128
}).area({
  axes: 'yz',
  width: 2,
  height: 128,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 2;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -37.5]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 64
}).area({
  axes: 'yz',
  width: 2,
  height: 64,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 1;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end().slide({
  steps: 0,
  from: 8,
  to: 10
}).reveal({
  duration: 1.5
}).transform({
  position: [0, 0, -40]
}).polar({
  range: [[-π, π], [0, 1], [-3, 3]],
  scale: [1, 1, 2],
  quaternion: [0, .707, 0, .707],
  bend: 1
}).transform({
  matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}).view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).grid({
  axes: 'yz',
  color: 0xc0c0c0,
  width: 2,
  detailY: 2
}).area({
  axes: 'yz',
  width: 2,
  height: 2,
  expr: function(emit, y, z) {
    return emit(0, y, z);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: -2.1,
  zOrder: 1
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2
}).axis({
  axis: 'z',
  detail: 8,
  color: 0x0,
  width: 2
}).interval({
  axis: 'z',
  width: 1024,
  channels: 3,
  history: 6,
  expr: function(emit, z, i) {
    return emit(0, analyzer.time[i], z);
  }
}).interval({
  width: 6,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).line({
  color: blue,
  points: '<<<<',
  colors: '<',
  width: 3,
  join: 'bevel'
}).end().end().view({
  range: [[-π, π], [-1, 1], [-3, 3]]
}).axis({
  axis: 'y',
  detail: 8,
  color: 0x0,
  width: 2,
  origin: [0, 0, -3.5]
}).end().interval({
  range: [-3, 3],
  width: 2,
  history: 8,
  expr: function(emit, x, i) {
    var j, lvlX, lvlY, r, skew, θ;
    if (i === 0) {
      return emit(0, 0, -3.5);
    } else {
      lvlX = lvlY = 0;
      skew = 0;
      for (i = j = 0; j < 1024; i = ++j) {
        θ = ((i / 1024) * 2 - 1) * 3 * skew;
        lvlX += analyzer.time[i] * Math.cos(θ);
        lvlY += analyzer.time[i] * Math.sin(θ);
      }
      r = 16 / 1024 * Math.sqrt(lvlX * lvlX + lvlY * lvlY);
      θ = Math.atan2(lvlY, lvlX);
      return emit(θ, r, -3.5);
    }
  }
}).interval({
  width: 8,
  range: [0, 1],
  expr: function(emit, x, i) {
    return emit(1, 1, 1, 1 - x);
  }
}).repeat().transpose({
  order: 'yxzw'
}).slice({
  source: '<<<<',
  width: [1, 1]
}).slice({
  source: '<<',
  width: [1, 1]
}).point({
  size: 10,
  color: green,
  points: '<<',
  colors: "<",
  zBias: 2,
  zOrder: 2,
  depth: .9
}).line({
  end: true,
  width: 4,
  color: green,
  points: '<6',
  colors: '<3',
  zBias: 2,
  zOrder: 2,
  depth: .9
}).grid({
  axes: 'xy',
  color: 0x808080,
  width: 1,
  detailX: 65,
  divideX: 8,
  divideY: 10,
  unitX: π,
  origin: [0, 0, -3.5],
  zBias: 1
}).area({
  rangeX: [-π, π],
  rangeY: [0, 1],
  width: 65,
  height: 2,
  expr: function(emit, x, y) {
    return emit(x, y, -3.5);
  }
}).surface({
  color: 0xffffff,
  opacity: .5,
  zBias: 0,
  zOrder: 1
}).end().end().end().end();

require('./present')(present, mathbox);



},{"./present":2,"./viz/analyzer":3,"./viz/detector":4,"./viz/mediastream":5}],2:[function(require,module,exports){
module.exports = function(present, mathbox) {
  var three;
  three = mathbox.three;
  if (window === top) {
    window.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37:
        case 38:
          return present[0].set('index', present[0].get('index') - 1);
        case 39:
        case 40:
          return present[0].set('index', present[0].get('index') + 1);
      }
    };
  }
  window.onmessage = function(e) {
    var data;
    data = e.data;
    if (data.type === 'slideshow') {
      return present.set('index', data.i + 1);
    }
  };
  return three.on('mathbox/progress', function(e) {
    var i, j, k, ref, results;
    i = present[0].get('index');
    if (e.total === e.current && i <= 2) {
      results = [];
      for (j = k = ref = i; ref <= 2 ? k < 2 : k > 2; j = ref <= 2 ? ++k : --k) {
        results.push(window.parent.postMessage({
          type: 'slideshow',
          method: 'next'
        }, '*'));
      }
      return results;
    }
  });
};



},{}],3:[function(require,module,exports){
module.exports = function() {
  var AudioContext, analyser, ctx, freq, gain, node, self, source, time;
  source = null;
  AudioContext = window.AudioContext || window.webkitAudioContext;
  ctx = new AudioContext;
  node = analyser = ctx.createAnalyser();
  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = 1024;
  gain = ctx.createGain();
  gain.gain.value = 1;
  freq = new Float32Array(analyser.frequencyBinCount);
  time = new Float32Array(analyser.fftSize);
  analyser.connect(gain);
  gain.connect(ctx.destination);
  self = {
    freq: freq,
    time: time,
    toLinear: function(v) {
      return (v - node.minDecibels) / (node.maxDecibels - node.minDecibels);
    },
    detach: function() {
      if (source != null) {
        source.disconnect();
      }
      return source = null;
    },
    passthroughVolume: function(value) {
      return gain.gain.value = value;
    },
    attachToElement: function(element) {
      self.detach();
      source = ctx.createMediaElementSource(element);
      return source.connect(analyser);
    },
    attachToStream: function(stream) {
      self.detach();
      source = ctx.createMediaStreamSource(stream);
      return source.connect(analyser);
    },
    update: function() {
      if (analyser != null) {
        analyser.getFloatFrequencyData(freq);
      }
      return analyser != null ? analyser.getFloatTimeDomainData(time) : void 0;
    },
    close: function() {
      self.detach();
      return ctx.close();
    }
  };
  return self;
};



},{}],4:[function(require,module,exports){
var BASS_MID_FRACTION, LERP_FACTOR, MID_TREBLE_FRACTION, makeDetector;

BASS_MID_FRACTION = .01;

MID_TREBLE_FRACTION = .1;

LERP_FACTOR = .2;

module.exports = makeDetector = function(analyzer) {
  var freq, lerp, levels, rms, time, toLinear;
  freq = analyzer.freq, time = analyzer.time, toLinear = analyzer.toLinear;
  rms = function(samples) {
    var a, i, j, n, ref, s;
    n = samples.length || 1;
    a = 0;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      s = toLinear(samples[i]);
      a += s * s;
    }
    return a / n;
  };
  levels = {
    bass: 0,
    mid: 0,
    treble: 0,
    itbass: 0,
    itmid: 0,
    ittreble: 0,
    smbass: 0,
    smmid: 0,
    smtreble: 0
  };
  lerp = function(a, b) {
    return a + (b - a) * LERP_FACTOR;
  };
  return {
    levels: levels,
    update: function() {
      var a, b, bass, c, fftSize, freqSize, gain, ib, im, it, mid, treble;
      gain = 3;
      freqSize = freq.length;
      fftSize = time.length;
      a = Math.floor(freqSize * BASS_MID_FRACTION);
      b = Math.floor(freqSize * MID_TREBLE_FRACTION);
      c = freqSize;
      levels.bass = bass = gain * rms(freq.slice(0, a));
      levels.mid = mid = gain * rms(freq.slice(a, b));
      levels.treble = treble = gain * rms(freq.slice(b, c));
      levels.itbass = ib = lerp(levels.itbass, bass);
      levels.itmid = im = lerp(levels.itmid, mid);
      levels.ittreble = it = lerp(levels.ittreble, treble);
      levels.smbass = lerp(levels.smbass, ib);
      levels.smmid = lerp(levels.smmid, im);
      levels.smtreble = lerp(levels.smtreble, it);
      return levels;
    }
  };
};



},{}],5:[function(require,module,exports){
var closeStream, getStream, getUserMedia, open, stream;

getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

open = false;

stream = null;

getStream = function(callback) {
  if (!getUserMedia) {
    throw "Error initializing getUserMedia";
  }
  if (stream != null) {
    open = true;
    return setTimeout(function() {
      return callback(stream);
    });
  }
  return getUserMedia.call(navigator, {
    audio: true
  }, function(s) {
    stream = s;
    open = true;
    return callback(stream);
  }, function(code) {
    throw "Error initializing getUserMedia";
  });
};

closeStream = function() {
  if (!open) {
    return;
  }
  open = false;
  if (stream) {
    stream.stop();
    return stream = null;
  }
};

module.exports = function(callback) {
  getStream(callback);
  return {
    close: closeStream
  };
};



},{}]},{},[1]);
