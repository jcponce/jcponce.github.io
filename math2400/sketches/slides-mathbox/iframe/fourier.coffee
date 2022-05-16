makeAnalyzer   = require './viz/analyzer'
makeDetector   = require './viz/detector'
getMediaStream = require './viz/mediastream'

blue = 0x3090FF
green = 0x60A010

# Initialize Mathbox
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
  mathbox:
    inspect: false

mathbox.set scale: 720, focus: 3

three.renderer.setClearColor new THREE.Color(0xFFFFFF), 1

# Initialize audio pipeline
analyzer = makeAnalyzer()
detector = makeDetector analyzer

music = false
btn = null
stream = null
el = null

btn = document.createElement('button')
btn.setAttribute('style', 'position: absolute; z-index: 10000; top: 5px; right: 5px; text-align: center; font-size: 16px; line-height: 24px')
btn.onclick = () ->
  if music then enableMicrophone() else enableMusic()
document.body.appendChild btn

enableMicrophone = () ->
  if el
    el.pause()
    el.src = null
    el = null

  stream = getMediaStream (stream) ->
    analyzer.attachToStream stream
    analyzer.passthroughVolume 0

  btn.innerHTML = "Use<br />Radio"
  music = false

enableMusic = () ->
  el = document.createElement 'audio'
  el.crossOrigin = 'anonymous'

  analyzer.passthroughVolume 0

  attached = false
  attach = () ->
    return if attached
    analyzer.attachToElement el

    volume = 0
    ramp = () ->
      volume += .02
      analyzer.passthroughVolume volume * volume
      requestAnimationFrame ramp if volume < 1

    attached = true
    ramp()

    el.play()

  el.oncanplay = attach
  el.src = 'http://fm.acko.net/1337.mp3'
  el.play()

  btn.innerHTML = "Use<br />Microphone"
  music = true

if window.location.host == 'localhost'
  enableMicrophone()
else
  enableMusic()

three.on 'update', analyzer.update

# Initialize slides
present = mathbox.present()

# Content
slides =
  present
    .slide()

props =
  slides
    .shader
      code: """
        uniform float skew;
        void main() { }
      """
      skew: 0

props
  .step
    pace: 1.5
    stops: [0, 0, 0, 0, 1, 2, 2, 3]
    script: [
      {props: {skew: 0}},
      {props: {skew: 1}},
      {props: {skew: 4}},
      {props: {skew: 16}},
    ]

graph =
  slides.slide
    steps: 10

# Principal demo band

graph
  .camera
    proxy: false
  .step
    rewind: 10
    pace: 1.5
    stops: [0, 0, 1, 1, 1, 2, 2, 3, 30, 35],
    script: {
      "0": {props: {position: [0, 0, 3],  lookAt: [0, 0, 0]}}
      "1": {props: {position: [-3.4, .13, 2.12], lookAt: [0, -.25, 0]}}
      "2": {props: {position: [-4, 0, 0], lookAt: [0, 0, 0]}}
      "3": {props: {position: [-3.4, .13, 2.12], lookAt: [0, -.25, 0]}}
      "3.3": {props: {position: [-3.4, .13, 2.12], lookAt: [0, -.25, 0]}}
      "30": {props: {position: [-3.4, .13, -37.88], lookAt: [0, -.25, -40]}}
      "35": {props: {position: [-20, 8, -20], lookAt: [0, -.25, -20]}}
    }

  .polar
      range: [[-π, π], [0, 1], [-3, 3]]
      scale: [1, 1, 2]
      quaternion: [0, .707, 0, .707]
      bend: 1,

    .transform {}, {
        matrix: () ->
          skew = props.get 'skew'
          [
            1, 0, skew, 0,
            0, 1, 0,    0,
            0, 0, 1,    0,
            0, 0, 0,    1,
          ]
      }

      .view
          range: [[-π, π], [-1, 1], [-3, 3]]

        .grid
          axes: 'yz'
          color: 0xc0c0c0
          width: 2
          detailY: 1025

        .area
          axes: 'yz'
          width: 2
          height: 1025
          expr: (emit, y, z) ->
            emit 0, y, z
        .surface
          color: 0xffffff
          opacity: .5
          zBias: -2.1
          zOrder: 1

        .axis
          axis: 'y'
          detail: 8
          color: 0x0
          width: 2

        .axis
          axis: 'z'
          detail: 8
          color: 0x0
          width: 2

      .end()

      .interval
        axis: 'z'
        width: 1024
        channels: 3
        history: 6,
        expr: (emit, z, i) ->
          emit 0, analyzer.time[i], z

      .interval
        width: 6
        range: [0, 1]
        expr: (emit, x, i) ->
          emit 1, 1, 1, 1 - x
      .repeat()
      .transpose
        order: 'yxzw'

      .line
        color: blue
        points: '<<<<'
        colors: '<'
        width: 3
        join: 'bevel'

    .end()

    .slide
        steps: 0
        from:  1
        to:    11
      .reveal()
        .view
            range: [[-π, π], [-1, 1], [-3, 3]]
          .axis
            axis: 'y'
            detail: 8
            color: 0x0
            width: 2
            origin: [0, 0, -3.5]

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = props.get 'skew'

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

        .end()
      .end()
    .end()

    .slide
        steps: 0
        from:  2
        to:    11
      .reveal
          delayEnter: 1.5
          duration: 1.5
        .grid
          axes: 'xy'
          color: 0x808080
          width: 1
          detailX: 65
          divideX: 8
          divideY: 10
          unitX: π
          origin: [0, 0, -3.5]
          zBias: 1
        .area
          rangeX: [-π, π]
          rangeY: [0, 1]
          width: 65
          height: 2
          expr: (emit, x, y) ->
            emit x, y, -3.5
        .surface
          color: 0xffffff
          opacity: .5
          zBias: 0
          zOrder: 1
      .end()
    .end()
  .end()

  # Band 15

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -2.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 15, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 960

              .area
                axes: 'yz'
                width: 2
                height: 960
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 15

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 14

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 14, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 896

              .area
                axes: 'yz'
                width: 2
                height: 896
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 14

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 13

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -7.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 13, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 832

              .area
                axes: 'yz'
                width: 2
                height: 832
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 13

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 12

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -10]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 12, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 768

              .area
                axes: 'yz'
                width: 2
                height: 768
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 12

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 11

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -12.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 11, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 704

              .area
                axes: 'yz'
                width: 2
                height: 704
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 11

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 10

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -15.0]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 10, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 640

              .area
                axes: 'yz'
                width: 2
                height: 640
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 10

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 9

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -17.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 9, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 576

              .area
                axes: 'yz'
                width: 2
                height: 576
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 9

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 8

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -20]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 8, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 512

              .area
                axes: 'yz'
                width: 2
                height: 512
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 8

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 7

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -22.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 7, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 448

              .area
                axes: 'yz'
                width: 2
                height: 448
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 7

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 6

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -25]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 6, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 384

              .area
                axes: 'yz'
                width: 2
                height: 384
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 6

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 5

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -27.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 5, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 320

              .area
                axes: 'yz'
                width: 2
                height: 320
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 5

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 4

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -30]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 4, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 256

              .area
                axes: 'yz'
                width: 2
                height: 256
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 4

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 3

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -32.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 3, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 192

              .area
                axes: 'yz'
                width: 2
                height: 192
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 3

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 2

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -35]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 2, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 128

              .area
                axes: 'yz'
                width: 2
                height: 128
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 2

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 1

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -37.5]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 1, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 64

              .area
                axes: 'yz'
                width: 2
                height: 64
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 1

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

  # Band 0

  .slide
      steps: 0
      from: 8
      to: 10
    .reveal
        duration: 1.5

      .transform
          position: [0, 0, -40]

        .polar
            range: [[-π, π], [0, 1], [-3, 3]]
            scale: [1, 1, 2]
            quaternion: [0, .707, 0, .707]
            bend: 1,

          .transform
              matrix:
                [
                  1, 0, 0, 0,
                  0, 1, 0, 0,
                  0, 0, 1, 0,
                  0, 0, 0, 1,
                ]

            .view
                range: [[-π, π], [-1, 1], [-3, 3]]

              .grid
                axes: 'yz'
                color: 0xc0c0c0
                width: 2
                detailY: 2

              .area
                axes: 'yz'
                width: 2
                height: 2
                expr: (emit, y, z) ->
                  emit 0, y, z
              .surface
                color: 0xffffff
                opacity: .5
                zBias: -2.1
                zOrder: 1

              .axis
                axis: 'y'
                detail: 8
                color: 0x0
                width: 2

              .axis
                axis: 'z'
                detail: 8
                color: 0x0
                width: 2

              .interval
                axis: 'z'
                width: 1024
                channels: 3
                history: 6,
                expr: (emit, z, i) ->
                  emit 0, analyzer.time[i], z

              .interval
                width: 6
                range: [0, 1]
                expr: (emit, x, i) ->
                  emit 1, 1, 1, 1 - x
              .repeat()
              .transpose
                order: 'yxzw'

              .line
                color: blue
                points: '<<<<'
                colors: '<'
                width: 3
                join: 'bevel'

            .end()
          .end()

          .view
              range: [[-π, π], [-1, 1], [-3, 3]]
            .axis
              axis: 'y'
              detail: 8
              color: 0x0
              width: 2
              origin: [0, 0, -3.5]
          .end()

          .interval
            range: [-3, 3]
            width: 2
            history: 8
            expr: (emit, x, i) ->
              if i == 0
                return emit 0, 0, -3.5
              else
                lvlX = lvlY = 0
                skew = 0

                for i in [0...1024]
                  θ = ((i / 1024) * 2 - 1) * 3 * skew
                  lvlX += analyzer.time[i] * Math.cos θ
                  lvlY += analyzer.time[i] * Math.sin θ

                r = 16 / 1024 * Math.sqrt lvlX * lvlX + lvlY * lvlY
                θ = Math.atan2 lvlY, lvlX

                emit θ, r, -3.5

          .interval
            width: 8
            range: [0, 1]
            expr: (emit, x, i) ->
              emit 1, 1, 1, 1 - x
          .repeat()
          .transpose
            order: 'yxzw'

          .slice
            source: '<<<<'
            width: [1, 1]
          .slice
            source: '<<'
            width: [1, 1]
          .point
            size: 10
            color: green
            points: '<<'
            colors: "<"
            zBias: 2
            zOrder: 2
            depth: .9

          .line
            end: true
            width: 4
            color: green
            points: '<6'
            colors: '<3'
            zBias: 2
            zOrder: 2
            depth: .9

          .grid
            axes: 'xy'
            color: 0x808080
            width: 1
            detailX: 65
            divideX: 8
            divideY: 10
            unitX: π
            origin: [0, 0, -3.5]
            zBias: 1
          .area
            rangeX: [-π, π]
            rangeY: [0, 1]
            width: 65
            height: 2
            expr: (emit, x, y) ->
              emit x, y, -3.5
          .surface
            color: 0xffffff
            opacity: .5
            zBias: 0
            zOrder: 1

        .end()
      .end()
    .end()
  .end()

require('./present') present, mathbox