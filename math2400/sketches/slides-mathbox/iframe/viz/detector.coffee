BASS_MID_FRACTION = .01
MID_TREBLE_FRACTION = .1
LERP_FACTOR = .2

module.exports = makeDetector = (analyzer) ->
  {freq, time, toLinear} = analyzer

  rms = (samples) ->
    n = samples.length || 1
    a = 0
    for i in [0...n]
      s = toLinear samples[i]
      a += s * s
    a / n

  levels = {
    bass:   0, mid:   0, treble:   0,
    itbass: 0, itmid: 0, ittreble: 0,
    smbass: 0, smmid: 0, smtreble: 0,
  }

  lerp = (a, b) -> a + (b - a) * LERP_FACTOR

  levels: levels
  update: () ->

    gain = 3

    freqSize = freq.length
    fftSize  = time.length

    a = Math.floor freqSize * BASS_MID_FRACTION
    b = Math.floor freqSize * MID_TREBLE_FRACTION
    c = freqSize

    levels.bass   = bass   = gain * rms freq.slice 0, a
    levels.mid    = mid    = gain * rms freq.slice a, b
    levels.treble = treble = gain * rms freq.slice b, c

    levels.itbass   = ib = lerp(levels.itbass, bass)
    levels.itmid    = im = lerp(levels.itmid, mid)
    levels.ittreble = it = lerp(levels.ittreble, treble)

    levels.smbass   = lerp(levels.smbass,   ib)
    levels.smmid    = lerp(levels.smmid,    im)
    levels.smtreble = lerp(levels.smtreble, it)

    levels