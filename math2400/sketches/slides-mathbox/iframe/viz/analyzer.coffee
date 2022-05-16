module.exports = () ->
  source = null

  AudioContext = window.AudioContext || window.webkitAudioContext
  ctx = new AudioContext

  node = analyser = ctx.createAnalyser()
  analyser.smoothingTimeConstant = 0
  analyser.fftSize = 1024

  gain = ctx.createGain()
  gain.gain.value = 1

  freq = new Float32Array analyser.frequencyBinCount
  time = new Float32Array analyser.fftSize

  analyser.connect gain
  gain.connect ctx.destination

  self =

    freq: freq
    time: time
    toLinear: (v) -> (v - node.minDecibels) / (node.maxDecibels - node.minDecibels)

    detach: () ->
      source?.disconnect()
      source = null

    passthroughVolume: (value) ->
      gain.gain.value = value

    attachToElement: (element) ->
      self.detach()

      source = ctx.createMediaElementSource element
      source.connect analyser

    attachToStream: (stream) ->
      self.detach()

      source = ctx.createMediaStreamSource stream
      source.connect analyser

    update: () ->
      analyser?.getFloatFrequencyData  freq
      analyser?.getFloatTimeDomainData time

    close: () ->
      self.detach()
      ctx.close()

  self