window.mathbox =
{mathbox, three} = mathBox
  plugins: ['core', 'controls', 'cursor']
  controls:
    klass: THREE.OrbitControls
    parameters:
      noPan: true
  camera:
    fov: 60
  splash:
    color: 'blue'

mathbox.set scale: 720, focus: 3

three.renderer.setClearColor new THREE.Color(0xFFFFFF), 1
three.camera.position.set 0, 0, 3

blue = 0x3090FF

present = mathbox.present()

slides =
  present
    .slide()

expoGraph1 =
  slides.slide
    steps: 6

leftExpo1 = expoGraph1
  .reveal()
    .cartesian
        range: [[-4, 4], [0, 16]]
      .step
        pace: 1.5,
        stops: [0, 1, 2, 2, 3]
        script: [
          {props: {scale: [1, 1, 1], position: [0, 0, 0]}}
          {props: {position: [-1.1, 0, 0]}}
          {props: {scale: [1, 2, 1], position: [-1.1, 1, 0]}}
          {props: {position: [0, 1, 0]}}
        ]
      .slide
          steps: 0
          from:  0
          to:    4
        .reveal()
          .grid
            color: 0xC0C0C0
            width: 1
            divideX: 8
            divideY: 8
          .axis
            axis: 'x'
            color: 0x0
            width: 2
          .axis
            axis: 'y'
            color: 0x0
            width: 2
        .end()
      .end()

      .interval
        width: 65
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow 2, x
      .line
        width: 3
        color: blue

      .interval
        width: 17
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow 2, x
      .point
        size: 10
        color: blue

rightExpo1 = expoGraph1
  .reveal()
    .cartesian()
      .step
        pace: 1.5,
        stops: [0, 1, 1, 1.5, 2.5]
        script: {
          "0":   {props: {position: [0, 0, 0], range: [[-4, 4], [0, 16]]}},
          "1":   {props: {position: [1.1, 0, 0]}},
          "1.5": {props: {range: [[-3, 5], [0, 16]]}},
          "2.5": {props: {position: [0, 0, 0]}},
        }
      .slide
          steps: 0
          from:  0
          to:    4
        .reveal()
          .grid
            color: 0xC0C0C0
            width: 1
            divideX: 8
            divideY: 8
          .axis
            axis: 'x'
            color: 0x0
            width: 2
          .axis
            axis: 'y'
            color: 0x0
            width: 2
        .end()
      .end()

      .interval
        width: 65
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow 2, x
      .line
        width: 3
        color: blue

      .interval
        width: 17
        channels: 2
        expr: (emit, x, i) ->
          x = Math.ceil(x * 2) / 2
          emit x, Math.pow 2, x
      .point
        size: 10
        color: blue

expoGraph2 =
  slides.slide
    steps: 6

leftExpo2 = expoGraph2
  .reveal()
    .cartesian
        range: [[-4, 4], [0, 16]]
      .step
        pace: 1.5,
        stops: [0, 1, 1, 2, 2, 3]
        script: [
          {props: {position: [-1.1, 0, 0]}}
          {props: {position: [-1.1, 0, 0]}}
          {props: {position: [0, 0, 0]}}
          {props: {quaternion: [.707, .707, 0, 0]}}
        ]
      .shader
        code: """
        uniform float power;
        vec4 transform(vec4 xyzw, inout vec4 stpq) {
          xyzw.y = pow(xyzw.y, power);
          return xyzw;
        }
        """
      .step
        pace: 1.5,
        script: [
          {props: {power: 1}}
          {props: {power: 2}}
        ]
      .vertex
          pass: 'data'
        .slide
            steps: 0
            from:  0
            to:    3
          .reveal()
            .grid
              color: 0xC0C0C0
              width: 1
              divideX: 8
              divideY: 8
            .axis
              axis: 'x'
              color: 0x0
              width: 2
            .axis
              axis: 'y'
              color: 0x0
              width: 2
          .end()
        .end()

        .interval
          width: 65
          channels: 2
          expr: (emit, x, i) ->
            emit x, Math.pow 2, x
        .line
          width: 3
          color: blue

        .interval
          width: 17
          channels: 2
          expr: (emit, x, i) ->
            emit x, Math.pow 2, x
        .point
          size: 10
          color: blue

rightExpo2 = expoGraph2
  .reveal()
    .cartesian
        id: "rightExpoView2"
        range: [[-4, 4], [0, 16]]
      .step
        pace: 1.5,
        stops: [0, 0, 1, 2]
        script: {
          "0": {props: {position: [1.1, 0, 0]}},
          "1": {props: {range: [[-8, 8], [0, 16]]}},
          "2": {props: {position: [0, 0, 0]}},
        }
      .slide
          steps: 0
          from:  0
          to:    3
        .reveal()
          .grid
            color: 0xC0C0C0
            width: 1
            divideX: 8
            divideY: 8
          .axis
            axis: 'x'
            color: 0x0
            width: 2
          .axis
            axis: 'y'
            color: 0x0
            width: 2
        .end()
      .end()

      .interval
        width: 65
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow 2, x
      .line
        width: 3
        color: blue

      .interval
        range: [-8, 8],
        width: 33
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow 2, x
      .interval
        range: [-8, 8],
        width: 33
        channels: 4
        expr: (emit, x, i) ->
          range = rightExpoView2.get 'range'
          vis = x >= range[0].x and x <= range[0].y
          emit 1, 1, 1, +vis
      .point
        size: 10
        color: blue
        points: '<<'
        colors: '<'

rightExpoView2 = mathbox.select '#rightExpoView2'

quadraticGraph =
  slides.slide
    steps: 6

leftQuad = quadraticGraph
  .reveal()
    .cartesian
        range: [[-4, 4], [-2, 16]]
      .step
        pace: 1.5,
        stops: [0, 1, 1, 1, 2]
        script: [
          {props: {position: [0, 0, 0]}}
          {props: {position: [-1.1, 0, 0]}}
          {props: {position: [0, 0, 0]}}
        ]
      .shader
        code: """
        uniform float power;
        vec4 transform(vec4 xyzw, inout vec4 stpq) {
          xyzw.y += xyzw.x * power;
          return xyzw;
        }
        """
      .step
        pace: 1.5,
        stops: [0, 0, 1]
        script: [
          {props: {power: 0}}
          {props: {power: 2}}
        ]
      .vertex
          pass: 'data'
        .slide
            steps: 0
            from:  0
            to:    4
          .reveal()
            .grid
              color: 0xC0C0C0
              width: 1
              divideX: 8
              divideY: 10
            .axis
              axis: 'x'
              color: 0x0
              width: 2
            .axis
              axis: 'y'
              color: 0x0
              width: 2
          .end()
        .end()

        .interval
          width: 65
          channels: 2
          expr: (emit, x, i) ->
            emit x, Math.pow x, 2
        .line
          width: 3
          color: blue

        .interval
          width: 17
          channels: 2
          expr: (emit, x, i) ->
            emit x, Math.pow x, 2
        .point
          size: 10
          color: blue

rightQuad = quadraticGraph
  .reveal()
    .cartesian
        id: "rightQuadView"
        range: [[-4, 4], [-2, 16]]
      .step
        pace: 1.5,
        stops: [0, 1, 1, 2, 3]
        script: [
          {props: {position: [0, 0, 0]}},
          {props: {position: [1.1, 0, 0]}},
          {props: {range: [[-3, 5], [-1, 17]]}},
          {props: {position: [0, 0, 0]}},
        ]
      .slide
          steps: 0
          from:  0
          to:    4
        .reveal()
          .grid
            color: 0xC0C0C0
            width: 1
            divideX: 8
            divideY: 10
          .axis
            axis: 'x'
            color: 0x0
            width: 2
          .axis
            axis: 'y'
            color: 0x0
            width: 2
        .end()
      .end()

      .interval
        width: 65
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow x, 2
      .line
        width: 3
        color: blue

      .interval
        range: [-4, 4],
        width: 17
        channels: 2
        expr: (emit, x, i) ->
          emit x, Math.pow x, 2
      .interval
        range: [-4, 4],
        width: 17
        channels: 4
        expr: (emit, x, i) ->
          range = rightQuadView.get 'range'
          vis = x >= range[0].x and x <= range[0].y
          emit 1, 1, 1, +vis
      .point
        size: 10
        color: blue
        points: '<<'
        colors: '<'

rightQuadView = mathbox.select '#rightQuadView'

cosineGraph =
  slides.slide
    steps: 6

cosineView =
  cosineGraph
  .reveal()
    .cartesian
        range: [[-6, 6], [-1, 1]]
        scale: [2, 1, 1]
      .step
        pace: 1.5,
        script: [
          {props: {position: [0, 0, 0]}},
          {props: {position: [0, -.4, 0]}},
        ]

      .shader
        code: """
        uniform float absolute;
        uniform float square;
        vec4 transform(vec4 xyzw, inout vec4 stpq) {
          xyzw.y = mix(xyzw.y, abs(xyzw.y), absolute);
          xyzw.y = mix(xyzw.y, xyzw.y * xyzw.y, square);
          return xyzw;
        }
        """
      .step
        pace: 1.5,
        stops: [0, 1, 2]
        script: [
          {props: {absolute: 0, square: 0}},
          {props: {absolute: 1}},
          {props: {square: 1}},
        ]
      .vertex
          pass: 'data'

        .grid
          color: 0xC0C0C0
          width: 1
          detailY: 4
          divideX: 8
          divideY: 10
        .axis
          axis: 'x'
          color: 0x0
          width: 2
        .axis
          axis: 'y'
          color: 0x0
          width: 2
          detail: 4

        .interval
          width: 1025
          channels: 2
          expr: (emit, x, i) ->
            emit x, Math.cos x
        .line
          width: 3
          color: blue

require('./present') present, mathbox