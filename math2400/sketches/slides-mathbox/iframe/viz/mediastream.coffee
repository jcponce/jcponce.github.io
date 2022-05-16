getUserMedia = navigator.getUserMedia       ||
               navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia    ||
               navigator.msGetUserMedia;

open   = false
stream = null

getStream = (callback) ->
  throw "Error initializing getUserMedia" if !getUserMedia

  if stream?
    open = true
    return setTimeout () -> callback stream

  getUserMedia.call navigator, { audio: true },
    (s) ->
      stream = s
      open   = true
      callback stream
  , (code) ->
    throw "Error initializing getUserMedia"

closeStream = () ->
  return unless open

  open = false
  if stream
    stream.stop()
    stream = null

module.exports =
  (callback) ->
    getStream callback

    # API
    close: closeStream
