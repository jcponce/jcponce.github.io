(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var blue, cosineGraph, cosineView, expoGraph1, expoGraph2, leftExpo1, leftExpo2, leftQuad, mathbox, present, quadraticGraph, ref, rightExpo1, rightExpo2, rightExpoView2, rightQuad, rightQuadView, slides, three;

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
  }
}), mathbox = ref.mathbox, three = ref.three, ref);

mathbox.set({
  scale: 720,
  focus: 3
});

three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1);

three.camera.position.set(0, 0, 3);

blue = 0x3090FF;

present = mathbox.present();

slides = present.slide();

expoGraph1 = slides.slide({
  steps: 6
});

leftExpo1 = expoGraph1.reveal().cartesian({
  range: [[-4, 4], [0, 16]]
}).step({
  pace: 1.5,
  stops: [0, 1, 2, 2, 3],
  script: [
    {
      props: {
        scale: [1, 1, 1],
        position: [0, 0, 0]
      }
    }, {
      props: {
        position: [-1.1, 0, 0]
      }
    }, {
      props: {
        scale: [1, 2, 1],
        position: [-1.1, 1, 0]
      }
    }, {
      props: {
        position: [0, 1, 0]
      }
    }
  ]
}).slide({
  steps: 0,
  from: 0,
  to: 4
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 8
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  width: 17,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).point({
  size: 10,
  color: blue
});

rightExpo1 = expoGraph1.reveal().cartesian().step({
  pace: 1.5,
  stops: [0, 1, 1, 1.5, 2.5],
  script: {
    "0": {
      props: {
        position: [0, 0, 0],
        range: [[-4, 4], [0, 16]]
      }
    },
    "1": {
      props: {
        position: [1.1, 0, 0]
      }
    },
    "1.5": {
      props: {
        range: [[-3, 5], [0, 16]]
      }
    },
    "2.5": {
      props: {
        position: [0, 0, 0]
      }
    }
  }
}).slide({
  steps: 0,
  from: 0,
  to: 4
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 8
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  width: 17,
  channels: 2,
  expr: function(emit, x, i) {
    x = Math.ceil(x * 2) / 2;
    return emit(x, Math.pow(2, x));
  }
}).point({
  size: 10,
  color: blue
});

expoGraph2 = slides.slide({
  steps: 6
});

leftExpo2 = expoGraph2.reveal().cartesian({
  range: [[-4, 4], [0, 16]]
}).step({
  pace: 1.5,
  stops: [0, 1, 1, 2, 2, 3],
  script: [
    {
      props: {
        position: [-1.1, 0, 0]
      }
    }, {
      props: {
        position: [-1.1, 0, 0]
      }
    }, {
      props: {
        position: [0, 0, 0]
      }
    }, {
      props: {
        quaternion: [.707, .707, 0, 0]
      }
    }
  ]
}).shader({
  code: "uniform float power;\nvec4 transform(vec4 xyzw, inout vec4 stpq) {\n  xyzw.y = pow(xyzw.y, power);\n  return xyzw;\n}"
}).step({
  pace: 1.5,
  script: [
    {
      props: {
        power: 1
      }
    }, {
      props: {
        power: 2
      }
    }
  ]
}).vertex({
  pass: 'data'
}).slide({
  steps: 0,
  from: 0,
  to: 3
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 8
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  width: 17,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).point({
  size: 10,
  color: blue
});

rightExpo2 = expoGraph2.reveal().cartesian({
  id: "rightExpoView2",
  range: [[-4, 4], [0, 16]]
}).step({
  pace: 1.5,
  stops: [0, 0, 1, 2],
  script: {
    "0": {
      props: {
        position: [1.1, 0, 0]
      }
    },
    "1": {
      props: {
        range: [[-8, 8], [0, 16]]
      }
    },
    "2": {
      props: {
        position: [0, 0, 0]
      }
    }
  }
}).slide({
  steps: 0,
  from: 0,
  to: 3
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 8
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  range: [-8, 8],
  width: 33,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(2, x));
  }
}).interval({
  range: [-8, 8],
  width: 33,
  channels: 4,
  expr: function(emit, x, i) {
    var range, vis;
    range = rightExpoView2.get('range');
    vis = x >= range[0].x && x <= range[0].y;
    return emit(1, 1, 1, +vis);
  }
}).point({
  size: 10,
  color: blue,
  points: '<<',
  colors: '<'
});

rightExpoView2 = mathbox.select('#rightExpoView2');

quadraticGraph = slides.slide({
  steps: 6
});

leftQuad = quadraticGraph.reveal().cartesian({
  range: [[-4, 4], [-2, 16]]
}).step({
  pace: 1.5,
  stops: [0, 1, 1, 1, 2],
  script: [
    {
      props: {
        position: [0, 0, 0]
      }
    }, {
      props: {
        position: [-1.1, 0, 0]
      }
    }, {
      props: {
        position: [0, 0, 0]
      }
    }
  ]
}).shader({
  code: "uniform float power;\nvec4 transform(vec4 xyzw, inout vec4 stpq) {\n  xyzw.y += xyzw.x * power;\n  return xyzw;\n}"
}).step({
  pace: 1.5,
  stops: [0, 0, 1],
  script: [
    {
      props: {
        power: 0
      }
    }, {
      props: {
        power: 2
      }
    }
  ]
}).vertex({
  pass: 'data'
}).slide({
  steps: 0,
  from: 0,
  to: 4
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 10
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(x, 2));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  width: 17,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(x, 2));
  }
}).point({
  size: 10,
  color: blue
});

rightQuad = quadraticGraph.reveal().cartesian({
  id: "rightQuadView",
  range: [[-4, 4], [-2, 16]]
}).step({
  pace: 1.5,
  stops: [0, 1, 1, 2, 3],
  script: [
    {
      props: {
        position: [0, 0, 0]
      }
    }, {
      props: {
        position: [1.1, 0, 0]
      }
    }, {
      props: {
        range: [[-3, 5], [-1, 17]]
      }
    }, {
      props: {
        position: [0, 0, 0]
      }
    }
  ]
}).slide({
  steps: 0,
  from: 0,
  to: 4
}).reveal().grid({
  color: 0xC0C0C0,
  width: 1,
  divideX: 8,
  divideY: 10
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2
}).end().end().interval({
  width: 65,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(x, 2));
  }
}).line({
  width: 3,
  color: blue
}).interval({
  range: [-4, 4],
  width: 17,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.pow(x, 2));
  }
}).interval({
  range: [-4, 4],
  width: 17,
  channels: 4,
  expr: function(emit, x, i) {
    var range, vis;
    range = rightQuadView.get('range');
    vis = x >= range[0].x && x <= range[0].y;
    return emit(1, 1, 1, +vis);
  }
}).point({
  size: 10,
  color: blue,
  points: '<<',
  colors: '<'
});

rightQuadView = mathbox.select('#rightQuadView');

cosineGraph = slides.slide({
  steps: 6
});

cosineView = cosineGraph.reveal().cartesian({
  range: [[-6, 6], [-1, 1]],
  scale: [2, 1, 1]
}).step({
  pace: 1.5,
  script: [
    {
      props: {
        position: [0, 0, 0]
      }
    }, {
      props: {
        position: [0, -.4, 0]
      }
    }
  ]
}).shader({
  code: "uniform float absolute;\nuniform float square;\nvec4 transform(vec4 xyzw, inout vec4 stpq) {\n  xyzw.y = mix(xyzw.y, abs(xyzw.y), absolute);\n  xyzw.y = mix(xyzw.y, xyzw.y * xyzw.y, square);\n  return xyzw;\n}"
}).step({
  pace: 1.5,
  stops: [0, 1, 2],
  script: [
    {
      props: {
        absolute: 0,
        square: 0
      }
    }, {
      props: {
        absolute: 1
      }
    }, {
      props: {
        square: 1
      }
    }
  ]
}).vertex({
  pass: 'data'
}).grid({
  color: 0xC0C0C0,
  width: 1,
  detailY: 4,
  divideX: 8,
  divideY: 10
}).axis({
  axis: 'x',
  color: 0x0,
  width: 2
}).axis({
  axis: 'y',
  color: 0x0,
  width: 2,
  detail: 4
}).interval({
  width: 1025,
  channels: 2,
  expr: function(emit, x, i) {
    return emit(x, Math.cos(x));
  }
}).line({
  width: 3,
  color: blue
});

require('./present')(present, mathbox);



},{"./present":2}],2:[function(require,module,exports){
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



},{}]},{},[1]);
